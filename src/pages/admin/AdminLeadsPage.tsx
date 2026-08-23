import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Lead {
  id: string;
  created_at: string;
  name: string;
  email: string;
  company: string | null;
  doc_volume: string | null;
  tools: string | null;
  message: string;
  status: "new" | "contacted" | "qualified" | "closed";
}

const STATUSES: Lead["status"][] = ["new", "contacted", "qualified", "closed"];

export function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[] | null>(null);

  const load = () => {
    supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setLeads(data ?? []));
  };

  useEffect(load, []);

  const updateStatus = async (id: string, status: Lead["status"]) => {
    setLeads((prev) => prev?.map((lead) => (lead.id === id ? { ...lead, status } : lead)) ?? null);
    await supabase.from("leads").update({ status }).eq("id", id);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-[-0.01em]">Leads</h1>
      <p className="mt-1 text-sm text-muted-foreground">Contact form submissions.</p>

      <div className="mt-6 space-y-4">
        {leads === null && <p className="text-sm text-muted-foreground">Loading…</p>}
        {leads?.length === 0 && <p className="text-sm text-muted-foreground">No leads yet.</p>}
        {leads?.map((lead) => (
          <div key={lead.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-foreground">
                  {lead.name} <span className="font-normal text-muted-foreground">&lt;{lead.email}&gt;</span>
                </p>
                {lead.company && <p className="text-sm text-muted-foreground">{lead.company}</p>}
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(lead.created_at).toLocaleString()}
                  {lead.doc_volume && ` · ${lead.doc_volume} docs/mo`}
                  {lead.tools && ` · ${lead.tools}`}
                </p>
              </div>
              <select
                value={lead.status}
                onChange={(e) => updateStatus(lead.id, e.target.value as Lead["status"])}
                className="rounded-lg border border-border bg-transparent px-3 py-1.5 text-sm capitalize"
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <p className="mt-3 text-sm text-foreground">{lead.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
