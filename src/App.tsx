import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Facebook, Instagram, Link2, Linkedin, ShieldCheck, Workflow } from "lucide-react";
import {
  Badge,
  Button,
  ClickableCard,
  FeaturedClickableCard,
  InvertedSection,
  Input,
  LinkButton,
  Textarea,
} from "@/components/ui";
import { ContactModal, useContactModal } from "@/components/ContactModal";
import { fadeInUp, stagger, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

function Section({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return <section id={id} className={cn("mx-auto max-w-6xl px-6 py-20", className)}>{children}</section>;
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
  const footerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"],
  });
  const footerOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const contactModal = useContactModal();

  return (
    <>
      <div className="relative z-10 overflow-hidden rounded-b-[2.5rem] bg-background shadow-[0_40px_60px_-20px_rgba(15,23,42,0.25)]">
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

        <nav className="relative z-10 flex items-center justify-between px-6 py-7">
          <span className="text-lg font-semibold tracking-[-0.02em] text-white">
            acct<span className="gradient-text">omatic</span>
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={contactModal.open}
              className="rounded-xl border border-white/50 bg-black/20 px-5 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:border-white/80 hover:bg-black/35"
            >
              Contact Us
            </button>
            <a
              href="#get-started"
              className="rounded-xl border border-white/50 bg-black/20 px-5 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:border-white/80 hover:bg-black/35"
            >
              Get Started
            </a>
          </div>
        </nav>

        <Section className="relative flex h-[calc(100%-72px)] items-center py-16">
          <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-2xl">
            <motion.h1
              variants={fadeInUp}
              className="relative text-[2.75rem] leading-[1.05] tracking-[-0.02em] text-white sm:text-6xl md:text-[5.25rem]"
            >
              Documents in. <span className="gradient-text">Manual work out.</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="mt-6 max-w-lg text-lg leading-relaxed text-white/85"
            >
              Acctomatic sits behind the tools you already use — email, Drive, Slack, your ERP —
              reads every document that arrives, verifies what it finds, and only brings you the
              exceptions.
            </motion.p>
            <motion.div variants={fadeInUp} className="mt-10 flex flex-wrap gap-4">
              <Button variant="primary" size="lg" className="group">
                Get Started
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <LinkButton
                href="#how-it-works"
                variant="secondary"
                size="lg"
                className="border-white/50 bg-black/20 text-white backdrop-blur-sm hover:border-white/80 hover:bg-black/35"
              >
                See How It Works
              </LinkButton>
            </motion.div>
          </motion.div>
        </Section>
      </section>

      {/* Get started */}
      <Section id="get-started">
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

      {/* Features */}
      <Section id="how-it-works">
        <SectionIntro label="How It Works" title="Same engine. Your fields. Your rules." showLabel={false} />
        <div className="grid gap-8 md:grid-cols-3">
          <ClickableCard href="#get-started" className="p-8 md:p-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted text-foreground transition-colors group-hover:bg-accent/10 group-hover:text-accent">
              <Link2 className="h-6 w-6" />
            </div>
            <h3 className="mt-6 text-xl font-semibold tracking-[-0.01em] md:text-2xl">Connect</h3>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              Documents arrive through email, Drive, Slack, Teams, or a direct upload — Acctomatic
              reads them without changing how your team already works.
            </p>
            <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
              Learn more
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </ClickableCard>

          <FeaturedClickableCard href="#get-started" contentClassName="p-8 md:p-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-secondary text-accent-foreground shadow-accent">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="mt-6 text-xl font-semibold tracking-[-0.01em] md:text-2xl">
              AI proposes. Acctomatic proves.
            </h3>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              Every extracted field is checked against the document itself — evidence, arithmetic,
              format, and your company's own rules — before it's ever trusted.
            </p>
            <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
              Learn more
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </FeaturedClickableCard>

          <ClickableCard href="#get-started" elevated className="p-8 md:p-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted text-foreground transition-colors group-hover:bg-accent/10 group-hover:text-accent">
              <Workflow className="h-6 w-6" />
            </div>
            <h3 className="mt-6 text-xl font-semibold tracking-[-0.01em] md:text-2xl">Act</h3>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              Verified fields file themselves and update the books. You only see what needs a
              second look — exceptions, not everything.
            </p>
            <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
              Learn more
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </ClickableCard>
        </div>
      </Section>

      {/* Inputs */}
      <Section>
        <SectionIntro label="Form Fields" title="Precise, focused, accessible." />
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="max-w-lg space-y-5 rounded-2xl border border-border bg-card p-6 shadow-md"
        >
          <motion.div variants={fadeInUp} className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-foreground">
              Full name
            </label>
            <Input id="name" placeholder="Jane Doe" />
          </motion.div>
          <motion.div variants={fadeInUp} className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium text-foreground">
              Message
            </label>
            <Textarea id="message" placeholder="Tell us what you need..." />
          </motion.div>
          <motion.div variants={fadeInUp}>
            <Button variant="primary" className="w-full sm:w-auto">
              Submit
            </Button>
          </motion.div>
        </motion.div>
      </Section>

      </main>
      </div>

      {/* Footer — sticky reveal: pinned beneath the rounded main layer above and
          faded in as scroll uncovers it. */}
      <motion.div ref={footerRef} style={{ opacity: footerOpacity }} className="sticky bottom-0 z-0">
        <InvertedSection>
          <Section className="py-16">
            <div className="flex flex-col gap-12 sm:flex-row sm:justify-between">
              <div className="max-w-xs">
                <span className="text-lg font-semibold tracking-[-0.02em] text-background">
                  acct<span className="gradient-text">omatic</span>
                </span>
                <p className="mt-4 text-sm leading-relaxed text-background/60">
                  Documents in. Manual work out. Acctomatic sits behind the tools you already use.
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <a
                    href="#"
                    aria-label="Acctomatic on Instagram"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-background/15 text-background/60 transition-colors hover:border-background/40 hover:text-background"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                  <a
                    href="#"
                    aria-label="Acctomatic on Facebook"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-background/15 text-background/60 transition-colors hover:border-background/40 hover:text-background"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                  <a
                    href="#"
                    aria-label="Acctomatic on LinkedIn"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-background/15 text-background/60 transition-colors hover:border-background/40 hover:text-background"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 sm:gap-16">
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-[0.15em] text-background/40">
                    Product
                  </h4>
                  <ul className="mt-4 space-y-3 text-sm">
                    <li>
                      <a href="#how-it-works" className="text-background/70 transition-colors hover:text-background">
                        How it works
                      </a>
                    </li>
                    <li>
                      <a href="#get-started" className="text-background/70 transition-colors hover:text-background">
                        Get started
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-[0.15em] text-background/40">
                    Company
                  </h4>
                  <ul className="mt-4 space-y-3 text-sm">
                    <li>
                      <button
                        onClick={contactModal.open}
                        className="text-background/70 transition-colors hover:text-background"
                      >
                        Contact
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-12 flex flex-col gap-4 border-t border-background/10 pt-6 text-xs text-background/50 sm:flex-row sm:items-center sm:justify-between">
              <span>&copy; {new Date().getFullYear()} Acctomatic. All rights reserved.</span>
            </div>
          </Section>
        </InvertedSection>
      </motion.div>

      <ContactModal origin={contactModal.origin} onClose={contactModal.close} />
    </>
  );
}
