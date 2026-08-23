import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { AdminCard } from "@/components/admin/AdminCard";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";
import { PageHeader } from "@/components/admin/PageHeader";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import type { StaticPage } from "@/lib/content";

// Fixed set of slugs - this is an edit-only tool, not a page creator, since
// every route that reads a static_pages row (/privacy, /affiliate) expects
// a specific known slug.
const SLUGS = ["privacy", "affiliate"] as const;

export function AdminStaticPagesPage() {
  const [pages, setPages] = useState<Record<string, StaticPage | null>>({});
  const [activeSlug, setActiveSlug] = useState<(typeof SLUGS)[number]>("privacy");
  const [draft, setDraft] = useState({ title: "", body: "", published: false });
  const [saving, setSaving] = useState(false);

  const load = () => {
    SLUGS.forEach((slug) => {
      supabase
        .from("static_pages")
        .select("*")
        .eq("slug", slug)
        .maybeSingle()
        .then(({ data }) => setPages((prev) => ({ ...prev, [slug]: data })));
    });
  };

  useEffect(load, []);

  useEffect(() => {
    const page = pages[activeSlug];
    setDraft({ title: page?.title ?? "", body: page?.body ?? "", published: page?.published ?? false });
  }, [activeSlug, pages]);

  const save = async () => {
    setSaving(true);
    await supabase.from("static_pages").upsert({ slug: activeSlug, ...draft });
    setSaving(false);
    load();
  };

  return (
    <div>
      <PageHeader icon={FileText} title="Pages" subtitle="Privacy and Affiliate page content." />

      <div className="mb-4 flex gap-2">
        {SLUGS.map((slug) => (
          <button
            key={slug}
            onClick={() => setActiveSlug(slug)}
            className={cn(
              "rounded-xl border px-4 py-2 text-sm font-medium capitalize transition-all",
              activeSlug === slug
                ? "border-accent/30 bg-accent/10 text-accent shadow-[0_0_16px_-6px_rgba(61,123,255,0.7)]"
                : "border-border text-muted-foreground hover:bg-white/[0.03] hover:text-foreground",
            )}
          >
            {slug}
          </button>
        ))}
      </div>

      <AdminCard className="space-y-4">
        <Input
          placeholder="Title"
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
        />
        <MarkdownEditor value={draft.body} onChange={(body) => setDraft({ ...draft, body })} />
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={draft.published}
              onChange={(e) => setDraft({ ...draft, published: e.target.checked })}
            />
            Published
          </label>
          <Button size="sm" onClick={save} disabled={saving || !draft.title || !draft.body}>
            Save changes
          </Button>
        </div>
      </AdminCard>
    </div>
  );
}
