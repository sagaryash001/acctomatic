import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Badge, Button, Card, FeaturedCard, InvertedSection, Input, Textarea } from "@/components/ui";
import { fadeInUp, stagger, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

function Section({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={cn("mx-auto max-w-6xl px-6 py-20", className)}>{children}</section>;
}

function SectionIntro({
  label,
  title,
  showLabel = true,
}: {
  label: string;
  title: React.ReactNode;
  showLabel?: boolean;
}) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="mb-10 flex flex-col gap-4"
    >
      {showLabel && (
        <motion.div variants={fadeInUp}>
          <Badge pulse>{label}</Badge>
        </motion.div>
      )}
      <motion.h2 variants={fadeInUp} className="text-3xl leading-[1.15] md:text-[3.25rem]">
        {title}
      </motion.h2>
    </motion.div>
  );
}

export default function App() {
  return (
    <main>
      {/* Hero */}
      <section className="relative h-dvh min-h-[640px] w-full overflow-hidden">
        <video
          className="absolute left-1/2 top-1/2 h-auto min-h-full w-auto min-w-full -translate-x-1/2 -translate-y-1/2 object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>

        <Section className="relative flex h-full items-center py-28">
          <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-2xl">
            <motion.h1
              variants={fadeInUp}
              className="relative text-[2.75rem] leading-[1.05] tracking-[-0.02em] text-white sm:text-6xl md:text-[5.25rem]"
            >
              Turning financial chaos into <span className="gradient-text">structured clarity</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="mt-6 max-w-lg text-lg leading-relaxed text-white/85"
            >
              Tokens, typography, and components for Acctomatic — minimalism with a pulse. This
              page is a living reference for everything the system provides.
            </motion.p>
            <motion.div variants={fadeInUp} className="mt-10 flex flex-wrap gap-4">
              <Button variant="primary" size="lg" className="group">
                Get Started
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="border-white/50 bg-black/20 text-white backdrop-blur-sm hover:border-white/80 hover:bg-black/35"
              >
                View Components
              </Button>
            </motion.div>
          </motion.div>
        </Section>
      </section>

      {/* Get started */}
      <Section>
        <SectionIntro label="Get Started" title="Take the next step with Acctomatic." showLabel={false} />
        <p className="mb-8 max-w-lg text-lg leading-relaxed text-muted-foreground">
          Whether you're ready to dive in or want to see it in action first, there's a path that
          fits.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary" size="lg" className="group">
            Start Free Trial
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button variant="secondary" size="lg">
            Book a Demo
          </Button>
          <Button variant="ghost" size="lg">
            Talk to Sales
          </Button>
        </div>
      </Section>

      {/* Cards */}
      <Section>
        <SectionIntro label="Cards" title="Elevated surfaces that float." showLabel={false} />
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <h3 className="text-lg font-semibold tracking-[-0.01em]">Standard Card</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              White surface, subtle border, hover-deepened shadow. The default building block.
            </p>
          </Card>
          <Card elevated>
            <h3 className="text-lg font-semibold tracking-[-0.01em]">Elevated Card</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Permanent lift for content that deserves more visual weight.
            </p>
          </Card>
          <FeaturedCard>
            <h3 className="text-lg font-semibold tracking-[-0.01em]">Featured Card</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Gradient-stroke border via a 2px inset panel — reserved for spotlighted content.
            </p>
          </FeaturedCard>
        </div>
      </Section>

      {/* Inputs */}
      <Section>
        <SectionIntro label="Form Fields" title="Precise, focused, accessible." />
        <Card className="max-w-lg space-y-5">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-foreground">
              Full name
            </label>
            <Input id="name" placeholder="Jane Doe" />
          </div>
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium text-foreground">
              Message
            </label>
            <Textarea id="message" placeholder="Tell us what you need..." />
          </div>
          <Button variant="primary" className="w-full sm:w-auto">
            Submit
          </Button>
        </Card>
      </Section>

      {/* Inverted section */}
      <InvertedSection className="mt-8">
        <Section className="py-28 text-center">
          <Badge pulse className="mx-auto border-white/20 bg-white/5">
            <span className="text-background/90">Spotlight</span>
          </Badge>
          <h2 className="mx-auto mt-6 max-w-xl text-3xl leading-[1.15] md:text-[3.25rem]">
            Contrast that commands <span className="gradient-text">attention</span>.
          </h2>
          <p className="mx-auto mt-6 max-w-md text-background/70">
            Inverted sections punctuate the scroll — reserved for stats, spotlighted content, and
            final calls to action.
          </p>
        </Section>
      </InvertedSection>
    </main>
  );
}
