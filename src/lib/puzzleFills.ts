import type { PuzzleFill } from "@/components/Puzzle";

export const CONNECT_FILL: PuzzleFill = {
  base: "#EEF2FF",
  blobs: [
    { cx: 280, cy: 260, r: 260, color: "#0052FF", opacity: 0.16 },
    { cx: 760, cy: 220, r: 220, color: "#0F172A", opacity: 0.06 },
    { cx: 520, cy: 680, r: 320, color: "#4D7CFF", opacity: 0.22 },
    { cx: 850, cy: 800, r: 200, color: "#0052FF", opacity: 0.1 },
  ],
};

export const TRUST_FILL: PuzzleFill = {
  base: "#0052FF",
  blobs: [
    { cx: 260, cy: 240, r: 300, color: "#4D7CFF", opacity: 0.85 },
    { cx: 760, cy: 260, r: 240, color: "#0F172A", opacity: 0.22 },
    { cx: 540, cy: 700, r: 340, color: "#FFFFFF", opacity: 0.14 },
    { cx: 860, cy: 820, r: 220, color: "#4D7CFF", opacity: 0.5 },
  ],
};

export const ACT_FILL: PuzzleFill = {
  base: "#EEF2FF",
  blobs: [
    { cx: 240, cy: 720, r: 300, color: "#4D7CFF", opacity: 0.2 },
    { cx: 720, cy: 760, r: 240, color: "#0052FF", opacity: 0.14 },
    { cx: 500, cy: 320, r: 320, color: "#0F172A", opacity: 0.05 },
    { cx: 800, cy: 220, r: 200, color: "#0052FF", opacity: 0.22 },
  ],
};
