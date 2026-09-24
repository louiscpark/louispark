import { Reveal } from "@/components/resume/Reveal";
import { RevealText } from "@/components/resume/RevealText";
import { RoiSection } from "@/components/resume/RoiCalculator";
import type { Company } from "@/content/companies";
import { cn } from "@/lib/utils";

const shell = "px-6 md:px-12 lg:px-16 xl:px-24";

/**
 * The per-company pitch: one hook, three observations, a first-90-days plan.
 *
 * Deliberately not on the index route. Its copy is written for one employer at
 * a time, so on the shared page it would either read as a stranger's pitch or,
 * worse, publish the [PLACEHOLDER] scaffolding. Mount it on a route that has
 * real company data and pass that data in.
 */
export function ForCompany({ company, index = "06" }: { company: Company; index?: string }) {
  return (
    <section id="for-company" className={cn(shell, "py-24 lg:py-32")}>
      <div className="mb-14 flex items-baseline gap-6 border-b border-border pb-6">
        <Reveal>
          <span className="eyebrow">{index}</span>
        </Reveal>
        <RevealText
          as="h2"
          text={`For ${company.companyName}`}
          duration={800}
          lineStagger={90}
          className="text-3xl sm:text-4xl"
        />
      </div>

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

      {/* no roi block on the company, no calculator */}
      {company.roi ? <RoiSection roi={company.roi} companyName={company.companyName} /> : null}
    </section>
  );
}
