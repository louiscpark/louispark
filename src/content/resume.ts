// ---------------------------------------------------------------------------
// SINGLE SOURCE OF TRUTH FOR ALL PAGE CONTENT.
// Swap the headline and the `company` block per job application.
// ---------------------------------------------------------------------------

export const HEADLINE =
  "I turn stalled operations into revenue engines — five consecutive years of losses to $12.9M in twelve months.";

export const SUBHEAD =
  "Full-stack marketer and strategic planner. AI-native GTM systems from ad impression to booked appointment.";

export const RESUME_PDF_URL = "#"; // placeholder — drop the PDF link here

export type ProofType = "image" | "video" | "link" | "none";

export type Proof = {
  type: ProofType;
  /** image src, video embed URL (YouTube/Vimeo/Loom), or external href */
  src?: string;
  caption?: string;
};

export type MetricNumber = {
  prefix?: string;
  /** final value the counter lands on */
  value: number;
  suffix?: string;
  decimals?: number;
  /** starting value — only used for ranges like 3.5 → 4.4 */
  from?: number;
};

export type Metric = {
  value: string;
  label: string;
  proof: Proof;
  number: MetricNumber;
};

export const METRICS: Metric[] = [
  {
    value: "$12.9M",
    label: "Annual revenue generated within 12 months",
    proof: { type: "none" },
    number: { prefix: "$", value: 12.9, suffix: "M", decimals: 1 },
  },
  {
    value: "$25M",
    label:
      "Real estate investment funding secured (Kiavi, Easy Street Capital, KPRE Group)",
    proof: { type: "none" },
    number: { prefix: "$", value: 25, suffix: "M" },
  },
  {
    value: "$9M+",
    label: "Assets acquired in Year 1 under a new division",
    proof: { type: "none" },
    number: { prefix: "$", value: 9, suffix: "M+" },
  },
  {
    value: "60,000",
    label: "Lead database activated with zero added headcount",
    proof: { type: "none" },
    number: { value: 60000 },
  },
  {
    value: "48",
    label: "Off-market California properties acquired, $200K+ ARV each",
    proof: { type: "none" },
    number: { value: 48 },
  },
  {
    value: "+34%",
    label: "Customer LTV increase after repositioning to residential",
    proof: { type: "none" },
    number: { prefix: "+", value: 34, suffix: "%" },
  },
  {
    value: "3.5 → 4.4",
    label: "Google rating, 9 to 150 reviews in 2 months",
    proof: { type: "none" },
    number: { prefix: "3.5 → ", value: 4.4, from: 3.5, decimals: 1 },
  },
  {
    value: "48,000+",
    label: "Real estate agents reached via email campaign",
    proof: { type: "none" },
    number: { value: 48000, suffix: "+" },
  },
];

export type StepVideo = {
  vimeoId: string;
  /** Shown bottom-left over the poster, and used for the play control label. */
  title: string;
  /** Overrides the poster resolved at build time from Vimeo's oEmbed API. */
  posterSrc?: string;
  /** Describes the poster frame. Required whenever a poster is shown. */
  posterAlt: string;
};

/**
 * Which of the three palette tones a step carries, by position:
 * a = steps 1-2 (quietest), b = steps 3-5 (mid), c = step 6 (accent).
 */
export type StepTone = "a" | "b" | "c";

/** One counted figure. A step can carry more than one when a single total would misrepresent it. */
export type StepMetric = {
  number: MetricNumber;
  /** Unit that trails the number, e.g. "properties". */
  unit?: string;
};

export type SystemStep = {
  /** "01" … "06" — printed on the node and in the right column. */
  index: string;
  /** Node label, e.g. CAPITAL. Rendered uppercase. */
  label: string;
  /** Each counts up once, when the step first activates. */
  metrics: StepMetric[];
  tone: StepTone;
  /** The one-line statement that carries the narrative. */
  statement: string;
  /** The supporting detail underneath it. */
  body: string;
  video?: StepVideo;
};

/**
 * What was built, in the order it was built: money, then inventory, then who
 * to sell to, then the channel to reach them, then reach, then revenue.
 *
 * Order is chronological, not causal — the diagram shows a sequence of things
 * that were stood up, not a claim that each one produced the next.
 */
export const SYSTEM_STEPS: SystemStep[] = [
  {
    index: "01",
    label: "Capital",
    metrics: [{ number: { prefix: "$", value: 25, suffix: "M" } }],
    tone: "a",
    statement: "Money first. Nothing moves without it.",
    body: "Secured $25M from Kiavi, Easy Street Capital, and KPRE Group.",
  },
  {
    index: "02",
    label: "Supply",
    metrics: [{ number: { value: 48 }, unit: "properties" }],
    tone: "a",
    statement: "Then inventory.",
    body: "48 off-market California properties at $200K+ ARV each, plus 4,900 ready-to-buy records through national disposition networks.",
    video: {
      vimeoId: "1224464076",
      title: "Eagle Pacific Properties",
      posterAlt:
        "Opening frame of the Eagle Pacific Properties video, introducing the off-market acquisition division.",
    },
  },
  {
    index: "03",
    label: "Targeting",
    metrics: [{ number: { value: 12 }, unit: "profiles" }],
    tone: "b",
    statement: "Then who.",
    body: "Segmented the distressed-seller market into 12 owner profiles and tested messaging against each to find the highest-converting segments.",
  },
  {
    index: "04",
    label: "Distribution",
    metrics: [{ number: { value: 1100, suffix: "+" }, unit: "leaders" }],
    tone: "b",
    statement: "Then the channel.",
    body: "B2B go-to-market to 1,100+ brokerage directors and top agents. Partnerships with The Agency, Berkshire Hathaway, eXp, Intero.",
    video: {
      vimeoId: "1224464075",
      title: "Home-Ready Program kickoff",
      posterAlt:
        "Opening frame of the Home-Ready Program kickoff video, presented to brokerage partners.",
    },
  },
  {
    index: "05",
    label: "Demand",
    // Two audiences on two channels — kept apart rather than summed into a
    // single total that would describe neither.
    metrics: [
      { number: { value: 32000 }, unit: "homes" },
      { number: { value: 48000 }, unit: "agents" },
    ],
    tone: "b",
    statement: "Then reach.",
    body: "Direct mail to 32,000 homes, email to 48,000+ agents, paid social across 12 high-equity cities.",
    video: {
      vimeoId: "1224464015",
      title: "Home-Ready Program campaign spot",
      posterAlt:
        "Opening frame of the Home-Ready Program campaign spot, the paid-social ad run in high-equity cities.",
    },
  },
  {
    index: "06",
    label: "Revenue",
    metrics: [{ number: { prefix: "$", value: 12.9, suffix: "M", decimals: 1 } }],
    tone: "c",
    statement: "The result.",
    body: "$12.9M in annual revenue. $9M in assets acquired. 15 months.",
  },
];

export type StackTool = {
  name: string;
  /** Simple Icons slug, for the tools it carries a mark for. */
  slug?: "meta" | "googleads" | "n8n" | "make" | "claude" | "figma" | "notion" | "asana";
  /**
   * Brand domain, for the tools Simple Icons has no mark for. Its icon is
   * downloaded into public/logos/ at build time by scripts/fetch-brand-logos.mjs.
   */
  domain?: string;
  brandHex?: string;
  /** monogram, used only when neither a Simple Icons mark nor a downloaded icon resolves */
  mark?: string;
};

export type StackGroup = {
  label: string;
  tools: StackTool[];
};

export const STACK_GROUPS: StackGroup[] = [
  {
    label: "Demand",
    tools: [
      { name: "Meta Ads", slug: "meta", brandHex: "0467DF" },
      { name: "Google Ads", slug: "googleads", brandHex: "4285F4" },
    ],
  },
  {
    label: "Automation",
    tools: [
      { name: "n8n", slug: "n8n", brandHex: "EA4B71" },
      { name: "Make.com", slug: "make", brandHex: "6D00CC" },
    ],
  },
  {
    label: "CRM",
    tools: [
      {
        name: "Follow Up Boss",
        domain: "followupboss.com",
        brandHex: "1F7A8C",
        mark: "FUB",
      },
    ],
  },
  {
    label: "AI & Build",
    tools: [
      { name: "Claude Cowork", slug: "claude", brandHex: "D97757" },
      { name: "Lovable", domain: "lovable.dev", brandHex: "FF4785", mark: "LV" },
      { name: "Bolt.new", domain: "bolt.new", brandHex: "1389FD", mark: "BN" },
      { name: "HeyGen", domain: "heygen.com", brandHex: "7C3AED", mark: "HG" },
    ],
  },
  {
    label: "Design & Ops",
    tools: [
      { name: "Figma", slug: "figma", brandHex: "F24E1E" },
      { name: "Notion", slug: "notion", brandHex: "000000" },
      { name: "Asana", slug: "asana", brandHex: "F06A6A" },
    ],
  },
];

// --- Rewrite this block for every application ------------------------------
export const company = {
  companyName: "[Company]",
  oneLineHook:
    "[PLACEHOLDER — one line on why this company, and why now, in Louis's own words.]",
  threeObservations: [
    "[PLACEHOLDER — observation 1 about the company's current GTM or market position.]",
    "[PLACEHOLDER — observation 2 about a gap, bottleneck, or untapped channel.]",
    "[PLACEHOLDER — observation 3 about the opportunity that is being left on the table.]",
  ],
  whatIdDoFirst90: [
    "[PLACEHOLDER — first 30 days: audit, instrument, and pick the one lever.]",
    "[PLACEHOLDER — days 30-60: build the system and run the first campaign.]",
    "[PLACEHOLDER — days 60-90: scale what worked, kill what didn't, report numbers.]",
  ],
};

export const CONTACT = {
  phone: "661 612 4137",
  /** E.164 so it dials correctly from a phone. */
  phoneHref: "tel:+16616124137",
  linkedin: "https://www.linkedin.com/in/louiscpark/",
  linkedinLabel: "linkedin.com/in/louiscpark",
};

export const SECTIONS = [
  { id: "intro", label: "Intro" },
  { id: "proof", label: "Proof" },
  { id: "system", label: "The System" },
  { id: "stack", label: "Stack" },
  { id: "for-company", label: `For ${company.companyName}` },
  { id: "contact", label: "Contact" },
];
