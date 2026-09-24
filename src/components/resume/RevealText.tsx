import { Fragment, useEffect, useLayoutEffect, useRef, useState, type ElementType } from "react";
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
  // "idle" renders as plain, readable text. The hidden state is "armed", and
  // only script sets it, so the headline is legible on first paint and stays
  // legible if the animation never runs.
  const [state, setState] = useState<"idle" | "armed" | "play" | "done">("idle");

  // Hide before the browser paints the hydrated tree, so arming is invisible.
  useLayoutEffect(() => {
    if (reduced) return;
    setState((s) => (s === "idle" ? "armed" : s));
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    let settle = 0;
    let startBy = 0;
    let cancelled = false;
    let started = false;

    const play = () => {
      if (cancelled || started) return;
      started = true;
      window.clearTimeout(startBy);

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
        // onto the wrong lines, so wait for the final layout. Only briefly,
        // though: a slow font must never hold the headline blank, so whichever
        // comes first, the swap or 120ms, starts the reveal.
        if (document.fonts?.status === "loaded" || !document.fonts) {
          play();
        } else {
          startBy = window.setTimeout(play, 120);
          void document.fonts.ready.then(play);
        }
      },
      { threshold: 0 },
    );

    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
      if (settle) window.clearTimeout(settle);
      if (startBy) window.clearTimeout(startBy);
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
