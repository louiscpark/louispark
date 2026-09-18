import { useEffect, useRef, useState } from "react";
import { onFrame } from "@/lib/lenis";

/**
 * Wide enough that the head's glow is not clipped at the SVG edge; the line
 * itself runs down the middle. User units are CSS pixels — the viewBox is
 * sized from the measured host, so the scale stays 1:1 and the 2px stroke and
 * 5px head are literal.
 */
const VB_W = 24;
const X = VB_W / 2;
const HEAD_R = 2.5;
const GLOW_R = 7;

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/**
 * The line down the left edge of the system, drawn as the reader descends.
 *
 * Two paths on the same geometry: a neutral track, and a progress path
 * revealed by walking stroke-dashoffset down from the full length. Progress is
 * read straight off the host's bounding rect every frame, so it scrubs in both
 * directions — scrolling back up retracts the beam and the head with it.
 *
 * Under prefers-reduced-motion the whole path renders at rest in the track
 * colour: no binding, no head, no glow.
 */
export function TracingBeam({ tone, reduced }: { tone: string; reduced: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const progress = useRef<SVGPathElement>(null);
  const head = useRef<SVGGElement>(null);
  const [height, setHeight] = useState(0);

  // The beam spans the section, whose height depends on how the copy wraps.
  useEffect(() => {
    const el = host.current;
    if (!el) return;

    const ro = new ResizeObserver(([entry]) => {
      if (entry) setHeight(entry.contentRect.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (reduced || !height) return;

    const el = host.current;
    const path = progress.current;
    const dot = head.current;
    if (!el || !path || !dot) return;

    const total = path.getTotalLength();
    let last = -1;

    return onFrame(() => {
      const box = el.getBoundingClientRect();
      const viewport = window.innerHeight;
      // 0 when the top reaches the bottom of the viewport, 1 when the bottom
      // reaches the top of it.
      const span = viewport + box.height;
      const p = span <= 0 ? 0 : clamp01((viewport - box.top) / span);

      // Sub-pixel churn isn't worth a layout write on a 60fps loop.
      if (Math.abs(p - last) < 0.0004) return;
      last = p;

      path.style.strokeDashoffset = String(total * (1 - p));
      const point = path.getPointAtLength(total * p);
      dot.setAttribute("transform", `translate(${point.x} ${point.y})`);
    });
  }, [reduced, height]);

  const d = `M ${X} 0 L ${X} ${height}`;

  return (
    <div
      ref={host}
      aria-hidden
      // Below 900px the section stacks and there is no column for the beam to
      // run down, so it does not render at all.
      className="pointer-events-none absolute inset-y-0 -left-5 hidden w-6 md:-left-8 lg:-left-10 min-[900px]:block"
      style={{ "--beam-tone": tone } as React.CSSProperties}
    >
      {height > 0 ? (
        <svg
          viewBox={`0 0 ${VB_W} ${height}`}
          width={VB_W}
          height={height}
          className="tracing-beam h-full w-full"
        >
          <path d={d} className="tracing-beam-track" />

          {reduced ? null : (
            <>
              <path
                ref={progress}
                d={d}
                className="tracing-beam-progress"
                strokeDasharray={height}
                strokeDashoffset={height}
              />
              <g ref={head} transform={`translate(${X} 0)`}>
                <circle r={GLOW_R} className="tracing-beam-glow" />
                <circle r={HEAD_R} className="tracing-beam-head" />
              </g>
            </>
          )}
        </svg>
      ) : null}
    </div>
  );
}
