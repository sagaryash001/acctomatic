import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Badge, Button, LinkButton } from "@/components/ui";
import { useDoors } from "@/components/DoorsTransition";
import { Footer } from "@/components/Footer";
import { ScrambleText } from "@/components/ScrambleText";
import { Section } from "@/components/Section";
import { type ContactOrigin } from "@/components/ContactModal";
import { getFeature } from "@/lib/features";
import { fadeInUp, stagger } from "@/lib/motion";

export function FeaturePage({
  contactModal,
}: {
  contactModal: { origin: ContactOrigin | null; open: (event: React.MouseEvent) => void; close: () => void };
}) {
  const { slug } = useParams();
  const { navigateWithDoors } = useDoors();
  const feature = getFeature(slug);

  const goHome = (event: React.MouseEvent) => {
    event.preventDefault();
    navigateWithDoors("/");
  };

  if (!feature) {
    return (
      <div className="bg-mesh min-h-screen">
        <Section className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <h1 className="text-3xl">Page not found.</h1>
          <p className="mt-3 text-muted-foreground">That feature doesn't exist.</p>
          <a
            href="/"
            onClick={goHome}
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Acctomatic
          </a>
        </Section>
      </div>
    );
  }

  return (
    <div className="bg-mesh min-h-screen">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-7">
        <a
          href="/"
          onClick={goHome}
          className="text-lg font-semibold tracking-[-0.02em] text-foreground"
        >
          acct<span className="gradient-text">omatic</span>
        </a>
        <div className="flex items-center gap-3">
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

      <Section className="pb-16 pt-4 md:pt-8">
        <a
          href="/"
          onClick={goHome}
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Acctomatic
        </a>

        {/* Liquid-glass panel: a bright, saturated frosted surface so body
            text stays legible over the busy mesh-grid background instead of
            the grid lines cutting straight through the letterforms. */}
        <div className="glass-panel overflow-hidden rounded-[2rem] p-8 md:p-12">
          <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-2xl">
            <motion.div variants={fadeInUp}>
              <Badge pulse>How It Works</Badge>
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="mt-4 text-4xl leading-[1.1] tracking-[-0.02em] md:text-6xl"
            >
              {feature.title}
            </motion.h1>
            <motion.p variants={fadeInUp} className="mt-6 text-lg leading-relaxed text-muted-foreground">
              {feature.description}
            </motion.p>
          </motion.div>

          <div className="mt-12 grid gap-12 md:grid-cols-[2fr_1fr]">
            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
              {feature.longDescription.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
            <ul className="space-y-4">
              {feature.points.map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                  <span className="text-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-12 flex flex-wrap gap-4">
            <LinkButton href="/#get-started" variant="primary" size="lg" className="group">
              <ScrambleText text="Get Started" />
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </LinkButton>
            <Button variant="secondary" size="lg" onClick={contactModal.open}>
              Talk to Sales
            </Button>
          </div>
        </div>
      </Section>

      <div className="mt-8">
        <Footer onContactClick={contactModal.open} />
      </div>
    </div>
  );
}
