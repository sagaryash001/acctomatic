import { cn } from "@/lib/utils";

/** Three-dot pulse loader, reused for Suspense fallbacks and buffering states. */
export function PulseDots({ className, dotClassName }: { className?: string; dotClassName?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)} role="status" aria-label="Loading">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn("h-3 w-3 animate-pulse-dot rounded-full bg-accent", dotClassName)}
          style={{ animationDelay: `${i * 0.16}s`, animationDuration: "0.9s" }}
        />
      ))}
    </div>
  );
}
