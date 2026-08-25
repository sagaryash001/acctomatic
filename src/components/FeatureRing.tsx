import { useCallback, useEffect, useRef, type ComponentType } from "react";
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
      "Every field is checked against evidence, arithmetic, and your own rules — before it's ever trusted.",
    icon: ShieldCheck,
    accent: true,
  },
  {
    title: "Works With Your Stack",
    description: "Email, Drive, Slack, Teams, your ERP — no new tool to learn, no workflow to change.",
    icon: Link2,
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

const CARD_WIDTH = 288; // w-72
const CARD_GAP = 32; // gap-8
const STEP = CARD_WIDTH + CARD_GAP;
const SET_WIDTH = features.length * STEP;
const TRANSITION_MS = 700;
const AUTOPLAY_INTERVAL_MS = 3200;
const AUTOPLAY_RESUME_DELAY_MS = 2000;

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
 * Auto-advancing horizontal carousel. The card list is tripled so the strip
 * always has a full set's worth of buffer on either side; autoplay and drag
 * both move the same `offset` (written straight to the node — no state
 * round-trip, so drag stays 1:1 with the pointer). Crossing a full set's
 * width snaps `offset` back by one set-width with the transition disabled
 * for that frame, which is invisible since the content repeats — so the
 * strip appears to glide on forever in either direction.
 */
export function FeatureRing() {
  const trackRef = useRef<HTMLDivElement>(null);
  const offset = useRef(-SET_WIDTH);
  const dragging = useRef(false);
  const lastX = useRef<number | null>(null);
  const autoplayTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const normalizeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const applyOffset = useCallback((withTransition: boolean) => {
    const track = trackRef.current;
    if (!track) return;
    track.style.transition = withTransition
      ? `transform ${TRANSITION_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`
      : "none";
    track.style.transform = `translateX(${offset.current}px)`;
  }, []);

  // Keeps offset within [-2*SET_WIDTH, -SET_WIDTH] so a full loop of buffer
  // cards always exists on both sides, wrapping invisibly once crossed.
  const normalize = useCallback(() => {
    if (offset.current <= -2 * SET_WIDTH) {
      offset.current += SET_WIDTH;
      applyOffset(false);
    } else if (offset.current > -SET_WIDTH) {
      offset.current -= SET_WIDTH;
      applyOffset(false);
    }
  }, [applyOffset]);

  const scheduleNormalize = useCallback(() => {
    if (normalizeTimer.current) clearTimeout(normalizeTimer.current);
    normalizeTimer.current = setTimeout(normalize, TRANSITION_MS + 20);
  }, [normalize]);

  const advance = useCallback(() => {
    offset.current -= STEP;
    applyOffset(true);
    scheduleNormalize();
  }, [applyOffset, scheduleNormalize]);

  const stopAutoplay = useCallback(() => {
    if (autoplayTimer.current) {
      clearInterval(autoplayTimer.current);
      autoplayTimer.current = null;
    }
  }, []);

  const startAutoplay = useCallback(() => {
    stopAutoplay();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    autoplayTimer.current = setInterval(advance, AUTOPLAY_INTERVAL_MS);
  }, [advance, stopAutoplay]);

  useEffect(() => {
    applyOffset(false);
    startAutoplay();
    return () => {
      stopAutoplay();
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
      if (normalizeTimer.current) clearTimeout(normalizeTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scheduleResume = () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(startAutoplay, AUTOPLAY_RESUME_DELAY_MS);
  };

  // Pauses only for an actual drag in progress — not merely for the pointer
  // resting nearby, which previously stalled autoplay for as long as the
  // user's cursor sat anywhere over the carousel (i.e. whenever they were
  // actually looking at it).
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    lastX.current = e.clientX;
    stopAutoplay();
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current || lastX.current === null) return;
    offset.current += e.clientX - lastX.current;
    lastX.current = e.clientX;
    applyOffset(false);
    normalize();
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    dragging.current = false;
    lastX.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    offset.current = Math.round(offset.current / STEP) * STEP;
    applyOffset(true);
    scheduleNormalize();
    scheduleResume();
  };

  return (
    // Breaks out of the max-w-6xl parent column to use the full viewport
    // width — a fixed-width card strip inside that narrow column left most
    // of a wide screen empty and showed barely more than three cards.
    <div className="relative left-1/2 w-screen -translate-x-1/2 select-none overflow-hidden px-6 md:px-16">
      <div
        ref={trackRef}
        className="flex cursor-grab touch-pan-y gap-8 active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {[...features, ...features, ...features].map((feature, i) => (
          <FeatureCard key={`${feature.title}-${i}`} feature={feature} />
        ))}
      </div>
      <p className="pointer-events-none mt-4 text-center text-sm text-muted-foreground">Drag to browse</p>
    </div>
  );
}
