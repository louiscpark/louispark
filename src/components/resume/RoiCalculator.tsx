import { useMemo, useRef, useState } from "react";
import { AnimatedNumber } from "@/components/resume/AnimatedNumber";
import { Reveal } from "@/components/resume/Reveal";
import type { Roi } from "@/content/companies";

/** The three cases the model reports, and what each multiplies the base by. */
const CASES = [
  { key: "conservative", label: "Conservative", factor: 0.5 },
  { key: "base", label: "Base", factor: 1 },
  { key: "upside", label: "Upside", factor: 1.5 },
] as const;

/**
 * One figure, counting from wherever it last sat rather than from zero, so a
 * slider drag reads as the number moving instead of restarting.
 */
function Figure({ value, emphasis }: { value: number; emphasis: boolean }) {
  const previous = useRef(0);
  const from = previous.current;
  previous.current = value;

  return (
    <span
      className={
        emphasis
          ? "numeral block text-4xl text-primary sm:text-5xl"
          : "numeral block text-2xl text-muted-foreground sm:text-3xl"
      }
    >
      <AnimatedNumber prefix="$" value={value} from={from} start duration={520} />
    </span>
  );
}

/**
 * What the lever could be worth, from figures the reader can change.
 *
 * Every input carries its own provenance line, and the disclaimer under the
 * output is not dismissible, because the honest version of this is a model
 * built on stated assumptions rather than a forecast.
 */
export function RoiCalculator({ roi, companyName }: { roi: Roi; companyName: string }) {
  const defaults = useMemo(
    () => Object.fromEntries(roi.inputs.map((i) => [i.id, i.value])) as Record<string, number>,
    [roi],
  );
  const [values, setValues] = useState<Record<string, number>>(defaults);

  const set = (id: string, raw: number, min: number, max: number) => {
    const clamped = Number.isFinite(raw) ? Math.min(max, Math.max(min, raw)) : min;
    setValues((v) => ({ ...v, [id]: clamped }));
  };

  const base = roi.formula(values);
  const dirty = roi.inputs.some((i) => values[i.id] !== i.value);

  return (
    <div className="mt-16 border-t border-border pt-12">
      <h3 className="font-display text-2xl leading-snug sm:text-3xl">
        What this could be worth to {companyName}
      </h3>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{roi.lever}</p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        {/* inputs */}
        <div className="space-y-8">
          {roi.inputs.map((input) => (
            <div key={input.id}>
              <div className="flex items-baseline justify-between gap-4">
                <label htmlFor={`roi-${input.id}`} className="text-sm">
                  {input.label}
                </label>
                <span className="flex items-baseline gap-1.5">
                  <input
                    id={`roi-${input.id}`}
                    type="number"
                    value={values[input.id] ?? input.value}
                    min={input.min}
                    max={input.max}
                    step={input.step}
                    onChange={(e) =>
                      set(input.id, e.currentTarget.valueAsNumber, input.min, input.max)
                    }
                    className="numeral w-28 border-b border-border bg-transparent pb-1 text-right text-lg tabular-nums focus:border-foreground focus:outline-none"
                  />
                  {input.unit ? (
                    <span className="text-xs text-muted-foreground">{input.unit}</span>
                  ) : null}
                </span>
              </div>

              <input
                type="range"
                aria-label={`${input.label} slider`}
                value={values[input.id] ?? input.value}
                min={input.min}
                max={input.max}
                step={input.step}
                onChange={(e) => set(input.id, e.currentTarget.valueAsNumber, input.min, input.max)}
                className="roi-slider mt-4 w-full"
              />

              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{input.source}</p>
            </div>
          ))}

          <button
            type="button"
            onClick={() => setValues(defaults)}
            disabled={!dirty}
            className="text-xs tracking-wide text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground disabled:cursor-default disabled:opacity-40 disabled:hover:text-muted-foreground"
          >
            Reset to defaults
          </button>
        </div>

        {/* output */}
        <div>
          <p className="eyebrow text-[0.625rem]">Estimated annual value</p>

          <div className="mt-6 grid grid-cols-3 gap-4">
            {CASES.map((c) => (
              <div key={c.key}>
                <Figure value={Math.round(base * c.factor)} emphasis={c.key === "base"} />
                <span className="mt-2 block text-xs tracking-wide text-muted-foreground">
                  {c.label}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-8 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
            An estimate from public data and stated assumptions, not a guarantee. Adjust any input.
          </p>
        </div>
      </div>
    </div>
  );
}

/** Wrapped so the block fades in with the rest of the section. */
export function RoiSection({ roi, companyName }: { roi: Roi; companyName: string }) {
  return (
    <Reveal>
      <RoiCalculator roi={roi} companyName={companyName} />
    </Reveal>
  );
}
