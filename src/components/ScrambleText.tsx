import { useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const TOTAL_TICKS = 12;
const TICK_MS = 26;

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

/**
 * Hover-triggered decode/scramble text: on mouseEnter, characters resolve
 * left-to-right over ~300ms while the not-yet-resolved tail cycles through
 * random characters, like a terminal "decrypting" a string.
 */
export function ScrambleText({ text, className }: { text: string; className?: string }) {
  const [display, setDisplay] = useState(text);
  const tick = useRef(0);
  const timeout = useRef<number>();

  const scramble = () => {
    window.clearTimeout(timeout.current);
    tick.current = 0;

    const step = () => {
      tick.current += 1;
      const revealCount = Math.floor((tick.current / TOTAL_TICKS) * text.length);
      setDisplay(
        text
          .split("")
          .map((char, i) => (char === " " || i < revealCount ? char : randomChar()))
          .join(""),
      );
      if (tick.current < TOTAL_TICKS) {
        timeout.current = window.setTimeout(step, TICK_MS);
      } else {
        setDisplay(text);
      }
    };
    step();
  };

  useEffect(() => () => window.clearTimeout(timeout.current), []);

  return (
    <span className={className} onMouseEnter={scramble}>
      {display}
    </span>
  );
}
