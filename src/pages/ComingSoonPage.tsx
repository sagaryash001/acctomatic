import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui";
import { useDoors } from "@/components/DoorsTransition";
import { Footer } from "@/components/Footer";
import { PageNav } from "@/components/PageNav";
import { Section } from "@/components/Section";
import { type ContactOrigin } from "@/components/ContactModal";

export function ComingSoonPage({
  title,
  description,
  contactModal,
}: {
  title: string;
  description: string;
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
          <Badge pulse>Coming Soon</Badge>
          <h1 className="mt-5 text-4xl tracking-[-0.02em] md:text-5xl">{title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{description}</p>
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
