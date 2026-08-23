import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth/useAuth";

/** Route guard for /admin/*: unauthenticated -> /login, signed in but not an admin -> /. */
export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (!profile?.is_admin) return <Navigate to="/" replace />;

  return <>{children}</>;
}
