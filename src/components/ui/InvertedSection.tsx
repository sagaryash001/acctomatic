import { cn } from "@/lib/utils";

/**
 * Strategic contrast-flip wrapper: deep foreground background, light text,
 * subtle dot-pattern texture. Use for stats, final CTAs, or spotlight content.
 */
export function InvertedSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden bg-foreground text-background", className)}>
      <div className="dot-pattern pointer-events-none absolute inset-0 opacity-[0.03]" />
      <div
        className="glow pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-accent opacity-[0.06]"
        aria-hidden
      />
      <div className="relative">{children}</div>
    </section>
  );
}
