import { AuthForm } from "@/components/auth/AuthForm";
import { Footer } from "@/components/Footer";
import { PageNav } from "@/components/PageNav";
import { Section } from "@/components/Section";
import { type ContactOrigin } from "@/components/ContactModal";

export function LoginPage({
  contactModal,
}: {
  contactModal: { origin: ContactOrigin | null; open: (event: React.MouseEvent) => void; close: () => void };
}) {
  return (
    <div className="bg-mesh min-h-screen">
      <PageNav contactModal={contactModal} />
      <Section className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center sm:px-6">
        <AuthForm badge="Log In" title="Welcome back." subtitle="Enter your email and we'll send you a link to log in." />
      </Section>
      <Footer onContactClick={contactModal.open} />
    </div>
  );
}
