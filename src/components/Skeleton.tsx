import { cn } from "@/lib/utils";

/** Shimmering placeholder block for content that takes a moment to load (e.g. the hero video). */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton-shimmer", className)} aria-hidden />;
}
