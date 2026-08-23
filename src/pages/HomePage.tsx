import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button, ClickableCard, FeaturedClickableCard, Input, LinkButton, Textarea } from "@/components/ui";
import { useDoors } from "@/components/DoorsTransition";
import { Footer } from "@/components/Footer";
import { FeatureRing } from "@/components/FeatureRing";
import { MegaMenu } from "@/components/MegaMenu";
import { Puzzle } from "@/components/Puzzle";
import { ScrambleText } from "@/components/ScrambleText";
import { Section, SectionIntro } from "@/components/Section";
import { Skeleton } from "@/components/Skeleton";
import { type ContactOrigin } from "@/components/ContactModal";
import { FEATURES, type FeatureDetail } from "@/lib/features";
import { fadeInUp, stagger, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

function FeatureCard({ feature }: { feature: FeatureDetail }) {
  const { navigateWithDoors } = useDoors();
  const path = `/features/${feature.slug}`;

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    navigateWithDoors(path, feature.transitionEffect);
  };

  const body = (
    <>
      <Puzzle id={`puzzle-${feature.slug}`} fill={feature.fill} />
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 z-10 p-8 pt-28 md:p-10 md:pt-32",
          feature.accent
            ? "bg-gradient-to-t from-accent from-45% via-accent/95 via-75% to-transparent"
            : "bg-gradient-to-t from-card from-45% via-card/95 via-75% to-transparent",
        )}
      >
        <h3
          className={cn(
            "text-xl font-semibold tracking-[-0.01em] md:text-2xl",
            feature.accent ? "text-accent-foreground" : "text-foreground",
          )}
        >
          {feature.title}
        </h3>
        <p
          className={cn(
            "mt-3 text-base leading-relaxed [text-shadow:0_1px_3px_rgba(0,0,0,0.15)]",
            feature.accent ? "text-accent-foreground/95" : "text-muted-foreground",
          )}
        >
          {feature.description}
        </p>
        <span
          className={cn(
            "mt-6 inline-flex items-center gap-1.5 text-sm font-medium",
            feature.accent ? "text-accent-foreground" : "text-accent",
          )}
        >
          Learn more
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </>
  );

  if (feature.accent) {
    return (
      <FeaturedClickableCard
        href={path}
        onClick={handleClick}
        contentClassName="relative min-h-[440px] overflow-hidden p-0"
      >
        {body}
      </FeaturedClickableCard>
    );
  }

  return (
    <ClickableCard
      href={path}
      onClick={handleClick}
      elevated={feature.slug === "act"}
      className="relative min-h-[440px] overflow-hidden p-0"
    >
      {body}
    </ClickableCard>
  );
}

export function HomePage({
  contactModal,
}: {
  contactModal: { origin: ContactOrigin | null; open: (event: React.MouseEvent) => void; close: () => void };
}) {
  const { navigateWithDoors } = useDoors();
  const footerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"],
  });
  const footerOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Hero-as-header: hides once you scroll past the fold, reappears only back near the top.
  // Uses a native scroll listener rather than useMotionValueEvent - the motion
  // value's "change" event can silently miss a very large/fast scroll jump
  // (e.g. a big scrollTo or a fast fling), which left the header stuck hidden
  // even once scrollY had genuinely returned to 0.
  const { scrollY } = useScroll();
  const [headerHidden, setHeaderHidden] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      if (current < 120) {
        setHeaderHidden(false);
      } else if (current > 240) {
        setHeaderHidden(true);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const smoothScrollY = useSpring(scrollY, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const smoothHeroBlur = useTransform(smoothScrollY, [0, 600], ["blur(0px)", "blur(16px)"]);

  // The hero video is the one thing on this static site with genuine load
  // lag - show a shimmer in its place until the first frame is ready.
  const [videoReady, setVideoReady] = useState(false);

  return (
    <>
      {/* Hero header — pinned to the viewport, hides on scroll down and reveals on scroll up. */}
      <motion.header
        className="fixed inset-x-0 top-0 z-30 h-dvh min-h-[640px] w-full overflow-hidden"
        animate={{ y: headerHidden ? "-100%" : "0%" }}
        transition={{ type: "spring", stiffness: 320, damping: 34 }}
      >
        {!videoReady && <Skeleton className="absolute inset-0" />}
        <motion.video
          className="absolute left-1/2 top-1/2 h-auto min-h-full w-auto min-w-full -translate-x-1/2 -translate-y-1/2 object-cover"
          style={{ filter: smoothHeroBlur }}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedData={() => setVideoReady(true)}
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </motion.video>

        <nav className="relative z-10 flex flex-wrap items-center justify-between gap-y-3 px-4 py-5 sm:px-6 sm:py-7">
          <span className="shrink-0 text-base font-semibold tracking-[-0.02em] text-white sm:text-lg">
            acct<span className="gradient-text">omatic</span>
          </span>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <MegaMenu dark />
            <button
              onClick={contactModal.open}
              className="rounded-xl border border-white/50 bg-black/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:border-white/80 hover:bg-black/35"
            >
              Contact Us
            </button>
            <a
              href="#get-started"
              className="rounded-xl border border-white/50 bg-black/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:border-white/80 hover:bg-black/35"
            >
              <ScrambleText text="Get Started" />
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
                <ScrambleText text="Get Started" />
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
      </motion.header>

      <div className="bg-mesh relative z-10 overflow-hidden rounded-b-[2.5rem] shadow-[0_40px_60px_-20px_rgba(15,23,42,0.25)]">
        <main>
          {/* Spacer — reserves the space the fixed hero header occupies. */}
          <div aria-hidden className="h-dvh min-h-[640px] w-full" />

          {/* Get started */}
          <Section id="get-started">
            <SectionIntro label="Get Started" title="Take the next step with Acctomatic." showLabel={false} />
            <p className="mb-8 max-w-lg text-lg leading-relaxed text-muted-foreground">
              Whether you're ready to dive in or want to see it in action first, there's a path
              that fits.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" size="lg" className="group">
                Start Free Trial
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="secondary" size="lg" onClick={() => navigateWithDoors("/demo")}>
                Book a Demo
              </Button>
              <Button variant="ghost" size="lg">
                Talk to Sales
              </Button>
            </div>

            <div className="mt-14">
              <FeatureRing />
            </div>
          </Section>

          {/* Features */}
          <Section id="how-it-works">
            <SectionIntro label="How It Works" title="Same engine. Your fields. Your rules." showLabel={false} />
            <div className="grid gap-8 md:grid-cols-3">
              {FEATURES.map((feature) => (
                <FeatureCard key={feature.slug} feature={feature} />
              ))}
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
        <Footer onContactClick={contactModal.open} />
      </motion.div>
    </>
  );
}
