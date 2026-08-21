import { type AnchorHTMLAttributes, type HTMLAttributes, forwardRef } from "react";
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

export interface ClickableCardProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  elevated?: boolean;
}

/**
 * Interactive variant of Card: renders as an anchor, lifts and deepens shadow
 * on hover/focus, and gains a visible accent ring for keyboard focus.
 */
export const ClickableCard = forwardRef<HTMLAnchorElement, ClickableCardProps>(
  ({ className, elevated, ...props }, ref) => (
    <a
      ref={ref}
      className={cn(
        "group block rounded-2xl border border-border bg-card p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        elevated && "shadow-xl",
        className,
      )}
      {...props}
    />
  ),
);
ClickableCard.displayName = "ClickableCard";

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

export interface FeaturedClickableCardProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  contentClassName?: string;
}

/**
 * Interactive variant of FeaturedCard: gradient-stroke border, lifts on hover/focus.
 */
export const FeaturedClickableCard = forwardRef<HTMLAnchorElement, FeaturedClickableCardProps>(
  ({ className, contentClassName, children, ...props }, ref) => (
    <a
      ref={ref}
      className={cn(
        "group block rounded-2xl bg-gradient-to-br from-accent via-accent-secondary to-accent p-[2px] shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-accent-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
      {...props}
    >
      <div className={cn("h-full w-full rounded-[calc(16px-2px)] bg-card p-6", contentClassName)}>
        {children}
      </div>
    </a>
  ),
);
FeaturedClickableCard.displayName = "FeaturedClickableCard";
