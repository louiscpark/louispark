import { Fragment, useEffect, useRef, useState } from "react";
import { AnimatedNumber } from "@/components/resume/AnimatedNumber";
import { CaseStudy } from "@/components/resume/CaseStudy";
import { LazyVimeo } from "@/components/resume/LazyVimeo";
import { SYSTEM_STEPS, type MetricNumber, type SystemStep } from "@/content/resume";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { PHASE } from "@/lib/phase";
import { cn } from "@/lib/utils";

// --- diagram geometry (SVG user units) -------------------------------------
const VB_W = 300;
const BASE_H = 54;
/** A second counted figure adds one line, and one line of height, to a node. */
const METRIC_LINE_H = 18;
const GAP = 28;
const PAD = 3;

const NODE_H = SYSTEM_STEPS.map((s) => BASE_H + (s.metrics.length - 1) * METRIC_LINE_H);

const NODE_Y: number[] = [];
NODE_H.reduce((y, h, i) => {
  NODE_Y[i] = y;
  return y + h + GAP;
}, PAD);

const VB_H = NODE_Y[NODE_Y.length - 1]! + NODE_H[NODE_H.length - 1]! + PAD;

/** Widths taper top to bottom so the stack reads as one narrowing shape. */
const nodeW = (i: number) => 280 - i * 18;
const nodeX = (i: number) => (VB_W - nodeW(i)) / 2;

function formatNumber({ prefix = "", value, suffix = "", decimals = 0 }: MetricNumber) {
  return `${prefix}${value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}${suffix}`;
}

const metricLines = (step: SystemStep) =>
  step.metrics.map((m) =>
    m.unit ? `${formatNumber(m.number)} ${m.unit}` : formatNumber(m.number),
  );

type NodeState = "hidden" | "past" | "active" | "static";

function SystemNode({
  step,
  x,
  y,
  w,
  h,
  state,
}: {
  step: SystemStep;
  x: number;
  y: number;
  w: number;
  h: number;
  state: NodeState;
}) {
  return (
    <g
      className="system-node"
      data-state={state}
      style={{ "--tone": PHASE[step.tone] } as React.CSSProperties}
    >
      {/* soft outer glow, painted behind the box and only lit while active */}
      <rect x={x} y={y} width={w} height={h} rx={6} className="system-node-glow" aria-hidden />
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={6}
        className="system-node-box"
        vectorEffect="non-scaling-stroke"
      />
      <text x={VB_W / 2} y={y + 21} textAnchor="middle" className="system-node-label">
        <tspan className="system-node-index">{step.index}</tspan>
        <tspan dx="7">{step.label.toUpperCase()}</tspan>
      </text>
      {/* Multi-part metrics stack rather than shrink — the type stays put. */}
      {metricLines(step).map((line, k) => (
        <text
          key={line}
          x={VB_W / 2}
          y={y + 40 + k * METRIC_LINE_H}
          textAnchor="middle"
          className="system-node-metric"
        >
          {line}
        </text>
      ))}
    </g>
  );
}

const diagramLabel = `Diagram of the system, six stages in the order they were built: ${SYSTEM_STEPS.map(
  (s) => `${s.index} ${s.label}, ${metricLines(s).join(" and ")}`,
).join("; ")}.`;

/** The full stack, assembled one node at a time as the reader scrolls. */
function SystemDiagram({ active, reduced }: { active: number; reduced: boolean }) {
  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      role="img"
      aria-label={diagramLabel}
      className="system-diagram h-auto max-h-[78vh] w-full max-w-[380px]"
    >
      {SYSTEM_STEPS.slice(0, -1).map((step, i) => {
        const y1 = NODE_Y[i]! + NODE_H[i]!;
        const y2 = NODE_Y[i + 1]!;
        const len = y2 - y1;
        const drawn = reduced || active > i;
        return (
          <line
            key={`connector-${step.index}`}
            x1={VB_W / 2}
            y1={y1}
            x2={VB_W / 2}
            y2={y2}
            className="system-connector"
            style={
              {
                "--tone": PHASE[step.tone],
                strokeDasharray: len,
                strokeDashoffset: drawn ? 0 : len,
              } as React.CSSProperties
            }
            vectorEffect="non-scaling-stroke"
          />
        );
      })}

      {SYSTEM_STEPS.map((step, i) => (
        <SystemNode
          key={step.index}
          step={step}
          x={nodeX(i)}
          y={NODE_Y[i]!}
          w={nodeW(i)}
          h={NODE_H[i]!}
          state={reduced ? "static" : i > active ? "hidden" : i === active ? "active" : "past"}
        />
      ))}
    </svg>
  );
}

/** Under 900px each step carries its own node above the copy. */
function SystemNodeFragment({ step, h }: { step: SystemStep; h: number }) {
  return (
    <svg
      viewBox={`0 0 ${VB_W} ${h + PAD * 2}`}
      role="img"
      aria-label={`Stage ${step.index}, ${step.label}: ${metricLines(step).join(" and ")}.`}
      className="system-diagram w-full max-w-[300px]"
    >
      <SystemNode step={step} x={20} y={PAD} w={260} h={h} state="active" />
    </svg>
  );
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

export function System() {
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
          <SystemDiagram active={active} reduced={reduced} />
        </div>
      </div>

      <div className="min-[900px]:w-[55%]">
        {SYSTEM_STEPS.map((step, i) => (
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
              <SystemNodeFragment step={step} h={NODE_H[i]!} />
            </div>

            <p className="eyebrow">
              {step.index} — {step.label}
            </p>

            <p
              className="numeral mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-2 text-5xl lg:text-6xl"
              style={{ color: PHASE[step.tone] }}
            >
              {step.metrics.map((metric, k) => (
                <Fragment key={metric.unit ?? k}>
                  {k > 0 ? (
                    <span aria-hidden className="text-muted-foreground">
                      ·
                    </span>
                  ) : null}
                  <span className="inline-flex items-baseline gap-3">
                    <AnimatedNumber
                      {...metric.number}
                      delay={k * 120}
                      start={reduced || maxSeen >= i}
                    />
                    {metric.unit ? (
                      <span className="font-sans text-sm tracking-wide text-muted-foreground">
                        {metric.unit}
                      </span>
                    ) : null}
                  </span>
                </Fragment>
              ))}
            </p>

            <p className="mt-7 max-w-xl font-display text-2xl leading-snug sm:text-3xl">
              {step.statement}
            </p>

            <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {step.body}
            </p>

            {step.video || step.caseStudy ? (
              <div
                className={cn(
                  "mt-9",
                  step.caseStudy && step.video
                    ? // case study left, vertical video right, top-aligned;
                      // under 900px they stack with the case study first
                      "grid gap-8 min-[900px]:grid-cols-[1fr_auto] min-[900px]:items-start min-[900px]:gap-10"
                    : "max-w-xl",
                )}
              >
                {step.caseStudy ? (
                  <CaseStudy study={step.caseStudy} tone={PHASE[step.tone]} />
                ) : null}

                {step.video ? (
                  <LazyVimeo
                    vimeoId={step.video.vimeoId}
                    title={step.video.title}
                    posterAlt={step.video.posterAlt}
                    className="min-[900px]:w-auto"
                    {...(step.video.posterSrc ? { posterSrc: step.video.posterSrc } : {})}
                  />
                ) : null}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
