import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { Button, Card, FeaturedCard } from "@/components/ui";
import { useDoors } from "@/components/DoorsTransition";
import { Footer } from "@/components/Footer";
import { PageNav } from "@/components/PageNav";
import { Section, SectionIntro } from "@/components/Section";
import { type ContactOrigin } from "@/components/ContactModal";
import { ComingSoonPage } from "@/pages/ComingSoonPage";
import { getPricingPlans, type PricingPlan } from "@/lib/content";
import { cn } from "@/lib/utils";

function PlanCard({
  plan,
  onCtaClick,
}: {
  plan: PricingPlan;
  onCtaClick: (event: React.MouseEvent) => void;
}) {
  const body = (
    <>
      <h3 className="text-xl font-semibold tracking-[-0.01em]">{plan.name}</h3>
      {plan.tagline && <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>}
      <p className="mt-6 text-4xl font-semibold tracking-[-0.02em]">
        {plan.is_custom_pricing || plan.price_monthly == null ? (
          "Custom"
        ) : (
          <>
            ${plan.price_monthly}
            <span className="text-base font-normal text-muted-foreground">/mo</span>
          </>
        )}
      </p>
      <ul className="mt-6 space-y-3">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button
        variant={plan.highlighted ? "primary" : "secondary"}
        size="lg"
        className="mt-8 w-full"
        onClick={onCtaClick}
      >
        {plan.cta_label}
      </Button>
    </>
  );

  if (plan.highlighted) {
    return <FeaturedCard className={cn("h-full")}>{body}</FeaturedCard>;
  }
  return <Card className="h-full">{body}</Card>;
}

export function PricingPage({
  contactModal,
}: {
  contactModal: { origin: ContactOrigin | null; open: (event: React.MouseEvent) => void; close: () => void };
}) {
  const { navigateWithDoors } = useDoors();
  const [plans, setPlans] = useState<PricingPlan[] | null>(null);

  useEffect(() => {
    getPricingPlans().then(setPlans);
  }, []);

  if (plans === null) return null;

  if (plans.length === 0) {
    return (
      <ComingSoonPage
        title="Pricing"
        description="Pricing details are on the way. Talk to sales for a plan that fits your team today."
        contactModal={contactModal}
      />
    );
  }

  return (
    <div className="bg-mesh min-h-screen">
      <PageNav contactModal={contactModal} />
      <Section className="px-4 pb-16 pt-4 sm:px-6 md:pt-8">
        <SectionIntro label="Pricing" title="Plans for every team size." />
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onCtaClick={(event) =>
                plan.cta_label.toLowerCase().includes("sales")
                  ? contactModal.open(event)
                  : navigateWithDoors("/signup")
              }
            />
          ))}
        </div>
      </Section>
      <Footer onContactClick={contactModal.open} />
    </div>
  );
}
