import { marked } from "marked";

/**
 * Renders admin-authored markdown (privacy/affiliate pages, FAQ answers,
 * blog posts). Content is only ever written by is_admin() accounts via the
 * admin UI - trusted authors, not arbitrary user input - so rendering the
 * parsed HTML directly is an acceptable trade-off for this scope.
 */
export function Markdown({ content, className }: { content: string; className?: string }) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: marked.parse(content, { async: false }) }} />;
}
