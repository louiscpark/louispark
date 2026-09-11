import type { StepTone } from "@/content/resume";

/**
 * The three phase hues, as CSS custom properties. Shared by the system diagram
 * and the internal-tool cards so both sections read from one palette.
 */
export const PHASE: Record<StepTone, string> = {
  a: "var(--phase-1)",
  b: "var(--phase-2)",
  c: "var(--phase-3)",
};
