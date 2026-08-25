import { useCallback, useEffect, useRef, type ComponentType } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  type AnimationPlaybackControls,
} from "framer-motion";
import { Eye, Link2, Lock, RefreshCw, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface Feature {
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  accent?: boolean;
}

const features: Feature[] = [
  {
    title: "Trust Engine",
    description:
      "Every field is checked against evidence, arithmetic, and your own rules, before it's ever trusted.",
    icon: ShieldCheck,
    accent: true,
  },
  {
    title: "Works With Your Stack",
    description: "Email, Drive, Slack, Teams, your ERP. No new tool to learn, no workflow to change.",
    icon: Link2,
  },
  {
    title: "Continuous Sync",
    description:
      "The moment a document lands, Acctomatic reads it, verifies it, and files it in the background.",
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

const CARD_WIDTH = 288; // w-72
const CARD_GAP = 32; // gap-8
const STEP = CARD_WIDTH + CARD_GAP;
const SET_WIDTH = features.length * STEP;
const AUTOPLAY_INTERVAL_MS = 3200;
const AUTOPLAY_RESUME_DELAY_MS = 2000;
// Apple's exponential-decay projection (Designing Fluid Interfaces, WWDC 2018).
// Tuned steeper than the ~0.998 "free scroll" value since this projects onto
// discrete 320px card steps, not continuous content - a gentle release should
// still land on the nearest card, only a real flick should throw an extra one.
const DECEL = 0.996;

function project(velocity: number) {
  return (velocity / 1000) * DECEL / (1 - DECEL);
}

function FeatureCard({ feature }: { feature: Feature }) {
  const Icon = feature.icon;
  return (
    <div
      className={cn(
        "flex h-80 w-72 shrink-0 flex-col rounded-2xl border border-border p-8 shadow-xl",
        feature.accent ? "bg-gradient-to-br from-accent to-accent-secondary text-accent-foreground" : "bg-card",
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
          "mt-3 text-base leading-relaxed",
          feature.accent ? "text-accent-foreground/80" : "text-muted-foreground",
        )}
      >
        {feature.description}
      </p>
    </div>
  );
}

/**
 * Auto-advancing horizontal carousel, driven by a single spring-animated
 * MotionValue rather than a CSS transition. That's what makes it
 * interruptible: `x.get()` always reflects the live on-screen position, even
 * mid-animation, so grabbing the strip while it's still settling from the
 * last auto-advance retargets from where it actually is instead of jumping
 * to whatever the in-flight transition's target happened to be. Drag release
 * tracks real pointer velocity and projects the landing card the way a flick
 * would in a native scroll view, then hands that velocity to the settling
 * spring so there's no seam between the drag and the animation.
 *
 * The card list is tripled so the strip always has a full set's worth of
 * buffer on either side; crossing a full set's width snaps `x` back by one
 * set-width with no animation, invisible since the content repeats.
 */
export function FeatureRing() {
  const prefersReducedMotion = useReducedMotion();

  const x = useMotionValue(-SET_WIDTH);
  const controlsRef = useRef<AnimationPlaybackControls | null>(null);
  const historyRef = useRef<{ t: number; x: number }[]>([]);
  const draggingRef = useRef(false);

  const autoplayTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keeps x within [-2*SET_WIDTH, -SET_WIDTH] so a full loop of buffer cards
  // always exists on both sides. Only called once a drag step or a spring has
  // actually settled (never mid-animation) so it can never fight the engine
  // currently driving `x`.
  const normalize = useCallback(() => {
    const value = x.get();
    if (value <= -2 * SET_WIDTH) x.set(value + SET_WIDTH);
    else if (value > -SET_WIDTH) x.set(value - SET_WIDTH);
  }, [x]);

  const stopAutoplay = useCallback(() => {
    if (autoplayTimer.current) {
      clearInterval(autoplayTimer.current);
      autoplayTimer.current = null;
    }
  }, []);

  // Runs once a spring settles: clears the in-flight marker (so the
  // change-listener guard below isn't permanently disabled after the first
  // animation) and normalizes the wrap, safe now that nothing else is
  // driving `x`.
  const settle = useCallback(() => {
    controlsRef.current = null;
    normalize();
  }, [normalize]);

  const advance = useCallback(() => {
    controlsRef.current?.stop();
    controlsRef.current = animate(x, x.get() - STEP, {
      type: "spring",
      bounce: 0, // no gesture behind this one, so no overshoot
      duration: 0.6,
    });
    controlsRef.current.then(settle);
  }, [x, settle]);

  const startAutoplay = useCallback(() => {
    stopAutoplay();
    if (prefersReducedMotion) return;
    autoplayTimer.current = setInterval(advance, AUTOPLAY_INTERVAL_MS);
  }, [advance, stopAutoplay, prefersReducedMotion]);

  useEffect(() => {
    x.set(-SET_WIDTH);
    startAutoplay();
    return () => {
      stopAutoplay();
      controlsRef.current?.stop();
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion]);

  // Belt-and-suspenders: catches any wrap crossed by a means other than
  // advance()/endDrag()'s own settle-then-normalize (there currently isn't
  // one, but a bare .set() slipping past unnoticed would show blank buffer).
  useMotionValueEvent(x, "change", (latest) => {
    if (draggingRef.current || controlsRef.current) return;
    if (latest <= -2 * SET_WIDTH || latest > -SET_WIDTH) normalize();
  });

  const scheduleResume = () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(startAutoplay, AUTOPLAY_RESUME_DELAY_MS);
  };

  // Pauses only for an actual drag in progress, not merely for the pointer
  // resting nearby.
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    stopAutoplay();
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    // Interrupt cleanly: stop whatever spring is currently driving x (an
    // autoplay advance or a previous drag's settle) so this drag starts from
    // the live presentation value, not the animation's target.
    controlsRef.current?.stop();
    controlsRef.current = null;
    historyRef.current = [{ t: e.timeStamp, x: e.clientX }];
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const last = historyRef.current[historyRef.current.length - 1];
    x.set(x.get() + (e.clientX - last.x));
    historyRef.current.push({ t: e.timeStamp, x: e.clientX });
    // Only need enough recent samples to get a release velocity; trim to the
    // last ~120ms so an old, slower part of a long drag doesn't dilute it.
    const cutoff = e.timeStamp - 120;
    while (historyRef.current.length > 2 && historyRef.current[0].t < cutoff) {
      historyRef.current.shift();
    }
    normalize();
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    const history = historyRef.current;
    const first = history[0];
    const last = history[history.length - 1];
    const dt = last.t - first.t;
    const velocity = dt > 0 ? ((last.x - first.x) / dt) * 1000 : 0; // px/s

    const projected = x.get() + (prefersReducedMotion ? 0 : project(velocity));
    const target = Math.round(projected / STEP) * STEP;

    if (prefersReducedMotion) {
      x.set(target);
      normalize();
    } else {
      // Bounce scales with how hard the release was flicked; a slow
      // deliberate drag settles with none.
      const bounce = Math.min(0.3, Math.abs(velocity) / 4000);
      controlsRef.current = animate(x, target, { type: "spring", bounce, duration: 0.5, velocity });
      controlsRef.current.then(settle);
    }

    scheduleResume();
  };

  return (
    // Breaks out of the max-w-6xl parent column to use the full viewport
    // width - a fixed-width card strip inside that narrow column left most
    // of a wide screen empty and showed barely more than three cards.
    <div className="relative left-1/2 w-screen -translate-x-1/2 select-none overflow-hidden px-6 md:px-16">
      <motion.div
        className="flex cursor-grab touch-pan-y gap-8 active:cursor-grabbing"
        style={{ x }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {[...features, ...features, ...features].map((feature, i) => (
          <FeatureCard key={`${feature.title}-${i}`} feature={feature} />
        ))}
      </motion.div>
      <p className="pointer-events-none mt-4 text-center text-sm text-muted-foreground">Drag to browse</p>
    </div>
  );
}
