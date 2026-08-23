import { Markdown } from "@/components/Markdown";
import { Textarea } from "@/components/ui";

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
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
          Markdown
        </p>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className="font-mono text-sm"
        />
      </div>
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">Preview</p>
        <div className="h-full rounded-xl border border-border bg-card p-4">
          <Markdown content={value || "_Nothing to preview yet._"} className="prose prose-sm max-w-none" />
        </div>
      </div>
    </div>
  );
}
