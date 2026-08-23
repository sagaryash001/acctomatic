import { useEffect, useState } from "react";
import { Markdown } from "@/components/Markdown";
import { Footer } from "@/components/Footer";
import { PageNav } from "@/components/PageNav";
import { Section, SectionIntro } from "@/components/Section";
import { type ContactOrigin } from "@/components/ContactModal";
import { ComingSoonPage } from "@/pages/ComingSoonPage";
import { getFaqItems, type FaqItem } from "@/lib/content";

export function FaqPage({
  contactModal,
}: {
  contactModal: { origin: ContactOrigin | null; open: (event: React.MouseEvent) => void; close: () => void };
}) {
  const [items, setItems] = useState<FaqItem[] | null>(null);

  useEffect(() => {
    getFaqItems().then(setItems);
  }, []);

  if (items === null) return null;

  if (items.length === 0) {
    return (
      <ComingSoonPage
        title="FAQ"
        description="Answers to the common questions are on the way. In the meantime, reach out and we'll answer directly."
        contactModal={contactModal}
      />
    );
  }

  return (
    <div className="bg-mesh min-h-screen">
      <PageNav contactModal={contactModal} />
      <Section className="px-4 pb-16 pt-4 sm:px-6 md:pt-8">
        <div className="glass-panel overflow-hidden rounded-[2rem] p-6 sm:p-10 md:p-12">
          <SectionIntro label="FAQ" title="Common questions, answered." />
          <div className="space-y-8">
            {items.map((item) => (
              <div key={item.id}>
                <h3 className="text-lg font-semibold tracking-[-0.01em] text-foreground">{item.question}</h3>
                <Markdown content={item.answer} className="prose prose-sm mt-2 max-w-none text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>
      </Section>
      <Footer onContactClick={contactModal.open} />
    </div>
  );
}
