import { NavLink, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth/useAuth";

const NAV = [
  { to: "/admin/leads", label: "Leads" },
  { to: "/admin/faq", label: "FAQ" },
  { to: "/admin/blog", label: "Blog" },
  { to: "/admin/pricing", label: "Pricing" },
  { to: "/admin/pages", label: "Pages" },
];

export function AdminLayout() {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-muted">
      <div className="flex">
        <aside className="flex h-screen w-56 flex-shrink-0 flex-col border-r border-border bg-card p-4">
          <a href="/" className="mb-8 text-base font-semibold tracking-[-0.02em] text-foreground">
            acct<span className="gradient-text">omatic</span>
          </a>
          <nav className="flex-1 space-y-1">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive ? "bg-accent/10 text-accent" : "text-muted-foreground hover:bg-muted",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <button
            onClick={() => signOut()}
            className="rounded-lg px-3 py-2 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
          >
            Sign out
          </button>
        </aside>
        <main className="min-w-0 flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
