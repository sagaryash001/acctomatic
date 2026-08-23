import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { Button, Input, Textarea } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import type { FaqItem } from "@/lib/content";

const EMPTY = { question: "", answer: "", category: "", sort_order: 0, published: false };

export function AdminFaqPage() {
  const [items, setItems] = useState<FaqItem[] | null>(null);
  const [draft, setDraft] = useState(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    supabase
      .from("faq_items")
      .select("*")
      .order("sort_order", { ascending: true })
      .then(({ data }) => setItems(data ?? []));
  };

  useEffect(load, []);

  const startEdit = (item: FaqItem) => {
    setEditingId(item.id);
    setDraft({
      question: item.question,
      answer: item.answer,
      category: item.category ?? "",
      sort_order: item.sort_order,
      published: item.published,
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setDraft(EMPTY);
  };

  const save = async () => {
    setSaving(true);
    const payload = { ...draft, category: draft.category || null };
    if (editingId) {
      await supabase.from("faq_items").update(payload).eq("id", editingId);
    } else {
      await supabase.from("faq_items").insert(payload);
    }
    setSaving(false);
    resetForm();
    load();
  };

  const remove = async (id: string) => {
    await supabase.from("faq_items").delete().eq("id", id);
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-[-0.01em]">FAQ</h1>
      <p className="mt-1 text-sm text-muted-foreground">Shown on /faq when published.</p>

      <div className="mt-6 rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold">{editingId ? "Edit question" : "New question"}</h2>
        <div className="mt-4 space-y-3">
          <Input
            placeholder="Question"
            value={draft.question}
            onChange={(e) => setDraft({ ...draft, question: e.target.value })}
          />
          <Textarea
            placeholder="Answer (markdown)"
            rows={4}
            value={draft.answer}
            onChange={(e) => setDraft({ ...draft, answer: e.target.value })}
          />
          <div className="flex flex-wrap items-center gap-3">
            <Input
              placeholder="Category (optional)"
              className="max-w-xs"
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Sort order"
              className="max-w-[120px]"
              value={draft.sort_order}
              onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })}
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={draft.published}
                onChange={(e) => setDraft({ ...draft, published: e.target.checked })}
              />
              Published
            </label>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={save}
              disabled={saving || !draft.question || !draft.answer}
            >
              {editingId ? "Save changes" : "Add question"}
            </Button>
            {editingId && (
              <Button size="sm" variant="ghost" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {items?.map((item) => (
          <div key={item.id} className="flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-4">
            <button className="min-w-0 flex-1 text-left" onClick={() => startEdit(item)}>
              <p className="font-medium text-foreground">{item.question}</p>
              <p className="mt-1 truncate text-sm text-muted-foreground">{item.answer}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {item.published ? "Published" : "Draft"} · order {item.sort_order}
                {item.category && ` · ${item.category}`}
              </p>
            </button>
            <button
              onClick={() => remove(item.id)}
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
