# Louis Park's Portfolio

Build a single-page interactive resume site for Louis Park, a full-stack 

marketer and strategic planner in real estate / proptech. This is a 

professional career page used for job applications — not a SaaS landing 

page. Do not write generic marketing copy; use only the content below.

=== STRUCTURE ===

Single page, vertical scroll, with a sticky left sidebar navigation 

(desktop) that highlights the active section as the user scrolls. On 

mobile the sidebar collapses to a slim top bar. Smooth scroll to anchors.

Sections: Intro / Proof / The Funnel / Stack / For [Company] / Contact

On the page only the middle four carry a printed numeral — Proof is 01, 

The Funnel 02, Stack 03, For [Company] 04.

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

=== 3. THE FUNNEL (scroll-driven) ===

Replaces the three division sections. Sticky scrollytelling: on desktop a 

sticky left column (45%) holds an SVG funnel diagram, vertically centred; 

the right column (55%) scrolls through six text blocks of min-height 90vh. 

An IntersectionObserver with rootMargin "-45% 0px -45% 0px" activates the 

step crossing the vertical centre, so the diagram assembles a node at a 

time and scrubs cleanly in reverse. Under 900px there is no sticky column: 

the steps stack as six cards, each with its own node fragment above the 

copy. Never hijacks scroll or wheel events.

Colour runs in three tones from the existing palette — muted for steps 

1-3, ink for 4-5, accent for step 6. Under prefers-reduced-motion all six 

nodes show at once, with no scroll binding and no count-up.

Steps (node label / metric / statement / body):

01 CAPITAL — $25M — "Money first. Nothing moves without it."

   Secured $25M from Kiavi, Easy Street Capital, and KPRE Group.

02 SUPPLY — 48 properties — "Then inventory."

   48 off-market California properties at $200K+ ARV each, plus 4,900 

   ready-to-buy records through national disposition networks.

03 DISTRIBUTION — 1,100+ leaders — "Then the channel."

   B2B go-to-market to 1,100+ brokerage directors and top agents. 

   Partnerships with The Agency, Berkshire Hathaway, eXp, Intero.

04 TARGETING — 12 profiles — "Then who."

   Segmented the distressed-seller market into 12 owner profiles and 

   tested messaging against each to find the highest-converting segments.

05 DEMAND — 80,000 touches — "Then reach."

   Direct mail to 32,000 homes, email to 48,000+ agents, paid social 

   across 12 high-equity cities.

06 REVENUE — $12.9M — "The result."

   $12.9M in annual revenue. $9M in assets acquired. 15 months.

Videos sit in steps 02, 03, and 05 via <LazyVimeo>. Poster frames are 

resolved at BUILD time from Vimeo's public oEmbed endpoint by 

scripts/fetch-vimeo-posters.mjs (runs on `prebuild`, or `npm run 

posters`), which writes src/content/vimeo-posters.generated.ts. Nothing is 

fetched on page load; a failed fetch keeps the previously generated URL, 

and an id with no poster at all falls back to a flat neutral surface. A 

per-video posterSrc overrides the fetched thumbnail.

=== 4. STACK ===

A single ruled row of tool logos, grouped by what each tool is for: 

Demand, Automation, CRM, AI & Build, Design & Ops. Logos come from Simple 

Icons at brand colour, with a monogram fallback for tools it does not 

carry.

=== 5. FOR [COMPANY] ===

A section built to be rewritten per application. Structure it so all the 

per-company text lives in a single config object at the top of the file:

companyName, oneLineHook, threeObservations (array of 3), whatIdDoFirst90 

(array of 3). Render as: heading "For [companyName]", the hook, then two 

columns — "What I see" and "What I'd do in the first 90 days".

Fill with clearly-marked placeholder text for now.

=== 6. CONTACT ===

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
