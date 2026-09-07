import { useEffect, useRef, useState } from "react";
import { AnimatedNumber } from "@/components/resume/AnimatedNumber";
import { LazyVimeo } from "@/components/resume/LazyVimeo";
import {
  FUNNEL_STEPS,
  type FunnelStep,
  type FunnelTone,
  type MetricNumber,
} from "@/content/resume";
import { cn } from "@/lib/utils";

// --- diagram geometry (SVG user units) -------------------------------------
const VB_W = 300;
const NODE_H = 54;
const GAP = 28;
const PAD = 3;
const COUNT = FUNNEL_STEPS.length;
const VB_H = PAD * 2 + COUNT * NODE_H + (COUNT - 1) * GAP;

const nodeY = (i: number) => PAD + i * (NODE_H + GAP);
/** Widths taper top to bottom so the stack reads as a funnel. */
const nodeW = (i: number) => 280 - i * 18;
const nodeX = (i: number) => (VB_W - nodeW(i)) / 2;

/** Three tones, all already in the palette: quiet → ink → accent. */
const TONE: Record<FunnelTone, string> = {
  a: "var(--muted-foreground)",
  b: "var(--foreground)",
  c: "var(--primary)",
};

function formatNumber({ prefix = "", value, suffix = "", decimals = 0 }: MetricNumber) {
  return `${prefix}${value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}${suffix}`;
}

const nodeMetric = (step: FunnelStep) =>
  step.unit ? `${formatNumber(step.number)} ${step.unit}` : formatNumber(step.number);

type NodeState = "hidden" | "past" | "active" | "static";

function FunnelNode({
  step,
  x,
  y,
  w,
  state,
}: {
  step: FunnelStep;
  x: number;
  y: number;
  w: number;
  state: NodeState;
}) {
  return (
    <g
      className="funnel-node"
      data-state={state}
      style={{ "--tone": TONE[step.tone] } as React.CSSProperties}
    >
      <rect
        x={x}
        y={y}
        width={w}
        height={NODE_H}
        rx={6}
        className="funnel-node-box"
        vectorEffect="non-scaling-stroke"
      />
      <text x={VB_W / 2} y={y + 21} textAnchor="middle" className="funnel-node-label">
        <tspan className="funnel-node-index">{step.index}</tspan>
        <tspan dx="7">{step.label.toUpperCase()}</tspan>
      </text>
      <text x={VB_W / 2} y={y + 40} textAnchor="middle" className="funnel-node-metric">
        {nodeMetric(step)}
      </text>
    </g>
  );
}

const diagramLabel = `Funnel diagram, six stages in the order they were built: ${FUNNEL_STEPS.map(
  (s) => `${s.index} ${s.label}, ${nodeMetric(s)}`,
).join("; ")}.`;

/** The full stack, assembled one node at a time as the reader scrolls. */
function FunnelDiagram({ active, reduced }: { active: number; reduced: boolean }) {
  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      role="img"
      aria-label={diagramLabel}
      className="funnel-diagram h-auto max-h-[78vh] w-full max-w-[380px]"
    >
      {FUNNEL_STEPS.slice(0, -1).map((step, i) => {
        const y1 = nodeY(i) + NODE_H;
        const y2 = nodeY(i + 1);
        const len = y2 - y1;
        const drawn = reduced || active > i;
        return (
          <line
            key={`connector-${step.index}`}
            x1={VB_W / 2}
            y1={y1}
            x2={VB_W / 2}
            y2={y2}
            className="funnel-connector"
            style={{ strokeDasharray: len, strokeDashoffset: drawn ? 0 : len }}
            vectorEffect="non-scaling-stroke"
          />
        );
      })}

      {FUNNEL_STEPS.map((step, i) => (
        <FunnelNode
          key={step.index}
          step={step}
          x={nodeX(i)}
          y={nodeY(i)}
          w={nodeW(i)}
          state={reduced ? "static" : i > active ? "hidden" : i === active ? "active" : "past"}
        />
      ))}
    </svg>
  );
}

/** Under 900px each step carries its own node above the copy. */
function FunnelNodeFragment({ step }: { step: FunnelStep }) {
  return (
    <svg
      viewBox={`0 0 ${VB_W} ${NODE_H + PAD * 2}`}
      role="img"
      aria-label={`Funnel stage ${step.index}, ${step.label}: ${nodeMetric(step)}.`}
      className="funnel-diagram w-full max-w-[300px]"
    >
      <FunnelNode step={step} x={20} y={PAD} w={260} state="active" />
    </svg>
  );
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return reduced;
}

/**
 * Activates the step whose block is crossing the vertical centre of the
 * viewport. Purely observational — scroll is never intercepted — so scrubbing
 * back up walks the diagram back down again.
 */
function useActiveStep(reduced: boolean) {
  const blocks = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduced) return;

    const onscreen = new Set<number>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const i = Number((entry.target as HTMLElement).dataset["stepIndex"]);
          if (entry.isIntersecting) onscreen.add(i);
          else onscreen.delete(i);
        }
        // More than one block can straddle the band mid-transition; take the
        // one nearest the centre. None means a fast scroll overshot the band —
        // hold the last step rather than snapping back.
        if (onscreen.size === 0) return;

        const middle = window.innerHeight / 2;
        let nearest = -1;
        let best = Infinity;
        for (const i of onscreen) {
          const el = blocks.current[i];
          if (!el) continue;
          const box = el.getBoundingClientRect();
          const distance = Math.abs((box.top + box.bottom) / 2 - middle);
          if (distance < best) {
            best = distance;
            nearest = i;
          }
        }
        if (nearest >= 0) setActive(nearest);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    for (const el of blocks.current) if (el) io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return { blocks, active };
}

export function Funnel() {
  const reduced = usePrefersReducedMotion();
  const { blocks, active } = useActiveStep(reduced);
  const [maxSeen, setMaxSeen] = useState(0);

  // Counters fire once, on first activation, and stay put on the way back up.
  useEffect(() => {
    setMaxSeen((seen) => Math.max(seen, active));
  }, [active]);

  return (
    <div className="flex flex-col gap-8 min-[900px]:flex-row min-[900px]:gap-12 lg:gap-16">
      <div className="hidden min-[900px]:block min-[900px]:w-[45%]">
        <div className="sticky top-14 flex h-[calc(100vh-3.5rem)] items-center justify-center lg:top-0 lg:h-screen">
          <FunnelDiagram active={active} reduced={reduced} />
        </div>
      </div>

      <div className="min-[900px]:w-[55%]">
        {FUNNEL_STEPS.map((step, i) => (
          <div
            key={step.index}
            ref={(el) => {
              blocks.current[i] = el;
            }}
            data-step-index={i}
            className={cn(
              "flex flex-col justify-center rounded-sm border border-border bg-card p-6",
              "mb-6 last:mb-0 sm:p-8",
              "min-[900px]:mb-0 min-[900px]:min-h-[90vh] min-[900px]:rounded-none",
              "min-[900px]:border-0 min-[900px]:bg-transparent min-[900px]:p-0",
            )}
          >
            <div className="mb-8 min-[900px]:hidden">
              <FunnelNodeFragment step={step} />
            </div>

            <p className="eyebrow">
              {step.index} — {step.label}
            </p>

            <p className="numeral mt-5 text-5xl lg:text-6xl" style={{ color: TONE[step.tone] }}>
              <AnimatedNumber {...step.number} start={reduced || maxSeen >= i} />
              {step.unit ? (
                <span className="ml-3 font-sans text-sm tracking-wide text-muted-foreground">
                  {step.unit}
                </span>
              ) : null}
            </p>

            <p className="mt-7 max-w-xl font-display text-2xl leading-snug sm:text-3xl">
              {step.statement}
            </p>

            <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {step.body}
            </p>

            {step.video ? (
              <div className="mt-9 max-w-xl">
                <LazyVimeo
                  vimeoId={step.video.vimeoId}
                  title={step.video.title}
                  posterAlt={step.video.posterAlt}
                  {...(step.video.posterSrc ? { posterSrc: step.video.posterSrc } : {})}
                />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
