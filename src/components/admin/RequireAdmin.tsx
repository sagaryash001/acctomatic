import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth/useAuth";

/** Route guard for /admin/*: unauthenticated -> /login, signed in but not an admin -> /. */
export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="admin-shell admin-grid-bg flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <span className="h-2 w-2 animate-pulse-dot rounded-full bg-accent" />
          Authenticating…
        </div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (!profile?.is_admin) return <Navigate to="/" replace />;

  return <>{children}</>;
}
