import { useState } from "react";
import { Badge, Button, Input } from "@/components/ui";
import { useDoors } from "@/components/DoorsTransition";
import { useAuth } from "@/lib/auth/useAuth";

/**
 * Shared magic-link form for both signup and login - with a passwordless
 * flow they're the same request (signInWithOtp creates the user if the
 * email is new), so only the copy differs between the two pages.
 */
export function AuthForm({ badge, title, subtitle }: { badge: string; title: string; subtitle: string }) {
  const { navigateWithDoors } = useDoors();
  const { signInWithOtp } = useAuth();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: otpError } = await signInWithOtp(email);
    setSubmitting(false);
    if (otpError) {
      setError(otpError);
      return;
    }
    navigateWithDoors("/check-email");
  };

  return (
    <div className="glass-panel max-w-md rounded-[2rem] p-10 md:p-14">
      <Badge pulse>{badge}</Badge>
      <h1 className="mt-5 text-3xl tracking-[-0.02em] md:text-4xl">{title}</h1>
      <p className="mt-4 text-muted-foreground">{subtitle}</p>
      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <Input
          type="email"
          required
          placeholder="jane@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={submitting}>
          {submitting ? "Sending…" : "Continue with email"}
        </Button>
      </form>
      <p className="mt-6 text-sm text-muted-foreground">
        We'll email you a link - no password to remember.
      </p>
    </div>
  );
}
