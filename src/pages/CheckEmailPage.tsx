import { Mail } from "lucide-react";
import { Badge } from "@/components/ui";
import { Footer } from "@/components/Footer";
import { PageNav } from "@/components/PageNav";
import { Section } from "@/components/Section";
import { type ContactOrigin } from "@/components/ContactModal";

export function CheckEmailPage({
  contactModal,
}: {
  contactModal: { origin: ContactOrigin | null; open: (event: React.MouseEvent) => void; close: () => void };
}) {
  return (
    <div className="bg-mesh min-h-screen">
      <PageNav contactModal={contactModal} />
      <Section className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center sm:px-6">
        <div className="glass-panel max-w-md rounded-[2rem] p-10 md:p-14">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/15 text-accent">
            <Mail className="h-6 w-6" />
          </div>
          <Badge pulse className="mt-5">
            Almost there
          </Badge>
          <h1 className="mt-5 text-3xl tracking-[-0.02em] md:text-4xl">Check your email</h1>
          <p className="mt-4 text-muted-foreground">
            We've sent you a link. Click it to finish signing in - you can close this tab.
          </p>
        </div>
      </Section>
      <Footer onContactClick={contactModal.open} />
    </div>
  );
}
