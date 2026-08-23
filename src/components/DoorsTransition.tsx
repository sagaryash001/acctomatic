import { createContext, useCallback, useContext, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

/**
 * Page-transition overlay: closes over the screen, the route swaps
 * underneath while fully covered, then it opens back up onto the new page.
 * 0.25s closing + 0.25s opening = a 0.5s transition, in one of three shapes:
 *
 * - "doors": two panels slide in from either side and meet in the middle,
 *   then continue on to slide back out the way they came.
 * - "wipe": a single full-width panel sweeps across in one direction the
 *   whole way through (in from the left, straight on out to the right).
 * - "blinds": a stack of horizontal slats close in a staggered cascade,
 *   then reopen in reverse order.
 */
const HALF_DURATION = 0.25;
const EASE = [0.76, 0, 0.24, 1] as const;
const BLIND_COUNT = 10;

export type TransitionEffect = "doors" | "wipe" | "blinds";
type Phase = "idle" | "closing" | "opening";

interface DoorsContextValue {
  navigateWithDoors: (path: string, effect?: TransitionEffect) => void;
}

const DoorsContext = createContext<DoorsContextValue | null>(null);

function DoorsOverlay({ phase }: { phase: Phase }) {
  const active = phase === "closing" || phase === "opening";
  return (
    <div className="flex h-full w-full">
      <motion.div
        className="h-full w-1/2 bg-foreground"
        animate={{ x: active ? 0 : "-100%" }}
        initial={false}
        transition={{ duration: HALF_DURATION, ease: EASE }}
      />
      <motion.div
        className="h-full w-1/2 bg-foreground"
        animate={{ x: active ? 0 : "100%" }}
        initial={false}
        transition={{ duration: HALF_DURATION, ease: EASE }}
      />
    </div>
  );
}

function WipeOverlay({ phase }: { phase: Phase }) {
  // Same direction the whole way through: off-left -> covers screen -> off-right.
  const x = phase === "idle" ? "-100%" : phase === "closing" ? "0%" : "100%";
  return (
    <motion.div
      className="h-full w-full bg-foreground"
      animate={{ x }}
      initial={false}
      transition={{ duration: HALF_DURATION, ease: EASE }}
    />
  );
}

function BlindsOverlay({ phase }: { phase: Phase }) {
  const closing = phase === "closing" || phase === "opening";
  return (
    <div className="flex h-full w-full flex-col">
      {Array.from({ length: BLIND_COUNT }).map((_, i) => {
        const delay =
          phase === "opening" ? (BLIND_COUNT - 1 - i) * (HALF_DURATION / (BLIND_COUNT + 2)) : i * (HALF_DURATION / (BLIND_COUNT + 2));
        return (
          <motion.div
            key={i}
            className="w-full flex-1 origin-top bg-foreground"
            animate={{ scaleY: closing ? 1 : 0 }}
            initial={false}
            transition={{ duration: HALF_DURATION * 0.7, delay, ease: EASE }}
          />
        );
      })}
    </div>
  );
}

export function DoorsProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("idle");
  const [effect, setEffect] = useState<TransitionEffect>("doors");
  const pending = useRef(false);

  const navigateWithDoors = useCallback(
    (path: string, nextEffect: TransitionEffect = "doors") => {
      if (pending.current) return;
      pending.current = true;
      setEffect(nextEffect);
      setPhase("closing");
      window.setTimeout(() => {
        navigate(path);
        // Explicit "instant": the two-arg scrollTo() form defers to the
        // page's CSS scroll-behavior, which is "smooth" here - without this
        // it animates the reset to the top over the transition, so the
        // reveal shows the new page still visibly scrolling into place.
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        setPhase("opening");
        window.setTimeout(() => {
          setPhase("idle");
          pending.current = false;
        }, HALF_DURATION * 1000);
      }, HALF_DURATION * 1000);
    },
    [navigate],
  );

  const closed = phase !== "idle";

  return (
    <DoorsContext.Provider value={{ navigateWithDoors }}>
      {children}
      <div
        className="fixed inset-0 z-[100]"
        style={{ pointerEvents: closed ? "auto" : "none" }}
        aria-hidden
      >
        {effect === "doors" && <DoorsOverlay phase={phase} />}
        {effect === "wipe" && <WipeOverlay phase={phase} />}
        {effect === "blinds" && <BlindsOverlay phase={phase} />}
        <motion.span
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-semibold tracking-[-0.02em] text-white"
          animate={{ opacity: closed ? 1 : 0 }}
          transition={{ duration: 0.15 }}
        >
          acct<span className="gradient-text">omatic</span>
        </motion.span>
      </div>
    </DoorsContext.Provider>
  );
}

export function useDoors() {
  const ctx = useContext(DoorsContext);
  if (!ctx) throw new Error("useDoors must be used within a DoorsProvider");
  return ctx;
}
