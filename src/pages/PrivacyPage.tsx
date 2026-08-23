import { useEffect, useState } from "react";
import { Markdown } from "@/components/Markdown";
import { Footer } from "@/components/Footer";
import { PageNav } from "@/components/PageNav";
import { Section } from "@/components/Section";
import { type ContactOrigin } from "@/components/ContactModal";
import { ComingSoonPage } from "@/pages/ComingSoonPage";
import { getStaticPage, type StaticPage } from "@/lib/content";

export function PrivacyPage({
  contactModal,
}: {
  contactModal: { origin: ContactOrigin | null; open: (event: React.MouseEvent) => void; close: () => void };
}) {
  const [page, setPage] = useState<StaticPage | null | undefined>(undefined);

  useEffect(() => {
    getStaticPage("privacy").then(setPage);
  }, []);

  if (page === undefined) return null;

  if (page === null) {
    return (
      <ComingSoonPage
        title="Privacy"
        description="Our privacy policy is being finalized. Reach out if you have questions in the meantime."
        contactModal={contactModal}
      />
    );
  }

  return (
    <div className="bg-mesh min-h-screen">
      <PageNav contactModal={contactModal} />
      <Section className="px-4 pb-16 pt-4 sm:px-6 md:pt-8">
        <div className="glass-panel overflow-hidden rounded-[2rem] p-6 sm:p-10 md:p-12">
          <h1 className="text-3xl tracking-[-0.02em] md:text-5xl">{page.title}</h1>
          <Markdown content={page.body} className="prose prose-sm mt-8 max-w-2xl text-muted-foreground" />
        </div>
      </Section>
      <Footer onContactClick={contactModal.open} />
    </div>
  );
}
