import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Badge, LinkButton } from "@/components/ui";
import { fadeInUp, stagger } from "@/lib/motion";

// Must match the number of files actually extracted into public/frames
// (frame_0001.jpg .. frame_0311.jpg). Verified via `ls public/frames | wc -l`.
const FRAME_COUNT = 311;
const FRAME_PATH = (index: number) => `/frames/frame_${String(index + 1).padStart(4, "0")}.jpg`;

// Scroll-progress windows (0..1 across the hero's scroll range). Every one of
// these drives both the canvas frame index and a text beat's opacity from the
// same `progress` value computed in the rAF loop below — the identity block's
// initial reveal is the sole exception, handled by framer-motion on mount.
const IDENTITY_OUT: [number, number] = [0.0, 0.1];
const RIGHT_IN: [number, number] = [0.12, 0.18];
const RIGHT_OUT: [number, number] = [0.28, 0.33];
const LEFT_IN: [number, number] = [0.35, 0.41];
const LEFT_OUT: [number, number] = [0.55, 0.6];
const CLOSING_IN: [number, number] = [0.62, 0.7];

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

// Skip re-writing a style property when the value hasn't changed. Cheap, but
// it avoids ~10 no-op style writes per element per frame while a beat is
// holding steady at 0 or 1 opacity (i.e. almost the entire scroll range).
function setStyleIfChanged(el: HTMLElement, prop: "opacity" | "transform" | "pointerEvents", value: string) {
  if (el.style[prop] !== value) el.style[prop] = value;
}

function applyBeat(el: HTMLElement | null, opacity: number) {
  if (!el) return;
  setStyleIfChanged(el, "opacity", String(opacity));
  setStyleIfChanged(el, "transform", `translateY(${(1 - opacity) * 18}px)`);
  setStyleIfChanged(el, "pointerEvents", opacity > 0.05 ? "auto" : "none");
}

/**
 * Draws `img` into the canvas cropped to fill it entirely (like CSS
 * background-size: cover), then lays a legibility gradient on top — folded
 * into the same canvas paint instead of a separate always-on DOM layer.
 */
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

  const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  gradient.addColorStop(0, "rgba(22, 19, 15, 0.45)");
  gradient.addColorStop(0.4, "rgba(22, 19, 15, 0.05)");
  gradient.addColorStop(1, "rgba(22, 19, 15, 0.55)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
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
  const hasStartedLoadingRef = useRef(false);

  // Kick off every frame request up front. The rAF loop never advances the
  // canvas past a target index until that image's onload has actually fired —
  // a bare draw attempt on an unloaded <img> is not enough, or the hero can
  // render blank on a fresh, slow-network load.
  //
  // Guarded with a ref (rather than relying on an empty dep array alone)
  // because React StrictMode's dev-only double-invoke has no cleanup to
  // cancel this one — without the guard it would fire all 168 requests twice.
  useEffect(() => {
    if (hasStartedLoadingRef.current) return;
    hasStartedLoadingRef.current = true;
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
        // ---- READ (once, up front) ----
        // The pin/canvas always fill the viewport exactly (position: fixed,
        // h-dvh w-full) whenever they're actually pinned, so canvas sizing
        // reads from window.innerWidth/Height rather than a second
        // getBoundingClientRect() call on the canvas itself. That second call
        // used to run right after applyPin's style write below, forcing a
        // synchronous layout flush on every single animation frame — the
        // main cause of the scroll jank. Reading everything before writing
        // anything keeps this loop reflow-free.
        const wrapperRect = wrapper.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        // ---- COMPUTE ----
        const progress = progressFromRect(wrapperRect, viewportHeight);
        const width = Math.round(viewportWidth * dpr);
        const height = Math.round(viewportHeight * dpr);

        // ---- WRITE ----
        applyPin(pin, wrapperRect, viewportHeight);
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
        const nextTabIndex = closingOpacity > 0.5 ? 0 : -1;
        if (ctaRef.current && ctaRef.current.tabIndex !== nextTabIndex) {
          ctaRef.current.tabIndex = nextTabIndex;
        }
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
          A slow aerial approach into a warm, modern finance office building: past the entrance,
          through the lounge, past a desk buried in paperwork, through documents being organized,
          to a clean desk and a calm meeting room, before pulling back out over the city.
        </span>

        {/* Identity block — rises + fades in on mount (time-based), independent of image load state. */}
        <div ref={identityRef} className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="flex flex-col items-center gap-6">
            <motion.div variants={fadeInUp}>
              <Badge pulse className="border-hero-cream/30 bg-hero-ink/70 text-hero-cream [&_span:last-child]:text-hero-cream">
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
            <motion.p
              variants={fadeInUp}
              className="max-w-xl text-base leading-relaxed text-hero-cream sm:text-lg"
            >
              AI that reads invoices and receipts, checks the numbers, and books them
              automatically — so your team stops doing manual data entry.
            </motion.p>
          </motion.div>
        </div>

        {/* Right-side beat */}
        <div
          ref={rightRef}
          className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 opacity-0 md:justify-end md:px-16"
        >
          <p className="max-w-sm text-center text-lg leading-relaxed text-hero-cream sm:text-xl md:max-w-md md:text-right">
            Acctomatic connects to your inbox, Drive, and accounting software. Every invoice,
            receipt, and statement is read the moment it arrives — no forwarding, no uploading,
            no manual entry.
          </p>
        </div>

        {/* Left-side beat */}
        <div
          ref={leftRef}
          className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 opacity-0 md:justify-start md:px-16"
        >
          <p className="max-w-sm text-center text-lg leading-relaxed text-hero-cream sm:text-xl md:max-w-md md:text-left">
            Each document is checked against the numbers, the math, and your own rules. What
            matches books itself. What doesn't gets flagged for a quick look — not a full
            review.
          </p>
        </div>

        {/* Closing beat — holds at full visibility through the end of the scroll range. */}
        <div
          ref={closingRef}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center opacity-0"
        >
          <div className="flex flex-col items-center gap-5 rounded-[2rem] bg-hero-ink/75 px-8 py-10 sm:px-14 sm:py-12">
            <h2 className="text-3xl leading-[1.1] tracking-[-0.02em] text-white sm:text-5xl md:text-[3.25rem]">
              Your books, on autopilot.
            </h2>
            <p className="max-w-md text-base leading-relaxed text-hero-cream sm:text-lg">
              One inbox for every invoice and receipt. Verified data, booked automatically.
            </p>
            <LinkButton ref={ctaRef} href="#get-started" variant="primary" size="lg" tabIndex={-1} className="mt-2">
              Book a Demo
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}
