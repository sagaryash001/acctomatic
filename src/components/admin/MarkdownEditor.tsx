import { Markdown } from "@/components/Markdown";
import { Textarea } from "@/components/ui";
import { AdminCard } from "@/components/admin/AdminCard";

/**
 * Plain textarea + live preview - deliberately not a full WYSIWYG editor.
 * This is an internal tool for a handful of content editors, not a product
 * feature, so a raw markdown source view is the right amount of tooling.
 */
export function MarkdownEditor({
  value,
  onChange,
  rows = 16,
}: {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">Markdown</p>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className="border-border bg-black/20 font-mono text-sm text-foreground focus:ring-offset-background"
        />
      </div>
      <div>
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">Preview</p>
        <AdminCard className="h-full">
          <Markdown
            content={value || "_Nothing to preview yet._"}
            className="prose prose-sm prose-invert max-w-none prose-headings:text-foreground prose-strong:text-foreground"
          />
        </AdminCard>
      </div>
    </div>
  );
}
