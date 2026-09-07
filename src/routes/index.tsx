import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AnimatedNumber } from "@/components/resume/AnimatedNumber";
import { Reveal } from "@/components/resume/Reveal";
import { SideNav } from "@/components/resume/SideNav";
import { ProofAsset, ProofBadge } from "@/components/resume/ProofSlot";
import { Funnel } from "@/components/resume/Funnel";
import {
  CONTACT,
  HEADLINE,
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
          "Louis Park: real estate and proptech growth leader. Five years of losses to $12.9M in twelve months, $25M funding secured, AI-native GTM systems.",
      },
      {
        property: "og:title",
        content: "Louis Park — Full-Stack Marketer & Strategic Planner",
      },
      {
        property: "og:description",
        content:
          "Interactive resume: $12.9M annual revenue in 12 months, $25M funding secured, 60,000-lead database activated in real estate and proptech.",
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
      <SideNav />

      <main className="pt-14 lg:ml-64 lg:pt-0 xl:ml-72">
        <Intro />
        <Proof onOpen={setOpenMetric} />
        <FunnelSection />
        <Stack />
        <ForCompany />
        <Contact />
      </main>

      <Dialog
        open={!!openMetric}
        onOpenChange={(o) => !o && setOpenMetric(null)}
      >
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
        "flex min-h-[92vh] flex-col justify-center py-24 lg:min-h-screen",
      )}
    >
      <Reveal>
        <p className="eyebrow">Louis Park — Interactive Resume</p>
      </Reveal>

      <Reveal delay={80}>
        <h1 className="mt-8 max-w-5xl text-[2.1rem] leading-[1.05] sm:text-5xl lg:text-6xl xl:text-7xl">
          {HEADLINE}
        </h1>
      </Reveal>

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
    </section>
  );
}

function SectionHead({ index, title }: { index: string; title: string }) {
  return (
    <Reveal className="mb-14 flex items-baseline gap-6 border-b border-border pb-6">
      <span className="eyebrow">{index}</span>
      <h2 className="text-3xl sm:text-4xl">{title}</h2>
    </Reveal>
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
            <Reveal key={m.value + i} delay={(i % 3) * 70} className="bg-card">
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
                <span className="numeral text-5xl lg:text-6xl">
                  <AnimatedNumber
                    {...m.number}
                    delay={i * 80}
                  />
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

function FunnelSection() {
  return (
    <section id="funnel" className={cn(shell, "pt-24 pb-16 lg:pt-32")}>
      <SectionHead index="02" title="The Funnel" />
      <Funnel />
    </section>
  );
}

function ForCompany() {
  return (
    <section id="for-company" className={cn(shell, "py-24 lg:py-32")}>
      <SectionHead index="04" title={`For ${company.companyName}`} />

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
                <span className="text-sm leading-relaxed text-muted-foreground">
                  {o}
                </span>
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
                <span className="text-sm leading-relaxed text-muted-foreground">
                  {o}
                </span>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function StackLogo({ tool }: { tool: StackTool }) {
  const hex = `#${tool.brandHex ?? "77736D"}`;

  if (!tool.slug) {
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
    <img
      src={`https://cdn.simpleicons.org/${tool.slug}/${tool.brandHex}`}
      alt={tool.name}
      className="block h-10 w-auto shrink-0 object-contain"
      loading="lazy"
    />
  );
}

function Stack() {
  let toolIndex = 0;

  return (
    <section
      id="stack"
      className={cn(shell, "stack-section relative overflow-hidden border-y border-border py-16 lg:py-20")}
    >
      <Reveal className="stack-sweep" aria-hidden>
        <span className="stack-sweep-line" />
      </Reveal>
      <div className="stack-grid" aria-hidden />
      <div className="relative">
        <Reveal className="mb-10 flex items-baseline gap-6 border-b border-border pb-4">
          <span className="eyebrow">03</span>
          <h2 className="text-3xl sm:text-4xl">Stack</h2>
        </Reveal>
        <div className="flex flex-wrap justify-center gap-y-10">
          {STACK_GROUPS.map((group, gi) => (
            <div
              key={group.label}
              className={cn(
                "flex flex-auto basis-1/2 flex-col items-center px-4 sm:basis-auto sm:px-6 lg:px-7",
                gi > 0 && "sm:border-l sm:border-border",
              )}
            >
              <p className="eyebrow text-xs">{group.label}</p>
              <div className="mt-6 flex flex-nowrap items-start gap-x-4">
                {group.tools.map((tool) => {
                  const delay = toolIndex * 60;
                  toolIndex += 1;
                  return (
                    <Reveal key={tool.name} delay={delay}>
                      <div
                        className="stack-tool relative flex w-[68px] flex-col items-center gap-2"
                        style={{ "--brand": `#${tool.brandHex ?? "77736D"}` } as React.CSSProperties}
                      >
                        <StackLogo tool={tool} />
                        <span className="text-center text-[0.6875rem] leading-tight text-muted-foreground">
                          {tool.name}
                        </span>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const links = [
    { label: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
    { label: "LinkedIn", value: "linkedin.com/in/", href: CONTACT.linkedin },
    { label: "Resume", value: "Download PDF", href: RESUME_PDF_URL },
  ];

  return (
    <section
      id="contact"
      className={cn(shell, "border-t border-border py-24 lg:py-32")}
    >
      <Reveal>
        <h2 className="text-4xl sm:text-5xl">Let&apos;s talk.</h2>
      </Reveal>

      <div className="mt-14 grid gap-px border border-border bg-border sm:grid-cols-3">
        {links.map((l, i) => (
          <Reveal key={l.label} delay={i * 70} className="bg-card">
            <a
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer noopener"
              className="flex h-full flex-col gap-3 p-8 transition-colors hover:bg-secondary"
            >
              <span className="eyebrow">{l.label}</span>
              <span className="flex items-center gap-2 text-base break-all">
                {l.value}
                <ArrowUpRight className="size-4 shrink-0 text-primary" aria-hidden />
              </span>
            </a>
          </Reveal>
        ))}
      </div>

      <p className="mt-16 text-xs text-muted-foreground">
        © {new Date().getFullYear()} Louis Park
      </p>
    </section>
  );
}
