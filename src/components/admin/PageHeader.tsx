import type { ComponentType } from "react";

export function PageHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-8 flex items-center gap-4">
      <div className="admin-glass admin-glow-ring flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-accent">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.01em] text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}
