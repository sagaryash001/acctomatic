import { ArrowLeft } from "lucide-react";
import { useDoors } from "@/components/DoorsTransition";
import { Footer } from "@/components/Footer";
import { PageNav } from "@/components/PageNav";
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
      <PageNav contactModal={contactModal} />

      <Section className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center sm:px-6">
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
