import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useDoors } from "@/components/DoorsTransition";
import { cn } from "@/lib/utils";

interface MegaMenuLink {
  label: string;
  description: string;
  path: string;
}

const COMPANY_LINKS: MegaMenuLink[] = [
  { label: "Team", description: "Who's building Acctomatic", path: "/team" },
  { label: "Blog", description: "Updates and product notes", path: "/blog" },
  { label: "Affiliate", description: "Partner with Acctomatic", path: "/affiliate" },
];

const RESOURCE_LINKS: MegaMenuLink[] = [
  { label: "FAQ", description: "Common questions, answered", path: "/faq" },
  { label: "Pricing", description: "Plans for every team size", path: "/pricing" },
  { label: "Privacy", description: "How we handle your data", path: "/privacy" },
];

/** Nav dropdown revealing the secondary pages, positioned below the trigger. */
export function MegaMenu({ dark = false }: { dark?: boolean }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { navigateWithDoors } = useDoors();

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const go = (path: string) => {
    setOpen(false);
    navigateWithDoors(path);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(
          "flex items-center gap-1.5 rounded-xl border px-5 py-2 text-sm font-medium backdrop-blur-sm transition-colors",
          dark
            ? "border-white/50 bg-black/20 text-white hover:border-white/80 hover:bg-black/35"
            : "border-border bg-card text-foreground shadow-sm hover:border-accent/30",
        )}
      >
        Company
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="glass-panel absolute right-0 top-full z-50 mt-3 w-[420px] rounded-2xl p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">Company</h4>
              <ul className="mt-3 space-y-3">
                {COMPANY_LINKS.map((link) => (
                  <li key={link.path}>
                    <button onClick={() => go(link.path)} className="group block text-left">
                      <span className="block text-sm font-semibold text-foreground group-hover:text-accent">
                        {link.label}
                      </span>
                      <span className="block text-xs text-muted-foreground">{link.description}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">Resources</h4>
              <ul className="mt-3 space-y-3">
                {RESOURCE_LINKS.map((link) => (
                  <li key={link.path}>
                    <button onClick={() => go(link.path)} className="group block text-left">
                      <span className="block text-sm font-semibold text-foreground group-hover:text-accent">
                        {link.label}
                      </span>
                      <span className="block text-xs text-muted-foreground">{link.description}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
