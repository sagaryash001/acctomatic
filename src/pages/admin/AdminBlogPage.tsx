import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";
import { supabase } from "@/lib/supabase";
import type { BlogPost } from "@/lib/content";

const EMPTY = { slug: "", title: "", excerpt: "", body: "", author_name: "", published: false };

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[] | null>(null);
  const [draft, setDraft] = useState(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setPosts(data ?? []));
  };

  useEffect(load, []);

  const startEdit = (post: BlogPost) => {
    setEditingId(post.id);
    setDraft({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt ?? "",
      body: post.body,
      author_name: post.author_name ?? "",
      published: post.published,
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setDraft(EMPTY);
  };

  const save = async () => {
    setSaving(true);
    const payload = {
      slug: draft.slug || slugify(draft.title),
      title: draft.title,
      excerpt: draft.excerpt || null,
      body: draft.body,
      author_name: draft.author_name || null,
      published: draft.published,
      published_at: draft.published ? new Date().toISOString() : null,
    };
    if (editingId) {
      await supabase.from("blog_posts").update(payload).eq("id", editingId);
    } else {
      await supabase.from("blog_posts").insert(payload);
    }
    setSaving(false);
    resetForm();
    load();
  };

  const remove = async (id: string) => {
    await supabase.from("blog_posts").delete().eq("id", id);
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-[-0.01em]">Blog</h1>
      <p className="mt-1 text-sm text-muted-foreground">Shown on /blog when published.</p>

      <div className="mt-6 rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold">{editingId ? "Edit post" : "New post"}</h2>
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap gap-3">
            <Input
              placeholder="Title"
              className="max-w-sm"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            />
            <Input
              placeholder="URL slug (auto from title if empty)"
              className="max-w-sm"
              value={draft.slug}
              onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
            />
            <Input
              placeholder="Author"
              className="max-w-[200px]"
              value={draft.author_name}
              onChange={(e) => setDraft({ ...draft, author_name: e.target.value })}
            />
          </div>
          <Input
            placeholder="Excerpt"
            value={draft.excerpt}
            onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
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
            <div className="flex gap-2">
              <Button size="sm" onClick={save} disabled={saving || !draft.title || !draft.body}>
                {editingId ? "Save changes" : "Add post"}
              </Button>
              {editingId && (
                <Button size="sm" variant="ghost" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {posts?.map((post) => (
          <div key={post.id} className="flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-4">
            <button className="min-w-0 flex-1 text-left" onClick={() => startEdit(post)}>
              <p className="font-medium text-foreground">{post.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {post.published ? "Published" : "Draft"} · /blog/{post.slug}
              </p>
            </button>
            <button
              onClick={() => remove(post.id)}
              aria-label="Delete"
              className="flex-shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
