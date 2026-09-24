// ---------------------------------------------------------------------------
// SINGLE SOURCE OF TRUTH FOR ALL PAGE CONTENT.
// Swap the headline and the `company` block per job application.
// ---------------------------------------------------------------------------

export const HEADLINE =
  "I build go-to-market engines from zero — two real estate divisions inside a construction company, and $22.9M in fifteen months.";

export const SUBHEAD =
  "Full-stack marketer and strategic planner. AI-native GTM systems from ad impression to booked appointment.";

/** The standalone resume page in public/. Carries its own Download PDF button. */
export const RESUME_PDF_URL = "/resume.html";

/**
 * The artifact sitting behind a figure. A card offers "View proof" only when
 * this is present, so the page never promises evidence it cannot produce.
 *
 * src is the shape the type implies: a path in public/ for an image, a Vimeo
 * id for a video, an ordered list of image paths for a gallery, an href for a
 * link. `source` is the one line saying where the number itself comes from.
 */
export type Evidence = { source: string; caption?: string } & (
  | { type: "image"; src: string }
  | { type: "video"; src: string }
  | { type: "gallery"; src: string[] }
  | { type: "link"; src: string }
);

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
  number: MetricNumber;
  evidence?: Evidence;
};

/**
 * A proof card carrying no counted figure. The body is a wrapped row of tags
 * instead, so it takes the same outer frame as the metric cards but leads with
 * its title rather than a numeral.
 */
export type TagCard = {
  title: string;
  tags: string[];
  evidence?: Evidence;
};

export type ProofCard = Metric | TagCard;

export const isTagCard = (card: ProofCard): card is TagCard => "tags" in card;

export const METRICS: ProofCard[] = [
  {
    value: "$22.9M",
    label: "Annual revenue generated in 15 months",
    number: { prefix: "$", value: 22.9, suffix: "M", decimals: 1 },
    evidence: {
      type: "video",
      src: "1224464075",
      caption: "Home-Ready Program kickoff",
      source: "Program kickoff presented to brokerage partners.",
    },
  },
  {
    value: "$25M",
    label: "Real estate investment funding secured (Kiavi, Easy Street Capital, KPRE Group)",
    number: { prefix: "$", value: 25, suffix: "M" },
  },
  {
    value: "$9M+",
    label: "Assets acquired in 15 months under a new division",
    number: { prefix: "$", value: 9, suffix: "M+" },
  },
  {
    value: "200,000+",
    label: "Prospect list built across owner and agent segments",
    number: { value: 200000, suffix: "+" },
  },
  {
    value: "48",
    label: "Off-market California properties acquired, $300K+ ARV each",
    number: { value: 48 },
    evidence: {
      type: "video",
      src: "1224464076",
      caption: "Eagle Pacific Properties",
      source: "Introduction to the off-market acquisition division.",
    },
  },
  {
    value: "+34%",
    label: "Customer LTV increase after repositioning to residential",
    number: { prefix: "+", value: 34, suffix: "%" },
  },
  {
    title: "Omnichannel Marketing",
    tags: [
      "Direct mail",
      "Email",
      "SMS",
      "Meta Ads",
      "YouTube Ads",
      "Shopping cart ads",
      "Signs & riders",
      "Influencer realtor cross-marketing",
      "Tom Ferry sponsorship",
      "AREAA",
    ],
    evidence: {
      type: "gallery",
      src: ["/flyer-1.png", "/flyer-2.png", "/flyer-3.png", "/flyer-4.png"],
      caption: "Campaign flyers",
      source: "Print and direct mail assets produced for the program.",
    },
  },
  {
    value: "48,000+",
    label: "Real estate agents reached via email campaign",
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
  /** Qualifier after the unit, set smaller so it stays subordinate to it. */
  note?: string;
};

export type CaseStat = { label: string; value: string };

/** A single deal, shown as a compact before/after card inside a step. */
export type CaseStudy = {
  label: string;
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  stats: CaseStat[];
  /** The delta, called out under the stat rows in --primary. */
  highlight: CaseStat;
  /** One line of context. Keep it under 20 words. */
  context: string;
};

/**
 * A case study only renders once its figures are real. Bracketed stand-ins
 * like [$000,000] are the tell, so the card hides itself until a deal is
 * dropped in rather than publishing a sample as if it were work.
 */
export const caseStudyIsReady = (study: CaseStudy) =>
  ![...study.stats.map((s) => s.value), study.highlight.value, study.context].some((v) =>
    v.includes("["),
  );

/** One audience, and the one line that qualifies it. */
export type AudienceProfile = { name: string; qualifier: string };

/**
 * The two cuts a step's market was segmented by, shown under the body as a
 * compact breakdown rather than prose.
 */
export type Segmentation = {
  signalsLabel: string;
  signals: string[];
  audienceLabel: string;
  audiences: AudienceProfile[];
  closing: string;
};

export type SystemStep = {
  /** "01" … "06" — printed on the node and in the right column. */
  index: string;
  /** Node label, e.g. CAPITAL. Rendered uppercase. */
  label: string;
  /** Each counts up once, when the step first activates. Drives the right column. */
  metrics: StepMetric[];
  /**
   * What the diagram node shows, when a rolled-up figure reads better there
   * than the component parts. Falls back to `metrics`.
   */
  nodeMetrics?: StepMetric[];
  tone: StepTone;
  /** The one-line statement that carries the narrative. */
  statement: string;
  /** The supporting detail underneath it. */
  body: string;
  /** A single figure pulled out beneath the body, in --primary. */
  highlight?: CaseStat;
  segmentation?: Segmentation;
  video?: StepVideo;
  caseStudy?: CaseStudy;
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
    metrics: [{ number: { value: 4900, suffix: "+" }, unit: "off-market properties" }],
    tone: "a",
    statement: "Then inventory.",
    body: "4,900+ off-market California property records sourced through national wholesale disposition networks. 48 of those carried ARV spreads above $300K.",
    video: {
      vimeoId: "1224464076",
      title: "Eagle Pacific Properties",
      posterAlt:
        "Opening frame of the Eagle Pacific Properties video, introducing the off-market acquisition division.",
    },
    // Every figure below is a placeholder — swap in a real deal.
    caseStudy: {
      label: "Off-market deal — sample",
      beforeSrc: "/case-1-before.jpg",
      afterSrc: "/case-1-after.jpg",
      beforeAlt: "The property before renovation.",
      afterAlt: "The same property after renovation.",
      stats: [
        { label: "Acquisition", value: "[$000,000]" },
        { label: "Renovation", value: "[$00,000]" },
        { label: "Resale", value: "[$000,000]" },
      ],
      highlight: { label: "Value created", value: "[+$000,000]" },
      context:
        "Sourced through a wholesale disposition partner in Irvine that I brought into the company's acquisition pipeline.",
    },
  },
  {
    index: "03",
    label: "Targeting",
    metrics: [{ number: { value: 12 }, unit: "ICPs" }],
    tone: "b",
    statement: "Then who.",
    body: "Segmented the market twice — by distress signal, then by buyer type — into 12 ideal customer profiles (ICPs).",
    segmentation: {
      signalsLabel: "Distress signals",
      signals: ["Probate", "Divorce", "Notice of Default", "Pre-foreclosure", "Tired landlords"],
      audienceLabel: "Audience profiles",
      audiences: [
        { name: "Realtors", qualifier: "fix-and-flip program partners" },
        { name: "Homeowners", qualifier: "direct distressed sellers" },
        { name: "Investors", qualifier: "acquisition and disposition buyers" },
      ],
      closing: "Messaging tested against each to find the highest-converting segments.",
    },
  },
  {
    index: "04",
    label: "Distribution",
    metrics: [{ number: { value: 1100, suffix: "+" }, unit: "leaders" }],
    tone: "b",
    statement: "Then the channel.",
    body: "Targeted team leads, regional directors, and top-producing agents — the people who bring a whole office with them. Partnerships with The Agency, Berkshire Hathaway, eXp, and Intero.",
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
      { number: { value: 32000 }, unit: "homeowners", note: "(D2C)" },
      { number: { value: 48000 }, unit: "agents" },
    ],
    // The node rolls the two audiences up; the right column keeps them apart.
    nodeMetrics: [{ number: { value: 80000, suffix: "+" }, unit: "homeowners & agents" }],
    tone: "b",
    statement: "Then reach.",
    body: "Distribution went narrow and senior. Demand went wide — direct mail to 32,000 homeowners, email to 48,000+ agents, paid social across 12 high-equity cities.",
    highlight: { label: "Cost per landing page view", value: "$0.70" },
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
    metrics: [{ number: { prefix: "$", value: 22.9, suffix: "M", decimals: 1 } }],
    tone: "c",
    statement: "The result.",
    body: "$22.9M in annual revenue. $9M in assets acquired. 15 months.",
  },
];

/** Named in the marquee band. Order is the reading order. */
export const PARTNERS = [
  "Kiavi",
  "Easy Street Capital",
  "KPRE Group",
  "New Western",
  "InvestorLift",
  "Story Homes",
  "The Agency",
  "Berkshire Hathaway",
  "eXp Realty",
  "Intero",
  "Century 21",
];

export type AppStatus = "shipped" | "in-development";

/**
 * An internal tool, framed by the friction it removed rather than by what it
 * is. Screenshot and bullets are optional — a tool still in development shows
 * neither.
 */
export type InternalApp = {
  status: AppStatus;
  name: string;
  /** The friction that existed before. Rendered muted. */
  problem: string;
  /** What was built. Rendered at full contrast. */
  solution: string;
  bullets?: string[];
  screenshotSrc?: string;
  /** Describes the interface. Must not just repeat the tool name. */
  screenshotAlt?: string;
  /** Phase token for the card's border tint. */
  tone?: StepTone;
};

export const INTERNAL_APPS: InternalApp[] = [
  {
    status: "shipped",
    name: "Renovation Progress Tracker",
    problem: "Realtor partners were calling for status updates on their listings.",
    solution: "Agent-facing web app that pushes live project status to them instead.",
    bullets: [
      "Per-project status and milestone timeline",
      "Photo updates delivered to partner agents",
      "Removed the manual status-request loop",
    ],
    screenshotSrc: "/app-progress.png",
    screenshotAlt:
      "Project view with a milestone timeline running down the page and dated photo updates beside each stage.",
    tone: "a",
  },
  {
    status: "shipped",
    name: "Agent Data Scraper",
    problem: "Partner targeting ran on manually assembled agent lists.",
    solution:
      "Internal tool that compiles and structures realtor contact and performance data automatically.",
    bullets: [
      "Structured agent and brokerage records",
      "Feeds the partner outreach pipeline",
      "Replaced manual list building",
    ],
    screenshotSrc: "/app-scraper.png",
    screenshotAlt:
      "Table of compiled realtor records, one row per agent, with brokerage, contact and recent-performance columns.",
    tone: "b",
  },
];

export type StackTool = {
  name: string;
  /** Simple Icons slug, for the tools it carries a mark for. */
  slug?: "meta" | "googleads" | "n8n" | "make" | "claude" | "figma" | "notion" | "asana" | "github";
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
      { name: "Claude Code", slug: "claude", brandHex: "D97757" },
      { name: "Lovable", domain: "lovable.dev", brandHex: "FF4785", mark: "LV" },
      { name: "Bolt.new", domain: "bolt.new", brandHex: "1389FD", mark: "BN" },
    ],
  },
  {
    label: "Video",
    tools: [
      { name: "Higgsfield", domain: "higgsfield.ai", brandHex: "CCFF00", mark: "HF" },
      { name: "CapCut", domain: "capcut.com", brandHex: "000000", mark: "CC" },
      { name: "HeyGen", domain: "heygen.com", brandHex: "7C3AED", mark: "HG" },
    ],
  },
  {
    label: "Design & Ops",
    tools: [
      { name: "Figma", slug: "figma", brandHex: "F24E1E" },
      { name: "Notion", slug: "notion", brandHex: "000000" },
      { name: "Asana", slug: "asana", brandHex: "F06A6A" },
      { name: "GitHub", slug: "github", brandHex: "181717" },
    ],
  },
];

// --- Rewrite this block for every application ------------------------------
export const company = {
  companyName: "[Company]",
  oneLineHook: "[PLACEHOLDER — one line on why this company, and why now, in Louis's own words.]",
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
  instagram: "https://instagram.com/louis_vici",
  instagramLabel: "@louis_vici",
};

export const SECTIONS = [
  { id: "intro", label: "Intro" },
  { id: "proof", label: "Proof" },
  { id: "partnerships", label: "Partnerships Secured" },
  { id: "system", label: "The System" },
  { id: "systems-shipped", label: "Systems I Shipped" },
  { id: "stack", label: "Stack" },
  { id: "contact", label: "Contact" },
];
