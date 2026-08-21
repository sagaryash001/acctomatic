import { useEffect, useRef } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { PUZZLE_PIECES } from "@/lib/puzzlePieces";
import { cn } from "@/lib/utils";

export interface PuzzleFill {
  base: string;
  blobs: { cx: number; cy: number; r: number; color: string; opacity: number }[];
}

/**
 * Scroll-linked jigsaw: 16 pieces scattered around their assembled position,
 * converging as the puzzle scrolls into view. Ported from the classic
 * pouretrebelle/jigsaws CSS technique (github.com/pouretrebelle/jigsaws) -
 * piece paths are geometry-only, so the same 16 shapes are reused for every
 * instance and only the pattern fill (an abstract brand-color blob mix,
 * standing in for a photo) differs per card.
 *
 * Fills its positioned parent edge-to-edge (meant to be the whole card, not
 * an inset tile) via `preserveAspectRatio="none"` - the square piece grid
 * stretches non-uniformly to match whatever the card's rendered aspect ratio
 * is, since that varies with content length and viewport width. Cropping
 * (cover) would hide most of the side columns on a tall narrow card, and
 * containing (meet) would letterbox, so a uniform stretch is the one option
 * that always covers the full card with no gaps.
 */
export function Puzzle({ id, fill, className }: { id: string; fill: PuzzleFill; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.9", "start 0.35"],
  });

  const applyProgress = (v: number) => {
    if (svgRef.current) {
      svgRef.current.style.setProperty("--animate", String(Math.min(1, Math.max(0, v))));
    }
  };

  useEffect(() => {
    applyProgress(scrollYProgress.get());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useMotionValueEvent(scrollYProgress, "change", applyProgress);

  return (
    <div ref={containerRef} className={cn("absolute inset-0 h-full w-full", className)}>
      <svg
        ref={svgRef}
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        style={{ "--animate": 0 } as React.CSSProperties}
      >
        <defs>
          <pattern id={id} width={1000} height={1000} patternUnits="userSpaceOnUse">
            <rect width="1000" height="1000" fill={fill.base} />
            {fill.blobs.map((blob, i) => (
              <circle key={i} cx={blob.cx} cy={blob.cy} r={blob.r} fill={blob.color} opacity={blob.opacity} />
            ))}
          </pattern>
        </defs>
        {PUZZLE_PIECES.map((piece, i) => (
          <path
            key={i}
            d={piece.d}
            fill={`url(#${id})`}
            stroke="var(--card)"
            strokeWidth={4}
            className="puzzle-piece"
            style={
              {
                "--piece-x": piece.pieceX,
                "--piece-y": piece.pieceY,
                "--start-rotate": `${piece.startRotate}deg`,
              } as React.CSSProperties
            }
          />
        ))}
      </svg>
    </div>
  );
}
