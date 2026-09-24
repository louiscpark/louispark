import { useEffect, useRef, useState } from "react";
import type { InternalApp } from "@/content/resume";
import { PHASE } from "@/lib/phase";
import { cn } from "@/lib/utils";

/**
 * Tool screenshot at 16:10. A file that is not in public/ yet takes the slot
 * out of the card altogether: an empty grey box reads as something that failed
 * to load, and says less than saying nothing.
 */
function Screenshot({ src, alt }: { src: string; alt: string }) {
  const img = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  // The tag is server rendered, so a missing file can 404 before React has
  // attached its handlers and the error event is missed. Settle from the
  // element itself on mount.
  useEffect(() => {
    const el = img.current;
    if (!el || !el.complete) return;
    if (el.naturalWidth > 0) setLoaded(true);
    else setFailed(true);
  }, []);

  if (failed) return null;

  return (
    // The frame is drawn only once the file has decoded. Until then the slot
    // takes no height, so a missing screenshot leaves no trace rather than a
    // grey box that later pops out of the layout.
    <div
      className={cn(
        "relative w-full overflow-hidden",
        loaded ? "mt-6 aspect-[16/10] rounded-sm border border-border bg-muted" : "h-0",
      )}
    >
      <img
        ref={img}
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        // eager on purpose: lazy defers the error until the card is scrolled
        // to, which is exactly when the empty frame would be seen
        decoding="async"
        className="size-full object-cover"
      />
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
