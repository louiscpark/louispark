import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AnimatedNumber } from "@/components/resume/AnimatedNumber";
import { Reveal } from "@/components/resume/Reveal";
import { SideNav } from "@/components/resume/SideNav";
import { ProofAsset, ProofBadge } from "@/components/resume/ProofSlot";
import { BRAND_LOGOS } from "@/content/brand-logos.generated";
import { System } from "@/components/resume/System";
import { ScrollCue } from "@/components/resume/ScrollCue";
import { HeroPortraits } from "@/components/resume/HeroPortraits";
import { AppCard } from "@/components/resume/AppCard";
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
  company,
  type Metric,
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
          "Interactive resume: $22.9M in fifteen months, $25M funding secured, 60,000-lead database activated in real estate and proptech.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [openMetric, setOpenMetric] = useState<Metric | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SmoothScroll />
      <SideNav />

      <main className="pt-14 lg:ml-64 lg:pt-0 xl:ml-72">
        <Intro />
        <Proof onOpen={setOpenMetric} />
        <Partners />
        <SystemSection />
        <SystemsShipped />
        <Stack />
        <ForCompany />
        <Contact />
      </main>

      <Dialog open={!!openMetric} onOpenChange={(o) => !o && setOpenMetric(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-normal">
              {openMetric?.value}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">{openMetric?.label}</p>
          </DialogHeader>
          {openMetric ? <ProofAsset proof={openMetric.proof} /> : null}
        </DialogContent>
      </Dialog>
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
      <HeroPortraits />

      {/* the copy always sits above the portraits, at full contrast */}
      <div className="relative z-10 lg:max-w-[60%]">
        <Reveal>
          <p className="eyebrow">Louis Park — Interactive Resume</p>
        </Reveal>

        <RevealText
          as="h1"
          by="letter"
          text={HEADLINE}
          duration={900}
          partStagger={52}
          lineStagger={240}
          className="mt-8 max-w-3xl text-[1.8rem] leading-[1.12] sm:text-4xl lg:max-w-none lg:text-5xl xl:text-[3.25rem]"
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
              href={RESUME_PDF_URL}
              className="inline-flex items-center justify-center gap-2 border border-border px-7 py-3.5 text-sm tracking-wide transition-colors hover:border-foreground"
            >
              Download resume PDF
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

function Proof({ onOpen }: { onOpen: (m: Metric) => void }) {
  return (
    <section id="proof" className={cn(shell, "py-24 lg:py-32")}>
      <SectionHead index="01" title="Proof" />

      <div className="grid gap-px border border-border bg-border sm:grid-cols-2 xl:grid-cols-3">
        {METRICS.map((m, i) => {
          const clickable = m.proof.type !== "none";
          const Wrapper = clickable ? "button" : "div";
          return (
            <Reveal key={m.value + i} delay={i * 110} className="bg-card">
              <Wrapper
                {...(clickable
                  ? {
                      onClick: () => onOpen(m),
                      type: "button" as const,
                      "aria-label": `View proof for ${m.value}`,
                    }
                  : {})}
                className={cn(
                  "flex h-full w-full flex-col items-start p-8 text-left lg:p-10",
                  clickable && "transition-colors hover:bg-secondary",
                )}
              >
                <span className="metric-spring numeral text-5xl lg:text-6xl">
                  <AnimatedNumber {...m.number} delay={i * 80} />
                </span>
                <span className="mt-5 max-w-[26ch] text-sm leading-relaxed text-muted-foreground">
                  {m.label}
                </span>
                <ProofBadge proof={m.proof} />
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

function Partners() {
  return (
    <section id="partners" className={cn(shell, "py-24 lg:py-32")}>
      <SectionHead index="02" title="Partners" />
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

function ForCompany() {
  return (
    <section id="for-company" className={cn(shell, "py-24 lg:py-32")}>
      <SectionHead index="06" title={`For ${company.companyName}`} />

      <Reveal>
        <p className="max-w-3xl font-display text-2xl leading-snug sm:text-3xl">
          {company.oneLineHook}
        </p>
      </Reveal>

      <div className="mt-16 grid gap-12 md:grid-cols-2 md:gap-16">
        <div>
          <Reveal>
            <h3 className="eyebrow">What I see</h3>
          </Reveal>
          <ol className="mt-6 space-y-6">
            {company.threeObservations.map((o, i) => (
              <Reveal as="li" key={i} delay={i * 70} className="flex gap-4">
                <span className="numeral text-lg text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm leading-relaxed text-muted-foreground">{o}</span>
              </Reveal>
            ))}
          </ol>
        </div>

        <div>
          <Reveal>
            <h3 className="eyebrow">What I&apos;d do in the first 90 days</h3>
          </Reveal>
          <ol className="mt-6 space-y-6">
            {company.whatIdDoFirst90.map((o, i) => (
              <Reveal as="li" key={i} delay={i * 70} className="flex gap-4">
                <span className="numeral text-lg text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm leading-relaxed text-muted-foreground">{o}</span>
              </Reveal>
            ))}
          </ol>
        </div>
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
  const links = [
    { label: "Phone", value: CONTACT.phone, href: CONTACT.phoneHref },
    { label: "LinkedIn", value: CONTACT.linkedinLabel, href: CONTACT.linkedin },
    { label: "Instagram", value: CONTACT.instagramLabel, href: CONTACT.instagram },
    { label: "Resume", value: "Download PDF", href: RESUME_PDF_URL },
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
          const external = l.href.startsWith("http");
          return (
            <Reveal key={l.label} delay={i * 70} className="bg-card">
              <a
                href={l.href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
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
