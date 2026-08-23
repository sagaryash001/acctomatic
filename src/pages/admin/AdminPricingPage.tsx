import { useEffect, useState } from "react";
import { Tag, Trash2 } from "lucide-react";
import { Button, Input, Textarea } from "@/components/ui";
import { AdminCard } from "@/components/admin/AdminCard";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusPill } from "@/components/admin/StatusPill";
import { supabase } from "@/lib/supabase";
import type { PricingPlan } from "@/lib/content";

const EMPTY = {
  name: "",
  tagline: "",
  price_monthly: "",
  is_custom_pricing: false,
  features: "",
  cta_label: "Talk to Sales",
  highlighted: false,
  sort_order: 0,
  published: false,
};

export function AdminPricingPage() {
  const [plans, setPlans] = useState<PricingPlan[] | null>(null);
  const [draft, setDraft] = useState(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    supabase
      .from("pricing_plans")
      .select("*")
      .order("sort_order", { ascending: true })
      .then(({ data }) => setPlans(data ?? []));
  };

  useEffect(load, []);

  const startEdit = (plan: PricingPlan) => {
    setEditingId(plan.id);
    setDraft({
      name: plan.name,
      tagline: plan.tagline ?? "",
      price_monthly: plan.price_monthly?.toString() ?? "",
      is_custom_pricing: plan.is_custom_pricing,
      features: plan.features.join("\n"),
      cta_label: plan.cta_label,
      highlighted: plan.highlighted,
      sort_order: plan.sort_order,
      published: plan.published,
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setDraft(EMPTY);
  };

  const save = async () => {
    setSaving(true);
    const payload = {
      name: draft.name,
      tagline: draft.tagline || null,
      price_monthly: draft.price_monthly ? Number(draft.price_monthly) : null,
      is_custom_pricing: draft.is_custom_pricing,
      features: draft.features.split("\n").map((f) => f.trim()).filter(Boolean),
      cta_label: draft.cta_label,
      highlighted: draft.highlighted,
      sort_order: draft.sort_order,
      published: draft.published,
    };
    if (editingId) {
      await supabase.from("pricing_plans").update(payload).eq("id", editingId);
    } else {
      await supabase.from("pricing_plans").insert(payload);
    }
    setSaving(false);
    resetForm();
    load();
  };

  const remove = async (id: string) => {
    await supabase.from("pricing_plans").delete().eq("id", id);
    load();
  };

  return (
    <div>
      <PageHeader icon={Tag} title="Pricing" subtitle="Shown on /pricing when published." />

      <AdminCard>
        <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-accent">
          {editingId ? "Edit plan" : "New plan"}
        </h2>
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap gap-3">
            <Input
              placeholder="Name"
              className="max-w-xs"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />
            <Input
              placeholder="Tagline"
              className="max-w-xs"
              value={draft.tagline}
              onChange={(e) => setDraft({ ...draft, tagline: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Price / mo"
              className="max-w-[140px]"
              value={draft.price_monthly}
              onChange={(e) => setDraft({ ...draft, price_monthly: e.target.value })}
              disabled={draft.is_custom_pricing}
            />
          </div>
          <Textarea
            placeholder="Features - one per line"
            rows={4}
            value={draft.features}
            onChange={(e) => setDraft({ ...draft, features: e.target.value })}
          />
          <div className="flex flex-wrap items-center gap-4">
            <Input
              placeholder="CTA label"
              className="max-w-[180px]"
              value={draft.cta_label}
              onChange={(e) => setDraft({ ...draft, cta_label: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Sort order"
              className="max-w-[120px]"
              value={draft.sort_order}
              onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })}
            />
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={draft.is_custom_pricing}
                onChange={(e) => setDraft({ ...draft, is_custom_pricing: e.target.checked })}
              />
              Custom pricing
            </label>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={draft.highlighted}
                onChange={(e) => setDraft({ ...draft, highlighted: e.target.checked })}
              />
              Highlighted
            </label>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={draft.published}
                onChange={(e) => setDraft({ ...draft, published: e.target.checked })}
              />
              Published
            </label>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={save} disabled={saving || !draft.name}>
              {editingId ? "Save changes" : "Add plan"}
            </Button>
            {editingId && (
              <Button size="sm" variant="ghost" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      </AdminCard>

      <div className="mt-6 space-y-3">
        {plans?.map((plan) => (
          <AdminCard key={plan.id} className="flex items-start justify-between gap-4 p-4">
            <button className="min-w-0 flex-1 text-left" onClick={() => startEdit(plan)}>
              <p className="font-medium text-foreground">
                {plan.name}{" "}
                <span className="font-mono text-sm font-normal text-accent">
                  {plan.is_custom_pricing ? "custom" : plan.price_monthly != null ? `$${plan.price_monthly}/mo` : ""}
                </span>
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <StatusPill
                  label={plan.published ? "Published" : "Draft"}
                  tone={plan.published ? "emerald" : "slate"}
                  pulse={plan.published}
                />
                {plan.highlighted && <StatusPill label="Highlighted" tone="blue" />}
                <span className="font-mono text-[11px] text-muted-foreground">order {plan.sort_order}</span>
              </div>
            </button>
            <button
              onClick={() => remove(plan.id)}
              aria-label="Delete"
              className="flex-shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-white/[0.05] hover:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}
