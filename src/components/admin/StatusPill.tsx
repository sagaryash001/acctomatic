import { cn } from "@/lib/utils";

const TONES = {
  blue: "border-blue-400/30 bg-blue-400/10 text-blue-300 shadow-[0_0_12px_-2px_rgba(96,165,250,0.5)]",
  amber: "border-amber-400/30 bg-amber-400/10 text-amber-300 shadow-[0_0_12px_-2px_rgba(251,191,36,0.5)]",
  emerald: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300 shadow-[0_0_12px_-2px_rgba(52,211,153,0.5)]",
  slate: "border-slate-400/25 bg-slate-400/10 text-slate-300",
} as const;

export function StatusPill({
  label,
  tone = "slate",
  pulse = false,
}: {
  label: string;
  tone?: keyof typeof TONES;
  pulse?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.1em]",
        TONES[tone],
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full bg-current", pulse && "animate-pulse-dot")} />
      {label}
    </span>
  );
}
