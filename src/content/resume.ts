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

export type Division = {
  id: string;
  name: string;
  description: string;
  /** YouTube / Vimeo / Loom embed URL — leave empty for placeholder */
  videoUrl?: string;
  bullets: string[];
};

export const DIVISIONS: Division[] = [
  {
    id: "home-ready-program",
    name: "Home-Ready Program",
    description:
      "Zero-upfront-cost, 30-day pre-listing renovation program for homeowners and realtors across Orange County, LA, and the Bay Area.",
    videoUrl: "",
    bullets: [
      "Launched the program that converted 5 consecutive years of losses into $12.9M in annual revenue within 12 months",
      "Targeted 34,000 high-income, under-valued, and distressed-seller homes across NorCal and SoCal",
      "Ran B2B GTM to 1,100+ regional directors and top agents at Berkshire Hathaway, Keller Williams, Coldwell Banker, eXp Realty, Sotheby's International, Zoom Casa",
      "Built cross-marketing partnerships with The Agency, Intero, Century 21; webinar campaign converted 24 agents into partners",
      "Architected AI lead-gen engine: Meta/YouTube capture → Make.com routing → Follow Up Boss → voice/SMS AI that engages, qualifies, books, and live-transfers 24/7",
    ],
  },
  {
    id: "eagle-pacific-properties",
    name: "Eagle Pacific Properties",
    description: "Property acquisition division launched from zero.",
    videoUrl: "",
    bullets: [
      "$9M+ in assets acquired in Year 1",
      "48 off-market California investment properties, minimum $200K ARV profit each, via New Western ($17B+ platform)",
      "4,900+ ready-to-buy off-market property records sourced through national wholesale disposition network",
      "Partnerships with Story Homes, New Western, and InvestorLift",
    ],
  },
  {
    id: "eagle-pacific-real-estate",
    name: "Eagle Pacific Real Estate",
    description:
      "Lead generation and acquisition strategy for distressed and motivated sellers.",
    videoUrl: "",
    bullets: [
      "Built pipeline of 63,000+ motivated/distressed seller leads ($1–3M range, LTV below 50%)",
      "Sequenced direct mail to 32,000 homes: flyers, door hangers, sticky notes, 3D dimensional mailers",
      "Partnership with 182 probate attorneys; 6,549+ probate leads from California court data",
      "2,000+ tired-landlord leads identified and worked",
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
  email: "louis@example.com",
  linkedin: "https://www.linkedin.com/in/",
};

export const SECTIONS = [
  { id: "intro", label: "Intro" },
  { id: "proof", label: "Proof" },
  { id: "home-ready-program", label: "Home-Ready Program" },
  { id: "eagle-pacific-properties", label: "Eagle Pacific Properties" },
  { id: "eagle-pacific-real-estate", label: "Eagle Pacific Real Estate" },
  { id: "for-company", label: `For ${company.companyName}` },
  { id: "contact", label: "Contact" },
];
