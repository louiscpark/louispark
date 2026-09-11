import { useState } from "react";
import type { InternalApp } from "@/content/resume";
import { PHASE } from "@/lib/phase";
import { cn } from "@/lib/utils";

/**
 * Tool screenshot at 16:10. A file that is not in public/ yet resolves to a
 * neutral box carrying the tool name, never a broken image.
 */
function Screenshot({ src, alt, name }: { src: string; alt: string; name: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative mt-6 aspect-[16/10] w-full overflow-hidden rounded-sm border border-border bg-muted">
      {failed ? (
        <span className="flex size-full items-center justify-center px-4 text-center text-[0.625rem] tracking-[0.18em] text-muted-foreground uppercase">
          {name}
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
  );
}

/**
 * One internal tool. Reusable — the section renders whatever is in
 * INTERNAL_APPS, so another tool is a content change only.
 *
 * A tool in development is deliberately unfinished rather than broken: held
 * back to 60% behind a dashed rule, with no screenshot and no capabilities.
 */
export function AppCard({ app }: { app: InternalApp }) {
  const building = app.status === "in-development";
  const tone = app.tone ? PHASE[app.tone] : undefined;

  return (
    <article
      className={cn(
        "app-card relative flex h-full flex-col rounded-sm border border-border bg-card p-6 lg:p-7",
        building && "border-dashed opacity-60",
      )}
    >
      {/* phase tint laid over the hairline, so no colour function is needed */}
      {tone && !building ? (
        <span
          className="app-card-tint"
          style={{ "--tone": tone } as React.CSSProperties}
          aria-hidden
        />
      ) : null}

      <p className="eyebrow text-[0.625rem]" style={tone ? { color: tone } : undefined}>
        {building ? "In development" : "Shipped"}
      </p>

      <h3 className="mt-4 font-display text-2xl leading-snug">{app.name}</h3>

      {/* muted before, full-contrast after — the jump is what carries the story */}
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{app.problem}</p>
      <p className="mt-2 text-sm leading-relaxed text-foreground">{app.solution}</p>

      {app.screenshotSrc && !building ? (
        <Screenshot
          src={app.screenshotSrc}
          alt={app.screenshotAlt ?? `Interface of the ${app.name} tool.`}
          name={app.name}
        />
      ) : null}

      {app.bullets && !building ? (
        <ul className="mt-6 space-y-3">
          {app.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-3">
              <span
                className="mt-2 h-px w-4 shrink-0"
                style={{ backgroundColor: tone ?? "var(--border)" }}
                aria-hidden
              />
              <span className="text-xs leading-relaxed text-muted-foreground">{bullet}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
