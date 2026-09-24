// ---------------------------------------------------------------------------
// PER-COMPANY PAGES. One entry per application, keyed by its URL slug, served
// at /<slug>. Nothing here is rendered on the index route.
// ---------------------------------------------------------------------------

/** One adjustable figure in the ROI model. */
export type RoiInput = {
  id: string;
  label: string;
  /** the default, and what "Reset to defaults" returns to */
  value: number;
  min: number;
  max: number;
  step: number;
  /** trails the field, e.g. "%" or "deals / month" */
  unit?: string;
  /**
   * Where the number came from. Shown under the field, verbatim. Say "Source:"
   * for a cited figure and "Assumption:" for one that is reasoned, so the two
   * are never confused for each other.
   */
  source: string;
};

export type Roi = {
  /** one line on the lever this models */
  lever: string;
  inputs: RoiInput[];
  /**
   * Annual value in dollars, at base case. Being a function, this cannot be
   * serialized, so a Company must never be returned from a route loader.
   * Read it straight from this module in the component instead.
   */
  formula: (inputs: Record<string, number>) => number;
};

export type Company = {
  /** URL slug, so /acme resolves to this entry */
  slug: string;
  companyName: string;
  oneLineHook: string;
  threeObservations: string[];
  whatIdDoFirst90: string[];
  /** Optional. With no roi block the calculator does not render at all. */
  roi?: Roi;
};

/**
 * The shape, filled with obviously fake numbers so the pattern is visible at
 * /example without any real company being modelled. Copy this entry, change
 * the slug, and replace every figure and every source line.
 */
const example: Company = {
  slug: "example",
  companyName: "[EXAMPLE — replace with real company data]",
  oneLineHook: "[EXAMPLE — one line on why this company, and why now, in Louis's own words.]",
  threeObservations: [
    "[EXAMPLE — observation 1 about the company's current GTM or market position.]",
    "[EXAMPLE — observation 2 about a gap, bottleneck, or untapped channel.]",
    "[EXAMPLE — observation 3 about the opportunity being left on the table.]",
  ],
  whatIdDoFirst90: [
    "[EXAMPLE — first 30 days: audit, instrument, and pick the one lever.]",
    "[EXAMPLE — days 30-60: build the system and run the first campaign.]",
    "[EXAMPLE — days 60-90: scale what worked, kill what didn't, report numbers.]",
  ],
  roi: {
    lever: "[EXAMPLE — the one lever I would own, in a single line.]",
    inputs: [
      {
        id: "leads",
        label: "Inbound leads per month",
        value: 1000,
        min: 0,
        max: 10000,
        step: 50,
        unit: "leads",
        source: "[EXAMPLE — replace with a cited figure.]",
      },
      {
        id: "conversion",
        label: "Lead to customer conversion",
        value: 2,
        min: 0,
        max: 25,
        step: 0.5,
        unit: "%",
        source: "[EXAMPLE — replace with a cited figure.]",
      },
      {
        id: "value",
        label: "Average customer value",
        value: 4000,
        min: 0,
        max: 50000,
        step: 250,
        unit: "$",
        source: "[EXAMPLE — replace with a cited figure.]",
      },
      {
        id: "lift",
        label: "Conversion lift I would target",
        value: 20,
        min: 0,
        max: 100,
        step: 5,
        unit: "%",
        source: "[EXAMPLE — replace with a stated assumption.]",
      },
    ],
    // extra customers a year from lifting conversion, times what one is worth
    formula: ({ leads = 0, conversion = 0, value = 0, lift = 0 }) =>
      leads * 12 * (conversion / 100) * (lift / 100) * value,
  },
};

export const COMPANIES: Company[] = [example];

export const companyBySlug = (slug: string) => COMPANIES.find((c) => c.slug === slug);
