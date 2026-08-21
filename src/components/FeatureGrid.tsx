import type { ComponentType } from "react";
import { motion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { Eye, Link2, Lock, RefreshCw, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface Feature {
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  span?: string;
  accent?: boolean;
}

const features: Feature[] = [
  {
    title: "Trust Engine",
    description:
      "Every field is checked against evidence, arithmetic, and your own rules — before it's ever trusted.",
    icon: ShieldCheck,
    accent: true,
  },
  {
    title: "Works With Your Stack",
    description: "Email, Drive, Slack, Teams, your ERP — no new tool to learn, no workflow to change.",
    icon: Link2,
    span: "md:col-span-2",
  },
  {
    title: "Continuous Sync",
    description:
      "The moment a document lands, Acctomatic reads it, verifies it, and files it — in the background.",
    icon: RefreshCw,
  },
  {
    title: "Bank-Grade Security",
    description: "Every document and field is encrypted at rest and in transit, audited end to end.",
    icon: Lock,
  },
  {
    title: "Human-in-the-Loop",
    description: "Only genuine exceptions reach your team. Everything else ships itself.",
    icon: Eye,
  },
];

const cardVariants = {
  rest: { y: 0, scale: 1 },
  hover: { y: -8, scale: 1.02 },
};

const letterVariants = {
  rest: { y: "120%", opacity: 0 },
  hover: (i: number) => ({
    y: "0%",
    opacity: 1,
    transition: { duration: 0.24, delay: i * 0.014, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

function ScrambleLabel({ text }: { text: string }) {
  return (
    <span className="inline-flex overflow-hidden">
      {text.split("").map((letter, i) => (
        <motion.span key={i} custom={i} variants={letterVariants}>
          {letter === " " ? " " : letter}
        </motion.span>
      ))}
    </span>
  );
}

function FeatureCard({ feature }: { feature: Feature }) {
  const Icon = feature.icon;
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      variants={cardVariants}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border p-8 shadow-sm",
        feature.accent
          ? "bg-gradient-to-br from-accent to-accent-secondary text-accent-foreground"
          : "bg-card",
        feature.span,
      )}
    >
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl",
          feature.accent ? "bg-white/15" : "bg-muted text-accent",
        )}
      >
        <Icon className="h-6 w-6" />
      </div>

      <h3 className="mt-6 text-xl font-semibold tracking-[-0.01em]">{feature.title}</h3>
      <p
        className={cn(
          "mt-3 max-w-sm text-base leading-relaxed",
          feature.accent ? "text-accent-foreground/80" : "text-muted-foreground",
        )}
      >
        {feature.description}
      </p>

      <div className="mt-6 h-5 overflow-hidden text-sm font-medium text-accent">
        <ScrambleLabel text="Learn more →" />
      </div>
    </motion.div>
  );
}

/**
 * Scroll-velocity-linked bento grid, adapted from Motion's "3D planes" example:
 * scroll speed drives a smoothed skew on the whole grid; hover lifts a card and
 * reveals a letter-staggered label (a lightweight stand-in for Motion+ ScrambleText).
 */
export function FeatureGrid() {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(velocity, { damping: 50, stiffness: 400 });
  const skewY = useTransform(smoothVelocity, [-2000, 2000], [-3, 3], { clamp: true });

  return (
    <motion.div style={{ skewY }} className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {features.map((feature) => (
        <FeatureCard key={feature.title} feature={feature} />
      ))}
    </motion.div>
  );
}
