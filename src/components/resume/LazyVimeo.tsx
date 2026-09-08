import { useState } from "react";
import { Play } from "lucide-react";
import { VIMEO_META } from "@/content/vimeo-posters.generated";
import { cn } from "@/lib/utils";

export type LazyVimeoProps = {
  vimeoId: string;
  title: string;
  /** Overrides the poster resolved at build time by scripts/fetch-vimeo-posters.mjs. */
  posterSrc?: string;
  /** Describes the poster frame. Falls back to a sentence built from the title. */
  posterAlt?: string;
  caption?: string;
  className?: string;
};

/**
 * Lazy Vimeo facade: no iframe (and no third-party script) until the user
 * clicks play. At rest it is a cover-fit poster under a soft dark scrim, a
 * solid play control, and the title bottom-left. With no poster — the build
 * could not resolve one — it falls back to a flat neutral surface.
 *
 * The frame follows the video's own shape, resolved at build time: 16:9 for
 * landscape, 9:16 for portrait, so a vertical ad is never letterboxed. Portrait
 * frames are capped in height above 640px so they do not run away with the
 * column; on a phone they take the full column width.
 */
export function LazyVimeo({
  vimeoId,
  title,
  posterSrc,
  posterAlt,
  caption,
  className,
}: LazyVimeoProps) {
  const [playing, setPlaying] = useState(false);

  const meta = VIMEO_META[vimeoId];
  const poster = posterSrc ?? meta?.poster;
  // Anything we could not measure is treated as landscape.
  const portrait = (meta?.aspectRatio ?? 16 / 9) < 1;
  const embedSrc = `https://player.vimeo.com/video/${vimeoId}?title=0&byline=0&portrait=0&dnt=1&autoplay=1`;

  return (
    <figure className={cn("w-full", className)}>
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-sm border border-border bg-muted",
          portrait ? "aspect-[9/16] sm:mx-auto sm:h-[520px] sm:w-auto" : "aspect-video",
        )}
      >
        {playing ? (
          <iframe
            src={embedSrc}
            title={title}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="size-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play video: ${title}`}
            data-poster={poster ? "true" : "false"}
            className="lazy-vimeo-trigger absolute inset-0 size-full"
          >
            {poster ? (
              <>
                <img
                  src={poster}
                  alt={posterAlt ?? `Opening frame of the ${title} video`}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 size-full object-cover"
                />
                <span className="lazy-vimeo-scrim absolute inset-0" aria-hidden />
              </>
            ) : null}

            <span className="lazy-vimeo-play absolute top-1/2 left-1/2 flex size-14 items-center justify-center rounded-full bg-background">
              <Play className="size-5 translate-x-px text-foreground" aria-hidden />
            </span>

            <span className="lazy-vimeo-title absolute bottom-0 left-0 max-w-[80%] p-4 text-left text-sm tracking-wide">
              {title}
            </span>
          </button>
        )}
      </div>
      {caption ? (
        <figcaption className="mt-3 text-xs text-muted-foreground">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
