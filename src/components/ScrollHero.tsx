import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Badge, LinkButton } from "@/components/ui";
import { fadeInUp, stagger } from "@/lib/motion";

// Must match the number of files actually extracted into public/frames
// (frame_0001.jpg .. frame_0120.jpg). Verified via `ls public/frames | wc -l`.
const FRAME_COUNT = 120;
const FRAME_PATH = (index: number) => `/frames/frame_${String(index + 1).padStart(4, "0")}.jpg`;

// Scroll-progress windows (0..1 across the hero's scroll range). Every one of
// these drives both the canvas frame index and a text beat's opacity from the
// same `progress` value computed in the rAF loop below — the identity block's
// initial reveal is the sole exception, handled by framer-motion on mount.
const IDENTITY_OUT: [number, number] = [0.0, 0.09];
const RIGHT_IN: [number, number] = [0.1, 0.16];
const RIGHT_OUT: [number, number] = [0.29, 0.34];
const LEFT_IN: [number, number] = [0.35, 0.41];
const LEFT_OUT: [number, number] = [0.54, 0.59];
const CLOSING_IN: [number, number] = [0.6, 0.68];

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

/** Scroll progress through the pinned hero, derived only from layout geometry — no scroll listener. */
function progressFromRect(wrapperRect: DOMRect, viewportHeight: number) {
  const scrollable = wrapperRect.height - viewportHeight;
  if (scrollable <= 0) return 0;
  return clamp01(-wrapperRect.top / scrollable);
}

/**
 * Pins the hero layer to the viewport for the wrapper's scroll range, and releases
 * it to sit at the wrapper's top/bottom edge outside that range.
 *
 * This does the job `position: sticky` normally would, but native sticky doesn't
 * stick here: `overflow-x: hidden` on html/body (needed site-wide to prevent
 * horizontal scroll from other decorative elements) breaks sticky positioning for
 * any descendant. Driven from the same getBoundingClientRect() read used for
 * scroll progress, so this stays within the "rAF + getBoundingClientRect only,
 * no scroll listener" rule rather than adding a second tracking mechanism.
 */
function applyPin(el: HTMLElement, wrapperRect: DOMRect, viewportHeight: number) {
  if (wrapperRect.bottom <= viewportHeight) {
    el.style.position = "absolute";
    el.style.top = "";
    el.style.bottom = "0px";
  } else if (wrapperRect.top > 0) {
    el.style.position = "absolute";
    el.style.bottom = "";
    el.style.top = "0px";
  } else {
    el.style.position = "fixed";
    el.style.bottom = "";
    el.style.top = "0px";
  }
}

/**
 * Opacity for one text beat. `inRange` fades it in (or 1 from the start if
 * null); `outRange` fades it out (or holds at full opacity forever if null —
 * used by the closing beat, which never fades).
 */
function beatOpacity(
  progress: number,
  inRange: [number, number] | null,
  outRange: [number, number] | null,
) {
  let opacity = 1;
  if (inRange) {
    const [inStart, inEnd] = inRange;
    if (progress < inStart) return 0;
    if (progress < inEnd) opacity = (progress - inStart) / (inEnd - inStart);
  }
  if (outRange) {
    const [outStart, outEnd] = outRange;
    if (progress >= outStart) {
      const fade = progress >= outEnd ? 0 : 1 - (progress - outStart) / (outEnd - outStart);
      opacity = Math.min(opacity, fade);
    }
  }
  return opacity;
}

function applyBeat(el: HTMLElement | null, opacity: number) {
  if (!el) return;
  el.style.opacity = String(opacity);
  el.style.transform = `translateY(${(1 - opacity) * 18}px)`;
  el.style.pointerEvents = opacity > 0.05 ? "auto" : "none";
}

/** Draws `img` into the canvas cropped to fill it entirely, like CSS background-size: cover. */
function drawFrameCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number,
) {
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const canvasRatio = canvasWidth / canvasHeight;
  let sx = 0;
  let sy = 0;
  let sw = img.naturalWidth;
  let sh = img.naturalHeight;
  if (imgRatio > canvasRatio) {
    sw = sh * canvasRatio;
    sx = (img.naturalWidth - sw) / 2;
  } else {
    sh = sw / canvasRatio;
    sy = (img.naturalHeight - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvasWidth, canvasHeight);
}

export function ScrollHero() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const identityRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const loadedRef = useRef<boolean[]>(Array(FRAME_COUNT).fill(false));
  const lastDrawnIndexRef = useRef(-1);

  // Kick off every frame request up front. The rAF loop never advances the
  // canvas past a target index until that image's onload has actually fired —
  // a bare draw attempt on an unloaded <img> is not enough, or the hero can
  // render blank on a fresh, slow-network load.
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        loadedRef.current[i] = true;
      };
      img.src = FRAME_PATH(i);
      images.push(img);
    }
    imagesRef.current = images;
  }, []);

  useEffect(() => {
    let raf = 0;

    const tick = () => {
      const wrapper = wrapperRef.current;
      const pin = pinRef.current;
      const canvas = canvasRef.current;

      if (wrapper && pin && canvas) {
        const wrapperRect = wrapper.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        applyPin(pin, wrapperRect, viewportHeight);
        const progress = progressFromRect(wrapperRect, viewportHeight);

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rect = canvas.getBoundingClientRect();
        const width = Math.round(rect.width * dpr);
        const height = Math.round(rect.height * dpr);
        const sizeChanged = canvas.width !== width || canvas.height !== height;
        if (sizeChanged && width > 0 && height > 0) {
          canvas.width = width;
          canvas.height = height;
        }

        const target = Math.min(
          FRAME_COUNT - 1,
          Math.max(0, Math.round(progress * (FRAME_COUNT - 1))),
        );
        const targetImage = imagesRef.current[target];
        const targetIsLoaded = loadedRef.current[target];

        if (targetImage && targetIsLoaded && (target !== lastDrawnIndexRef.current || sizeChanged)) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            drawFrameCover(ctx, targetImage, canvas.width, canvas.height);
            lastDrawnIndexRef.current = target;
          }
        }

        // Text beats read the exact same `progress` value as the canvas above.
        applyBeat(identityRef.current, beatOpacity(progress, null, IDENTITY_OUT));
        applyBeat(rightRef.current, beatOpacity(progress, RIGHT_IN, RIGHT_OUT));
        applyBeat(leftRef.current, beatOpacity(progress, LEFT_IN, LEFT_OUT));
        const closingOpacity = beatOpacity(progress, CLOSING_IN, null);
        applyBeat(closingRef.current, closingOpacity);
        if (ctaRef.current) ctaRef.current.tabIndex = closingOpacity > 0.5 ? 0 : -1;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section ref={wrapperRef} className="relative h-[650vh]">
      <div
        ref={pinRef}
        className="left-0 h-dvh min-h-[640px] w-full overflow-hidden bg-hero-ink"
        style={{ position: "fixed", top: 0 }}
      >
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
        <span className="sr-only">
          A slow aerial approach into a warm, modern finance office building, arriving at a calm,
          organized workspace.
        </span>

        {/* Legibility scrim — kept subtle so the footage still reads through. */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-hero-ink/45 via-hero-ink/5 to-hero-ink/55" />

        {/* Identity block — rises + fades in on mount (time-based), independent of image load state. */}
        <div ref={identityRef} className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="flex flex-col items-center gap-6">
            <motion.div variants={fadeInUp}>
              <Badge pulse className="border-hero-cream/30 bg-hero-ink/40 text-hero-cream backdrop-blur-sm [&_span:last-child]:text-hero-cream">
                Acctomatic · Document Autopilot
              </Badge>
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="max-w-3xl text-[2.5rem] leading-[1.08] tracking-[-0.02em] text-white sm:text-6xl md:text-[4.5rem]"
            >
              Straight through the lobby.
              <br />
              Straight into your ledger.
            </motion.h1>
          </motion.div>
        </div>

        {/* Right-side beat */}
        <div
          ref={rightRef}
          className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 opacity-0 md:justify-end md:px-16"
        >
          <p className="max-w-sm text-center text-lg leading-relaxed text-hero-cream sm:text-xl md:max-w-md md:text-right">
            No check-in. No queue. Every invoice and receipt is read the instant it lands in your
            inbox.
          </p>
        </div>

        {/* Left-side beat */}
        <div
          ref={leftRef}
          className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 opacity-0 md:justify-start md:px-16"
        >
          <p className="max-w-sm text-center text-lg leading-relaxed text-hero-cream sm:text-xl md:max-w-md md:text-left">
            Acctomatic verifies the numbers, chases what's missing, and books what's already
            true.
          </p>
        </div>

        {/* Closing beat — holds at full visibility through the end of the scroll range. */}
        <div
          ref={closingRef}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center opacity-0"
        >
          <div className="flex flex-col items-center gap-7 rounded-[2rem] bg-hero-ink/50 px-8 py-10 backdrop-blur-md sm:px-14 sm:py-12">
            <h2 className="text-3xl leading-[1.1] tracking-[-0.02em] text-white sm:text-5xl md:text-[3.25rem]">
              Your books, on autopilot.
            </h2>
            <LinkButton ref={ctaRef} href="#get-started" variant="primary" size="lg" tabIndex={-1}>
              Book a Demo
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}
