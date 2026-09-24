import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { AnimatedNumber } from "@/components/resume/AnimatedNumber";
import { Reveal } from "@/components/resume/Reveal";
import { SideNav } from "@/components/resume/SideNav";
import { BRAND_LOGOS } from "@/content/brand-logos.generated";
import { System } from "@/components/resume/System";
import { ScrollCue } from "@/components/resume/ScrollCue";
import { HeroPortrait } from "@/components/resume/HeroPortrait";
import { AppCard } from "@/components/resume/AppCard";
import { EvidenceDialog } from "@/components/resume/EvidenceDialog";
import { PartnerMarquee } from "@/components/resume/PartnerMarquee";
import { RevealText } from "@/components/resume/RevealText";
import { SmoothScroll } from "@/components/resume/SmoothScroll";
import {
  CONTACT,
  HEADLINE,
  INTERNAL_APPS,
  METRICS,
  RESUME_PDF_URL,
  STACK_GROUPS,
  SUBHEAD,
  isTagCard,
  type ProofCard,
  type StackTool,
} from "@/content/resume";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Louis Park — Full-Stack Marketer & Strategic Planner" },
      {
        name: "description",
        content:
          "Louis Park: real estate and proptech growth leader. $22.9M in fifteen months from a business line that had lost money for five straight years, $25M funding secured, AI-native GTM systems.",
      },
      {
        property: "og:title",
        content: "Louis Park — Full-Stack Marketer & Strategic Planner",
      },
      {
        property: "og:description",
        content:
          "Interactive resume: $22.9M in fifteen months, $25M funding secured, a 200,000+ prospect list built in real estate and proptech.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [openCard, setOpenCard] = useState<ProofCard | null>(null);
  // The card that opened the dialog, so focus can be handed back to it on
  // close. Done here rather than left to the dialog, so the card the reader
  // was on is always where they land again.
  const trigger = useRef<HTMLButtonElement | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SmoothScroll />
      <SideNav />

      <main className="pt-14 lg:ml-64 lg:pt-0 xl:ml-72">
        <Intro />
        <Proof
          onOpen={(card, el) => {
            trigger.current = el;
            setOpenCard(card);
          }}
        />
        <Partnerships />
        <SystemSection />
        <SystemsShipped />
        <Stack />
        <Contact />
      </main>

      <EvidenceDialog
        open={!!openCard}
        onOpenChange={(o) => !o && setOpenCard(null)}
        onCloseFocus={() => trigger.current?.focus()}
        value={openCard ? (isTagCard(openCard) ? openCard.title : openCard.value) : ""}
        label={openCard && !isTagCard(openCard) ? openCard.label : ""}
        evidence={openCard?.evidence}
      />
    </div>
  );
}

const shell = "px-6 md:px-12 lg:px-16 xl:px-24";

function Intro() {
  return (
    <section
      id="intro"
      className={cn(
        shell,
        "relative flex min-h-[92vh] flex-col justify-center overflow-hidden py-24 lg:min-h-screen",
      )}
    >
      <HeroPortrait />

      {/* the copy always sits above the portrait, at full contrast */}
      <div className="relative z-10 lg:max-w-[58%]">
        <RevealText
          as="h1"
          by="letter"
          text={HEADLINE}
          duration={900}
          partStagger={52}
          lineStagger={240}
          className="max-w-3xl text-[1.8rem] leading-[1.12] sm:text-4xl lg:max-w-none lg:text-5xl xl:text-[3.25rem]"
        />

        <Reveal delay={160}>
          <p className="mt-10 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {SUBHEAD}
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#proof"
              className="inline-flex items-center justify-center bg-foreground px-7 py-3.5 text-sm tracking-wide text-background transition-opacity hover:opacity-85"
            >
              See the proof
            </a>
            <a
              href="/resume.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-border px-7 py-3.5 text-sm tracking-wide transition-colors hover:border-foreground"
            >
              View resume
              <ArrowUpRight className="size-4" aria-hidden />
            </a>
          </div>
        </Reveal>
      </div>

      <ScrollCue href="#proof" />
    </section>
  );
}

function SectionHead({ index, title }: { index: string; title: string }) {
  return (
    <div className="mb-14 flex items-baseline gap-6 border-b border-border pb-6">
      <Reveal>
        <span className="eyebrow">{index}</span>
      </Reveal>
      <RevealText
        as="h2"
        text={title}
        duration={800}
        lineStagger={90}
        className="text-3xl sm:text-4xl"
      />
    </div>
  );
}

/** The bottom-right affordance, shown only on cards that can actually open. */
function ViewProof() {
  return (
    <span className="proof-cue mt-auto inline-flex items-center gap-1.5 pt-8 text-xs tracking-wide text-muted-foreground">
      View proof
      <ArrowUpRight className="size-3.5" aria-hidden />
    </span>
  );
}

function Proof({ onOpen }: { onOpen: (c: ProofCard, el: HTMLButtonElement) => void }) {
  return (
    <section id="proof" className={cn(shell, "py-24 lg:py-32")}>
      <SectionHead index="01" title="Proof" />

      <div className="grid gap-px border border-border bg-border sm:grid-cols-2 xl:grid-cols-3">
        {METRICS.map((card, i) => {
          // A card is interactive only when there is something to show. No
          // evidence means no cue, no hover, and no empty dialog.
          const openable = !!card.evidence;
          const title = isTagCard(card) ? card.title : card.value;

          // button when it opens something, plain div when it does not, so the
          // tab order carries exactly the cards that respond to Enter/Space
          const Wrapper = openable ? "button" : "div";
          const interactive = openable
            ? {
                type: "button" as const,
                onClick: (e: React.MouseEvent) =>
                  onOpen(card, e.currentTarget as HTMLButtonElement),
                "aria-label": `View proof for ${title}`,
              }
            : {};

          return (
            <Reveal key={title + i} delay={i * 110} className="bg-card">
              <Wrapper
                {...interactive}
                className={cn(
                  "flex h-full w-full flex-col items-start p-8 text-left lg:p-10",
                  openable && "proof-card cursor-pointer transition-colors hover:bg-secondary",
                )}
                style={
                  isTagCard(card)
                    ? ({ "--tone": "var(--primary)" } as React.CSSProperties)
                    : undefined
                }
              >
                {isTagCard(card) ? (
                  <>
                    {/* no numeral to lead with, so the title takes the top slot
                        and the tags fill the body the metric label would occupy */}
                    <h3 className="font-display text-2xl leading-snug">{card.title}</h3>
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {card.tags.map((tag) => (
                        <li
                          key={tag}
                          className="segment-pill px-4 py-1.5 text-xs text-muted-foreground"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <>
                    <span className="metric-spring numeral text-5xl lg:text-6xl">
                      <AnimatedNumber {...card.number} delay={i * 80} />
                    </span>
                    <span className="mt-5 max-w-[26ch] text-sm leading-relaxed text-muted-foreground">
                      {card.label}
                    </span>
                  </>
                )}

                {openable ? <ViewProof /> : null}
              </Wrapper>
            </Reveal>
          );
        })}
        {/* filler keeps the ruled grid complete at 3 columns */}
        <div className="hidden bg-card xl:block" aria-hidden />
      </div>
    </section>
  );
}

function Partnerships() {
  return (
    <section id="partnerships" className={cn(shell, "py-24 lg:py-32")}>
      <SectionHead index="02" title="Partnerships Secured" />
      <PartnerMarquee />
    </section>
  );
}

function SystemSection() {
  return (
    <section id="system" className={cn(shell, "pt-24 pb-16 lg:pt-32")}>
      <SectionHead index="03" title="The System" />
      <System />
    </section>
  );
}

function SystemsShipped() {
  return (
    <section id="systems-shipped" className={cn(shell, "py-24 lg:py-32")}>
      <SectionHead index="04" title="Systems I Shipped" />

      <Reveal>
        <p className="mb-14 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Internal tools built to take friction out of the operation.
        </p>
      </Reveal>

      <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
        {INTERNAL_APPS.map((app, i) => (
          <Reveal key={app.name} delay={i * 120}>
            <AppCard app={app} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/**
 * Every mark sits in the same 40px box so the twelve tools share one optical
 * cap height and one baseline. Simple Icons marks are bare glyphs and fill the
 * box; downloaded favicons carry their own padding — or are full-bleed app
 * tiles — so they render a little smaller inside it. They are raster and will
 * read softer than the SVGs; they are not upscaled to hide that.
 *
 * If either image fails to load, the tool falls back to its monogram. Never a
 * broken image.
 */
function StackLogo({ tool }: { tool: StackTool }) {
  const [failed, setFailed] = useState(false);
  const hex = `#${tool.brandHex ?? "77736D"}`;
  const downloaded = tool.domain ? BRAND_LOGOS[tool.domain] : undefined;
  const src = tool.slug ? `https://cdn.simpleicons.org/${tool.slug}/${tool.brandHex}` : downloaded;

  if (!src || failed) {
    return (
      <span
        role="img"
        aria-label={tool.name}
        className="flex size-10 items-center justify-center rounded-full border-2 text-[0.6875rem] font-semibold tracking-wide"
        style={{ color: hex, borderColor: `${hex}66` }}
      >
        {tool.mark ?? tool.name.slice(0, 2).toUpperCase()}
      </span>
    );
  }

  return (
    <span className="flex size-10 shrink-0 items-center justify-center">
      <img
        src={src}
        alt={tool.name}
        onError={() => setFailed(true)}
        loading="lazy"
        decoding="async"
        className={cn("block object-contain", tool.slug ? "h-10 w-auto" : "size-9 rounded-md")}
      />
    </span>
  );
}
function Stack() {
  return (
    <section
      id="stack"
      className={cn(
        shell,
        "stack-section relative overflow-hidden border-y border-border py-16 lg:py-20",
      )}
    >
      <Reveal className="stack-sweep" aria-hidden>
        <span className="stack-sweep-line" />
      </Reveal>
      <div className="stack-grid" aria-hidden />
      <div className="relative">
        <div className="mb-10 flex items-baseline gap-6 border-b border-border pb-4">
          <Reveal>
            <span className="eyebrow">05</span>
          </Reveal>
          <RevealText
            as="h2"
            text="Stack"
            duration={800}
            lineStagger={90}
            className="text-3xl sm:text-4xl"
          />
        </div>
        <div className="stack-groups">
          {STACK_GROUPS.map((group, gi) => (
            <Reveal
              key={group.label}
              delay={gi * 90}
              className="stack-group flex flex-col items-center px-4 sm:px-6 lg:px-7"
            >
              <p className="eyebrow text-xs">{group.label}</p>
              <div className="mt-6 flex flex-wrap items-start justify-center gap-x-4 gap-y-6">
                {group.tools.map((tool) => (
                  <div
                    key={tool.name}
                    className="stack-tool relative flex w-[68px] flex-col items-center gap-2"
                    style={{ "--brand": `#${tool.brandHex ?? "77736D"}` } as React.CSSProperties}
                  >
                    <StackLogo tool={tool} />
                    <span className="text-center text-[0.6875rem] leading-tight text-muted-foreground">
                      {tool.name}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  // newTab is explicit: the resume is a same-origin page, so it would not be
  // caught by the http check the outbound links rely on.
  const links: { label: string; value: string; href: string; newTab?: boolean }[] = [
    { label: "Phone", value: CONTACT.phone, href: CONTACT.phoneHref },
    { label: "LinkedIn", value: CONTACT.linkedinLabel, href: CONTACT.linkedin },
    { label: "Instagram", value: CONTACT.instagramLabel, href: CONTACT.instagram },
    { label: "Resume", value: "View resume", href: RESUME_PDF_URL, newTab: true },
  ];

  return (
    <section id="contact" className={cn(shell, "border-t border-border py-24 lg:py-32")}>
      <RevealText
        as="h2"
        text="Let's talk."
        duration={800}
        lineStagger={90}
        className="text-4xl sm:text-5xl"
      />

      {/* four links now, so the ruled grid goes 2-up then 4-up rather than
          leaving an orphan in a three-column row */}
      <div className="mt-14 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {links.map((l, i) => {
          const newTab = l.newTab === true || l.href.startsWith("http");
          return (
            <Reveal key={l.label} delay={i * 70} className="bg-card">
              <a
                href={l.href}
                {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="contact-link flex h-full flex-col gap-3 p-8 hover:bg-secondary"
              >
                <span className="eyebrow">{l.label}</span>
                <span className="contact-link-value flex items-center gap-2 text-base break-all">
                  {l.value}
                  <ArrowUpRight className="size-4 shrink-0 text-primary" aria-hidden />
                </span>
              </a>
            </Reveal>
          );
        })}
      </div>

      <p className="mt-16 text-xs text-muted-foreground">© {new Date().getFullYear()} Louis Park</p>
    </section>
  );
}
