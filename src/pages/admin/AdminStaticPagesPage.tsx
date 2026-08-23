import { useEffect, useState } from "react";
import { Button, Input } from "@/components/ui";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";
import { supabase } from "@/lib/supabase";
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
      <h1 className="text-2xl font-semibold tracking-[-0.01em]">Pages</h1>
      <p className="mt-1 text-sm text-muted-foreground">Privacy and Affiliate page content.</p>

      <div className="mt-6 flex gap-2">
        {SLUGS.map((slug) => (
          <button
            key={slug}
            onClick={() => setActiveSlug(slug)}
            className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors ${
              activeSlug === slug ? "bg-accent text-accent-foreground" : "bg-card text-muted-foreground"
            }`}
          >
            {slug}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-4 rounded-xl border border-border bg-card p-5">
        <Input
          placeholder="Title"
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
        />
        <MarkdownEditor value={draft.body} onChange={(body) => setDraft({ ...draft, body })} />
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm">
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
      </div>
    </div>
  );
}
