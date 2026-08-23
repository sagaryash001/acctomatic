import { AuthForm } from "@/components/auth/AuthForm";
import { Footer } from "@/components/Footer";
import { PageNav } from "@/components/PageNav";
import { Section } from "@/components/Section";
import { type ContactOrigin } from "@/components/ContactModal";

export function SignUpPage({
  contactModal,
}: {
  contactModal: { origin: ContactOrigin | null; open: (event: React.MouseEvent) => void; close: () => void };
}) {
  return (
    <div className="bg-mesh min-h-screen">
      <PageNav contactModal={contactModal} />
      <Section className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center sm:px-6">
        <AuthForm
          badge="Get Started"
          title="Start your free trial."
          subtitle="Enter your work email and we'll send you a link to get set up."
        />
      </Section>
      <Footer onContactClick={contactModal.open} />
    </div>
  );
}
