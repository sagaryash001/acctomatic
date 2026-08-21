import { useRef, type ComponentType } from "react";
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

const RADIUS = 340;
const ANGLE_STEP = 360 / features.length;

function RingCard({ feature, index }: { feature: Feature; index: number }) {
  const Icon = feature.icon;
  return (
    <div
      className={cn(
        "absolute left-1/2 top-1/2 flex h-80 w-72 flex-col rounded-2xl p-8",
        feature.accent
          ? "border border-white/10 bg-gradient-to-br from-accent to-accent-secondary text-accent-foreground shadow-accent-lg"
          : "border border-black/[0.08] bg-card/95 shadow-[0_24px_48px_-16px_rgba(15,23,42,0.35)] backdrop-blur-md",
      )}
      style={{
        transform: `translate(-50%, -50%) rotateY(${index * ANGLE_STEP}deg) translateZ(${RADIUS}px)`,
        backfaceVisibility: "hidden",
      }}
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
 * Draggable 3D ring carousel — cards sit evenly around a circle via
 * rotateY + translateZ, and dragging horizontally spins the whole ring
 * (the classic GSAP spinning-ring demo, without the GSAP dependency).
 * The rotation is written straight to the node so drag stays 1:1 with the
 * pointer and never round-trips through React state.
 */
export function FeatureRing() {
  const ringRef = useRef<HTMLDivElement>(null);
  const angle = useRef(0);
  const lastX = useRef<number | null>(null);

  const applyRotation = () => {
    if (ringRef.current) {
      ringRef.current.style.transform = `rotateY(${angle.current}deg)`;
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    lastX.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (lastX.current === null) return;
    angle.current += (e.clientX - lastX.current) * 0.35;
    lastX.current = e.clientX;
    applyRotation();
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    lastX.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <div
      className="relative mx-auto h-[560px] w-full select-none overflow-hidden"
      style={{ perspective: 1400 }}
    >
      <div
        ref={ringRef}
        className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
        style={{ transformStyle: "preserve-3d", transform: "rotateY(0deg)" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {features.map((feature, i) => (
          <RingCard key={feature.title} feature={feature} index={i} />
        ))}
      </div>
      <p className="pointer-events-none absolute inset-x-0 bottom-2 text-center text-sm text-muted-foreground">
        Drag to rotate
      </p>
    </div>
  );
}
