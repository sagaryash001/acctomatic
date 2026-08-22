import { ArrowLeft } from "lucide-react";
import { LinkButton } from "@/components/ui";
import { useDoors } from "@/components/DoorsTransition";
import { Footer } from "@/components/Footer";
import { MegaMenu } from "@/components/MegaMenu";
import { ScrambleText } from "@/components/ScrambleText";
import { Section } from "@/components/Section";
import { type ContactOrigin } from "@/components/ContactModal";

export function NotFoundPage({
  contactModal,
}: {
  contactModal: { origin: ContactOrigin | null; open: (event: React.MouseEvent) => void; close: () => void };
}) {
  const { navigateWithDoors } = useDoors();

  const goHome = (event: React.MouseEvent) => {
    event.preventDefault();
    navigateWithDoors("/");
  };

  return (
    <div className="bg-mesh min-h-screen">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-7">
        <a href="/" onClick={goHome} className="text-lg font-semibold tracking-[-0.02em] text-foreground">
          acct<span className="gradient-text">omatic</span>
        </a>
        <div className="flex items-center gap-3">
          <MegaMenu />
          <button
            onClick={contactModal.open}
            className="rounded-xl border border-border bg-card px-5 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-accent/30"
          >
            Contact Us
          </button>
          <LinkButton href="/#get-started" variant="primary" size="md">
            <ScrambleText text="Get Started" />
          </LinkButton>
        </div>
      </nav>

      <Section className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="glass-panel max-w-lg rounded-[2rem] p-10 md:p-14">
          <span className="font-mono text-sm uppercase tracking-[0.15em] text-accent">Error 404</span>
          <h1 className="mt-4 text-5xl tracking-[-0.02em] md:text-7xl">Page not found.</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            The page you're looking for doesn't exist or has moved.
          </p>
          <a
            href="/"
            onClick={goHome}
            className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-accent"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Acctomatic
          </a>
        </div>
      </Section>

      <Footer onContactClick={contactModal.open} />
    </div>
  );
}
