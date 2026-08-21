import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, elevated, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border border-border bg-card p-6 shadow-md transition-shadow duration-300",
        elevated ? "shadow-xl" : "hover:shadow-xl",
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = "Card";

/**
 * Gradient-stroke card for featured/highlighted content (pricing tiers, spotlighted items).
 * Wraps children in a 2px gradient border via a nested inset panel.
 */
export function FeaturedCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("rounded-2xl bg-gradient-to-br from-accent via-accent-secondary to-accent p-[2px]", className)}>
      <div className="h-full w-full rounded-[calc(16px-2px)] bg-card p-6">{children}</div>
    </div>
  );
}
