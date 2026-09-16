import { Fragment, useEffect, useRef, useState, type ElementType } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

type Split = "letter" | "line";

/**
 * Text that rises into place, either letter by letter or line by line.
 *
 * Lines are not declared — they are measured. The text is split into words
 * (each an inline-block so words never break mid-reveal), and on entry every
 * mask's offsetTop is read to work out which visual line it landed on. That
 * keeps the line cascade correct at any width, which a hard-coded split could
 * not do for a headline that reflows.
 *
 * Fires once on IntersectionObserver at threshold 0, then unobserves. It never
 * reverses. Under prefers-reduced-motion nothing is scheduled at all — the CSS
 * resolves the split text to ordinary text.
 */
export function RevealText({
  text,
  as,
  by = "line",
  className,
  duration = 800,
  partStagger = 0,
  lineStagger = 90,
}: {
  text: string;
  as?: ElementType;
  by?: Split;
  className?: string;
  /** ms per part */
  duration?: number;
  /** ms between parts inside one line — letter mode only */
  partStagger?: number;
  /** ms between one line and the next */
  lineStagger?: number;
}) {
  const Tag = (as ?? "p") as ElementType;
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const [state, setState] = useState<"idle" | "play" | "done">("idle");

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    let settle = 0;
    let cancelled = false;

    const play = () => {
      if (cancelled) return;

      const masks = Array.from(el.querySelectorAll<HTMLElement>(".rt-mask"));
      let lineTop: number | null = null;
      let lineIndex = -1;
      let indexInLine = 0;
      let last = 0;

      for (const mask of masks) {
        const top = mask.offsetTop;
        // a new line box starts wherever the vertical offset jumps
        if (lineTop === null || Math.abs(top - lineTop) > 2) {
          lineTop = top;
          lineIndex += 1;
          indexInLine = 0;
        }
        const delay = lineIndex * lineStagger + indexInLine * partStagger;
        mask.style.setProperty("--rt-delay", `${delay}ms`);
        last = Math.max(last, delay);
        indexInLine += 1;
      }

      setState("play");
      // once everything has landed, release the masks so no glyph stays clipped
      settle = window.setTimeout(() => setState("done"), last + duration + 80);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        // The webfont loads with display:swap, and Instrument Serif is narrower
        // than the fallback — measuring before the swap would group letters
        // onto the wrong lines. Wait for the final layout.
        if (document.fonts?.status === "loaded") play();
        else if (document.fonts) void document.fonts.ready.then(play);
        else play();
      },
      { threshold: 0 },
    );

    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
      if (settle) window.clearTimeout(settle);
    };
  }, [reduced, duration, partStagger, lineStagger]);

  const words = text.split(" ");
  const shift = by === "letter" ? "calc(100% + 0.12em)" : "110%";

  return (
    <Tag
      ref={ref}
      aria-label={text}
      data-state={state}
      className={cn("rt-root", className)}
      style={
        {
          "--rt-duration": `${duration}ms`,
          "--rt-shift": shift,
        } as React.CSSProperties
      }
    >
      {/* the split spans would otherwise be read out piece by piece */}
      <span aria-hidden="true">
        {words.map((word, wi) => (
          <Fragment key={`${word}-${wi}`}>
            <span className="rt-word">
              {by === "letter" ? (
                Array.from(word).map((char, ci) => (
                  <span key={ci} className="rt-mask">
                    <span className="rt-part">{char}</span>
                  </span>
                ))
              ) : (
                <span className="rt-mask">
                  <span className="rt-part">{word}</span>
                </span>
              )}
            </span>
            {wi < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </span>
    </Tag>
  );
}
