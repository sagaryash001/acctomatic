import { FileText, HelpCircle, Inbox, LogOut, Newspaper, Tag } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth/useAuth";

const NAV = [
  { to: "/admin/leads", label: "Leads", icon: Inbox },
  { to: "/admin/faq", label: "FAQ", icon: HelpCircle },
  { to: "/admin/blog", label: "Blog", icon: Newspaper },
  { to: "/admin/pricing", label: "Pricing", icon: Tag },
  { to: "/admin/pages", label: "Pages", icon: FileText },
];

export function AdminLayout() {
  const { profile, signOut } = useAuth();

  return (
    <div className="admin-shell admin-grid-bg relative min-h-screen text-foreground">
      {/* Ambient glow blobs - purely decorative, sit behind everything and
          never intercept pointer events. */}
      <div className="glow pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-accent opacity-[0.14]" />
      <div className="glow pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-accent-secondary opacity-[0.1]" />

      <div className="relative flex">
        <aside className="admin-glass sticky top-0 flex h-screen w-64 flex-shrink-0 flex-col p-5">
          <a href="/" className="mb-1 text-base font-semibold tracking-[-0.02em] text-foreground">
            acct<span className="gradient-text">omatic</span>
          </a>
          <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Control Panel
          </p>

          <nav className="flex-1 space-y-1">
            {NAV.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "group flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm font-medium transition-all",
                      isActive
                        ? "border-accent/30 bg-accent/10 text-accent shadow-[0_0_16px_-6px_rgba(61,123,255,0.7)]"
                        : "text-muted-foreground hover:border-border hover:bg-white/[0.03] hover:text-foreground",
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="space-y-3 border-t border-border pt-4">
            <div className="flex items-center gap-2 px-1">
              <span className="h-1.5 w-1.5 flex-shrink-0 animate-pulse-dot rounded-full bg-emerald-400" />
              <p className="truncate font-mono text-xs text-muted-foreground">{profile?.email ?? "admin"}</p>
            </div>
            <button
              onClick={() => signOut()}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-white/[0.03] hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 p-8 md:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
