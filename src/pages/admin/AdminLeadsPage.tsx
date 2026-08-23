import { useEffect, useState } from "react";
import { Inbox } from "lucide-react";
import { AdminCard } from "@/components/admin/AdminCard";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusPill } from "@/components/admin/StatusPill";
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
const STATUS_TONE: Record<Lead["status"], "blue" | "amber" | "emerald" | "slate"> = {
  new: "blue",
  contacted: "amber",
  qualified: "emerald",
  closed: "slate",
};

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

  const counts = STATUSES.map((status) => ({
    status,
    count: leads?.filter((lead) => lead.status === status).length ?? 0,
  }));

  return (
    <div>
      <PageHeader icon={Inbox} title="Leads" subtitle="Contact form submissions." />

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {counts.map(({ status, count }) => (
          <AdminCard key={status} className="text-center">
            <p className="font-mono text-3xl font-semibold text-foreground">{count}</p>
            <div className="mt-2 flex justify-center">
              <StatusPill label={status} tone={STATUS_TONE[status]} />
            </div>
          </AdminCard>
        ))}
      </div>

      <div className="space-y-4">
        {leads === null && <p className="text-sm text-muted-foreground">Loading…</p>}
        {leads?.length === 0 && <p className="text-sm text-muted-foreground">No leads yet.</p>}
        {leads?.map((lead) => (
          <AdminCard key={lead.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-foreground">
                  {lead.name} <span className="font-normal text-muted-foreground">&lt;{lead.email}&gt;</span>
                </p>
                {lead.company && <p className="text-sm text-muted-foreground">{lead.company}</p>}
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  {new Date(lead.created_at).toLocaleString()}
                  {lead.doc_volume && ` · ${lead.doc_volume} docs/mo`}
                  {lead.tools && ` · ${lead.tools}`}
                </p>
              </div>
              <select
                value={lead.status}
                onChange={(e) => updateStatus(lead.id, e.target.value as Lead["status"])}
                className="rounded-lg border border-border bg-black/20 px-3 py-1.5 text-sm capitalize text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status} className="bg-[#0a0f1e]">
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <p className="mt-3 border-t border-border pt-3 text-sm text-foreground/90">{lead.message}</p>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}
