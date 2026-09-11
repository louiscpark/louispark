# Louis Park's Portfolio

Build a single-page interactive resume site for Louis Park, a full-stack 

marketer and strategic planner in real estate / proptech. This is a 

professional career page used for job applications — not a SaaS landing 

page. Do not write generic marketing copy; use only the content below.

=== STRUCTURE ===

Single page, vertical scroll, with a sticky left sidebar navigation 

(desktop) that highlights the active section as the user scrolls. On 

mobile the sidebar collapses to a slim top bar. Smooth scroll to anchors.

Sections: Intro / Proof / The System / Systems I Shipped / Stack / 

For [Company] / Contact

On the page only the middle five carry a printed numeral — Proof is 01, 

The System 02, Systems I Shipped 03, Stack 04, For [Company] 05.

=== 1. INTRO (full viewport height) ===

Name: Louis Park

One large headline sentence, editable in one place in the code so it can 

be swapped per company. Default text:

"I build go-to-market engines from zero. The last one generated $12.9M in 

fifteen months from a business line that had lost money for five straight 

years."

Below it, one supporting line:

"Full-stack marketer and strategic planner. AI-native GTM systems from 

ad impression to booked appointment."

Two buttons: "See the proof" (scrolls to Proof) and "Download resume PDF" 

(placeholder link).

At the foot of the hero, centred, a small downward chevron in 

--muted-foreground at 50% that bobs 6px and fades on a 1.8s loop. It is a 

link to the next section, and it fades out for good once the reader is 15% 

of a viewport down the page — it never comes back. Under 

prefers-reduced-motion it renders static and still works as a link.

On the right ~40%, two or three transparent-PNG cut-out portraits from 

public/portrait-1.png … portrait-3.png, layered largest-in-front at 

different scales and heights so they overlap rather than sit in a grid. Any 

file that is not there yet removes itself on the image's error event, so 

the hero works with three, one, or none present. They are warm-duotoned 

(grayscale plus a little sepia) at 90% opacity, and they lag the page by 

0.15 — scrolling 1px moves them up 0.85px. Below 1024px they drop behind 

the copy at 15% opacity as a faint ground.

The copy holds the left ~60% and sits above the portraits in z-order at 

full contrast. Text always wins.

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

=== 3. THE SYSTEM (scroll-driven) ===

Replaces the three division sections. Sticky scrollytelling: on desktop a 

sticky left column (45%) holds an SVG diagram, vertically centred; the 

right column (55%) scrolls through six text blocks of min-height 90vh. An 

IntersectionObserver with rootMargin "-45% 0px -45% 0px" activates the 

step crossing the vertical centre, so the diagram assembles a node at a 

time and scrubs cleanly in reverse. Under 900px there is no sticky column: 

the steps stack as six cards, each with its own node fragment above the 

copy. Never hijacks scroll or wheel events.

Called "The System", not "The Funnel" — the stack of connected nodes shows 

the order things were stood up, and should not be read as a claim that 

each step caused the next.

Colour runs in three explicit phase hues, defined directly in :root as 

--phase-1 (deep teal), --phase-2 (warm amber) and --phase-3 (the existing 

rust --primary). They are NOT derived from --muted-foreground or the chart 

tokens: a near-neutral hue resolves to grey once it is tinted down to 8%, 

which is what the first pass got wrong. Steps 01-02 take phase-1, 03-05 

phase-2, 06 phase-3.

An inactive node is filled with its phase colour at 8% behind a 1.5px 

border of the same colour at 30%, with the step number and label at 55% and 

the metric at 75%. The ACTIVE node lifts to a 16% fill, a 2px border at 

70%, a metric at full opacity in the phase colour, and a soft outer glow in 

the phase colour at 14%. Connectors are 2px at 40% in the phase colour of 

the step ABOVE them.

Tints come from fill-opacity / stroke-opacity on a solid --tone, not from 

colour-mix: the minifier emits a plain colour fallback ahead of any bare 

colour-mix, and a browser that took that fallback would paint the nodes as 

solid ink boxes.

Under prefers-reduced-motion all six nodes show at once, with no scroll 

binding and no count-up.

Steps (node label / metric / statement / body):

01 CAPITAL — $25M — "Money first. Nothing moves without it."

   Secured $25M from Kiavi, Easy Street Capital, and KPRE Group.

02 SUPPLY — 48 properties — "Then inventory."

   48 off-market California properties at $200K+ ARV each, plus 4,900 

   ready-to-buy records through national disposition networks.

03 TARGETING — 12 profiles — "Then who."

   Segmented the distressed-seller market into 12 owner profiles and 

   tested messaging against each to find the highest-converting segments.

04 DISTRIBUTION — 1,100+ leaders — "Then the channel."

   B2B go-to-market to 1,100+ brokerage directors and top agents. 

   Partnerships with The Agency, Berkshire Hathaway, eXp, Intero.

05 DEMAND — 32,000 homes · 48,000 agents — "Then reach."

   Direct mail to 32,000 homes, email to 48,000+ agents, paid social 

   across 12 high-equity cities.

06 REVENUE — $12.9M — "The result."

   $12.9M in annual revenue. $9M in assets acquired. 15 months.

Who to sell to is defined before the channel to reach them, so TARGETING 

precedes DISTRIBUTION. Step 05 carries two separate figures rather than one 

aggregate: they are different channels reaching different audiences, and a 

combined total would describe neither. A step with two figures stacks them 

on two lines in the node and grows the node by one line; the type does not 

shrink.

Step 02 also carries a case study beside its video: a compact card with a 

before/after image pair at 4:3, three money rows (acquisition, renovation, 

resale) separated by hairlines, the delta called out in --primary, and one 

line of context. Card left, vertical video right, top-aligned; under 900px 

they stack with the card first. <CaseStudy> takes its images and stats as 

props so another deal can be dropped onto any other step. Images live at 

public/case-1-before.jpg and -after.jpg; a file that is not there yet 

renders a neutral labelled box, never a broken image. The seeded figures 

are bracketed placeholders.

Videos sit in steps 02, 04, and 05 via <LazyVimeo>, following the steps 

they belong to. Poster frames AND frame shapes are resolved at BUILD time 

from Vimeo's public oEmbed endpoint by scripts/fetch-vimeo-posters.mjs 

(runs on `prebuild`, or `npm run posters`), which writes 

src/content/vimeo-posters.generated.ts. Nothing is fetched on page load; a 

failed fetch keeps the previously generated entry, and an id with nothing 

at all falls back to a flat neutral surface in a 16:9 frame. A per-video 

posterSrc overrides the fetched thumbnail.

The frame follows the video's own dimensions rather than assuming 16:9 — 

landscape videos get 16/9, portrait videos 9/16, so a vertical ad is not 

letterboxed. Two of the three are portrait. Portrait frames are capped at 

520px tall from 640px up and centred in the column; below 640px they take 

the full column width.

=== 4. SYSTEMS I SHIPPED ===

Internal tools, framed by the friction each one removed rather than by what 

it is. Deliberately quieter than The System — this is evidence of range, not 

the main argument. Three cards in a row on desktop, stacked on mobile, from 

a reusable <AppCard>, so another tool is a content change to INTERNAL_APPS 

and nothing else. The cards do not link anywhere: these are internal tools, 

not public products.

Each card runs status label, tool name, problem line, solution line, then an 

optional 16:10 screenshot and two or three capability bullets. The problem 

line is muted and the solution line full contrast, so the before/after reads 

at a glance without either being labelled.

Two states. SHIPPED renders at normal opacity with a phase-colour border 

tint — laid over the hairline as an overlay rule at 30% rather than a 

colour-mix border, for the same reason the diagram avoids colour-mix. IN 

DEVELOPMENT holds back to 60% behind a dashed rule with no screenshot and no 

bullets: unfinished on purpose, not broken.

Screenshots live at public/app-progress.png and public/app-scraper.png; a 

file that is not there yet renders a neutral box carrying the tool name, 

never a broken image. Alt text describes the interface rather than repeating 

the name. No new colours — the cards reuse the phase tokens.

=== 5. STACK ===

Tool logos in five groups: DEMAND · AUTOMATION · AI & BUILD · VIDEO · 

DESIGN & OPS. Five will not sit on one row, so they wrap — 2-up below 

1024px, 3-up above, giving two rows on desktop. Flex-basis is fixed rather 

than auto so the wrap points are deterministic, which is what lets the 

nth-child rules place a hairline divider between groups sharing a row while 

never putting one at the start of a row.

Tools with a Simple Icons mark use it, by slug, at brand colour: Meta Ads, 

Google Ads, n8n, Make.com, Claude Code, Figma, Notion, Asana, GitHub. The 

rest carry a `domain` instead, and scripts/fetch-brand-logos.mjs downloads 

each brand's icon from Google's public favicon service into public/logos/ 

at build time (runs on `prebuild`, or `npm run logos`), writing the 

manifest to src/content/brand-logos.generated.ts: Follow Up Boss, Lovable, 

Bolt.new, HeyGen, Higgsfield, CapCut. CapCut is not in Simple Icons — it 

has no slug there — so it goes through the favicon path like the others.

All marks render inside the same 40px box so they share one optical cap 

height and one baseline. Downloaded icons are raster and read softer than 

the SVGs; they are not upscaled to hide that. A download that fails keeps 

whatever icon is already on disk, and a tool with no icon at all — or whose 

image fails to load in the browser — falls back to its text monogram. Never 

a broken image.

=== 6. FOR [COMPANY] ===

A section built to be rewritten per application. Structure it so all the 

per-company text lives in a single config object at the top of the file:

companyName, oneLineHook, threeObservations (array of 3), whatIdDoFirst90 

(array of 3). Render as: heading "For [companyName]", the hook, then two 

columns — "What I see" and "What I'd do in the first 90 days".

Fill with clearly-marked placeholder text for now.

=== 7. CONTACT ===

Phone (as a tel: link, so it is tappable on mobile), LinkedIn, and a 

"Download resume PDF" link. No contact form, no email address.

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
