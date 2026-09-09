import { useState } from "react";
import type { CaseStudy as CaseStudyContent } from "@/content/resume";
import { cn } from "@/lib/utils";

/**
 * One before/after image. A file that is not in public/ yet resolves to a
 * neutral labelled box rather than a broken image.
 */
function CaseImage({ src, caption, alt }: { src: string; caption: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <figure className="min-w-0">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm border border-border bg-muted">
        {failed ? (
          <span className="flex size-full items-center justify-center text-[0.625rem] tracking-[0.18em] text-muted-foreground uppercase">
            {caption}
          </span>
        ) : (
          <img
            src={src}
            alt={alt}
            onError={() => setFailed(true)}
            loading="lazy"
            decoding="async"
            className="size-full object-cover"
          />
        )}
      </div>
      <figcaption className="eyebrow mt-2 text-[0.625rem]">{caption}</figcaption>
    </figure>
  );
}

/**
 * Compact deal card: a before/after pair, the money rows, and the delta.
 * Reusable — hand it a different set of images and stats for another deal on
 * any step. `tone` is the phase colour of the step it sits in.
 */
export function CaseStudy({
  study,
  tone,
  className,
}: {
  study: CaseStudyContent;
  tone?: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-sm border border-border bg-card p-5 sm:p-6", className)}>
      <p className="eyebrow text-[0.625rem]" style={tone ? { color: tone } : undefined}>
        {study.label}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <CaseImage src={study.beforeSrc} caption="Before" alt={study.beforeAlt} />
        <CaseImage src={study.afterSrc} caption="After" alt={study.afterAlt} />
      </div>

      <dl className="mt-6">
        {study.stats.map((stat, i) => (
          <div
            key={stat.label}
            className={cn(
              "flex items-baseline justify-between gap-4 py-2.5",
              i > 0 && "border-t border-border",
            )}
          >
            <dt className="text-sm text-muted-foreground">{stat.label}</dt>
            <dd className="numeral text-base">{stat.value}</dd>
          </div>
        ))}

        <div className="mt-1 flex items-baseline justify-between gap-4 border-t border-border pt-4">
          <dt className="eyebrow text-[0.625rem]">{study.highlight.label}</dt>
          <dd className="numeral text-2xl text-primary sm:text-[1.75rem]">
            {study.highlight.value}
          </dd>
        </div>
      </dl>

      <p className="mt-5 text-xs leading-relaxed text-muted-foreground">{study.context}</p>
    </div>
  );
}
