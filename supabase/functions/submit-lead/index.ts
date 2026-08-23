import { createClient } from "npm:@supabase/supabase-js@2";

// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are auto-injected into every
// Edge Function's runtime by Supabase - no manual secret needed for these.
const supabaseAdmin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

const VOLUMES = ["Under 100", "100–1,000", "1,000–10,000", "10,000+"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT_WINDOW_MS = 10 * 60_000;
const RATE_LIMIT_MAX = 3;

interface SubmitLeadBody {
  name: string;
  email: string;
  company?: string;
  docVolume?: string;
  tools?: string;
  message: string;
  hpField?: string; // honeypot - real users never see or fill this
}

// Deno.serve doesn't add CORS headers on its own - without these, the
// browser's preflight OPTIONS request gets no Access-Control-Allow-* headers
// back, fails, and the browser never sends the real POST at all (this is
// invisible in server logs since the request never lands past the preflight).
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ ok: false, error: "method_not_allowed" }, 405);

  let body: SubmitLeadBody;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ ok: false, error: "invalid_json" }, 400);
  }

  const { name, email, company, docVolume, tools, message, hpField } = body;

  // Honeypot: bots fill every field, real users never see this one (it's
  // visually hidden in the form). Fake success so bots don't learn to skip it.
  if (hpField) return jsonResponse({ ok: true }, 200);

  if (!name?.trim() || !email?.trim() || !message?.trim() || !EMAIL_RE.test(email)) {
    return jsonResponse({ ok: false, error: "invalid_input" }, 400);
  }
  if (docVolume && !VOLUMES.includes(docVolume)) {
    return jsonResponse({ ok: false, error: "invalid_input" }, 400);
  }

  const { count, error: countError } = await supabaseAdmin
    .from("leads")
    .select("id", { count: "exact", head: true })
    .eq("email", email)
    .gte("created_at", new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString());
  if (countError) return jsonResponse({ ok: false, error: "server_error" }, 500);
  if ((count ?? 0) >= RATE_LIMIT_MAX) return jsonResponse({ ok: false, error: "rate_limited" }, 429);

  const { error: insertError } = await supabaseAdmin.from("leads").insert({
    name: name.trim(),
    email: email.trim(),
    company: company?.trim() || null,
    doc_volume: docVolume || null,
    tools: tools?.trim() || null,
    message: message.trim(),
  });
  if (insertError) return jsonResponse({ ok: false, error: "server_error" }, 500);

  // Best-effort notification email - a missing/misconfigured provider
  // should never fail the lead capture itself, which is the critical path.
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  const notifyTo = Deno.env.get("LEAD_NOTIFICATION_EMAIL");
  if (resendApiKey && notifyTo) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendApiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: Deno.env.get("LEAD_NOTIFICATION_FROM") ?? "Acctomatic Leads <onboarding@resend.dev>",
          to: notifyTo,
          subject: `New lead: ${name}${company ? ` (${company})` : ""}`,
          text: `${name} <${email}>\nCompany: ${company ?? "—"}\nVolume: ${docVolume ?? "—"}\nTools: ${tools ?? "—"}\n\n${message}`,
        }),
      });
    } catch (err) {
      console.error("submit-lead: notification email failed", err);
    }
  } else {
    console.warn("submit-lead: RESEND_API_KEY or LEAD_NOTIFICATION_EMAIL not set, skipping notification email");
  }

  return jsonResponse({ ok: true }, 200);
});
