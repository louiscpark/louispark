import { useState } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

export type VideoFacadeProps = {
  vimeoId: string;
  posterSrc?: string;
  title: string;
  caption?: string;
  className?: string;
};

/**
 * Lazy Vimeo facade: no iframe (and no third-party script) until the user
 * clicks play. Poster + centered play control + title at rest.
 */
export function VideoFacade({
  vimeoId,
  posterSrc,
  title,
  caption,
  className,
}: VideoFacadeProps) {
  const [playing, setPlaying] = useState(false);

  const embedSrc = `https://player.vimeo.com/video/${vimeoId}?title=0&byline=0&portrait=0&dnt=1&autoplay=1`;

  return (
    <figure className={cn("w-full", className)}>
      <div className="relative aspect-video w-full overflow-hidden rounded-sm border border-border bg-muted">
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
            aria-label={`Play ${title}`}
            className="group absolute inset-0 flex size-full flex-col items-center justify-center gap-4"
          >
            {posterSrc ? (
              <img
                src={posterSrc}
                alt={title}
                loading="lazy"
                className="absolute inset-0 size-full object-cover"
              />
            ) : null}
            <span className="relative flex size-14 items-center justify-center rounded-full border border-foreground/30 bg-background/80 transition-colors group-hover:border-foreground">
              <Play className="size-5 translate-x-[1px] text-foreground" aria-hidden />
            </span>
            <span className="relative px-6 text-center text-sm tracking-wide text-foreground">
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
