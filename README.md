# Louis Park's Portfolio

Build a single-page interactive resume site for Louis Park, a full-stack 

marketer and strategic planner in real estate / proptech. This is a 

professional career page used for job applications — not a SaaS landing 

page. Do not write generic marketing copy; use only the content below.

=== STRUCTURE ===

Single page, vertical scroll, with a sticky left sidebar navigation 

(desktop) that highlights the active section as the user scrolls. On 

mobile the sidebar collapses to a slim top bar. Smooth scroll to anchors.

Sections: Intro / Proof / Home-Ready Program / Eagle Pacific Properties / 

Eagle Pacific Real Estate / For [Company] / Contact

=== 1. INTRO (full viewport height) ===

Name: Louis Park

One large headline sentence, editable in one place in the code so it can 

be swapped per company. Default text:

"I turn stalled operations into revenue engines — five consecutive years 

of losses to $12.9M in twelve months."

Below it, one supporting line:

"Full-stack marketer and strategic planner. AI-native GTM systems from 

ad impression to booked appointment."

Two buttons: "See the proof" (scrolls to Proof) and "Download resume PDF" 

(placeholder link).

Keep this section restrained — lots of whitespace, one strong typeface, 

no stock imagery, no gradients, no illustration.

=== 2. PROOF (metrics grid) ===

A grid of metric cards. Each card has: a large number, a short label, and 

a "proof" slot underneath that can hold an image, an embedded video, or 

an external link. Build the proof slot as a reusable component with an 

optional type: 'image' | 'video' | 'link' | 'none'. Clicking a card with 

proof opens a lightbox showing that asset. Cards without proof are static.

Metrics:

- $12.9M — Annual revenue generated within 12 months

- $25M — Real estate investment funding secured (Kiavi, Easy Street 

  Capital, KPRE Group)

- $9M+ — Assets acquired in Year 1 under a new division

- 60,000 — Lead database activated with zero added headcount

- 48 — Off-market California properties acquired, $200K+ ARV each

- +34% — Customer LTV increase after repositioning to residential

- 3.5 → 4.4 — Google rating, 9 to 150 reviews in 2 months

- 48,000+ — Real estate agents reached via email campaign

=== 3-5. DIVISION SECTIONS ===

Three sections, identical layout, alternating left/right. Each has: 

division name, a one-line description, a 16:9 video embed slot 

(placeholder for now, accept YouTube/Vimeo/Loom URL), and 3-5 bullet 

achievements. Keep bullets short.

A) HOME-READY PROGRAM (HRP)

Zero-upfront-cost, 30-day pre-listing renovation program for homeowners 

and realtors across Orange County, LA, and the Bay Area.

- Launched the program that converted 5 consecutive years of losses into 

  $12.9M in annual revenue within 12 months

- Targeted 34,000 high-income, under-valued, and distressed-seller homes 

  across NorCal and SoCal

- Ran B2B GTM to 1,100+ regional directors and top agents at Berkshire 

  Hathaway, Keller Williams, Coldwell Banker, eXp Realty, Sotheby's 

  International, Zoom Casa

- Built cross-marketing partnerships with The Agency, Intero, Century 21; 

  webinar campaign converted 24 agents into partners

- Architected AI lead-gen engine: Meta/YouTube capture → Make.com routing 

  → Follow Up Boss → voice/SMS AI that engages, qualifies, books, and 

  live-transfers 24/7

B) EAGLE PACIFIC PROPERTIES

Property acquisition division launched from zero.

- $9M+ in assets acquired in Year 1

- 48 off-market California investment properties, minimum $200K ARV 

  profit each, via New Western ($17B+ platform)

- 4,900+ ready-to-buy off-market property records sourced through 

  national wholesale disposition network

- Partnerships with Story Homes, New Western, and InvestorLift

C) EAGLE PACIFIC REAL ESTATE

Lead generation and acquisition strategy for distressed and motivated 

sellers.

- Built pipeline of 63,000+ motivated/distressed seller leads 

  ($1–3M range, LTV below 50%)

- Sequenced direct mail to 32,000 homes: flyers, door hangers, sticky 

  notes, 3D dimensional mailers

- Partnership with 182 probate attorneys; 6,549+ probate leads from 

  California court data

- 2,000+ tired-landlord leads identified and worked

=== 6. FOR [COMPANY] ===

A section built to be rewritten per application. Structure it so all the 

per-company text lives in a single config object at the top of the file:

companyName, oneLineHook, threeObservations (array of 3), whatIdDoFirst90 

(array of 3). Render as: heading "For [companyName]", the hook, then two 

columns — "What I see" and "What I'd do in the first 90 days".

Fill with clearly-marked placeholder text for now.

=== 7. CONTACT ===

Email, LinkedIn, and a "Download resume PDF" link. No contact form.

=== DESIGN ===

Editorial and restrained — think a well-designed annual report, not a 

startup landing page. Off-white or near-black background, one accent 

color, generous whitespace, strong typographic hierarchy. Numbers should 

be the largest elements on the page. Subtle fade-up on scroll, nothing 

bouncy. Fully responsive; mobile is the priority since recruiters open 

links on phones. No cookie banner, no email gate, no chat widget.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://louispark.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b3c47f42-9a4b-439f-9cca-06a456b32e9b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
