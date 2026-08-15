import { ArrowUpRight, ImageIcon, PlayCircle } from "lucide-react";
import type { Proof } from "@/content/resume";

/**
 * Renders the small "proof" affordance under a metric, and the full asset
 * inside the lightbox. Types: image | video | link | none.
 */
export function ProofBadge({ proof }: { proof: Proof }) {
  if (proof.type === "none") return null;

  const Icon =
    proof.type === "image"
      ? ImageIcon
      : proof.type === "video"
        ? PlayCircle
        : ArrowUpRight;

  const text =
    proof.type === "image"
      ? "View proof"
      : proof.type === "video"
        ? "Watch proof"
        : "Open source";

  return (
    <span className="mt-6 inline-flex items-center gap-1.5 border-b border-primary/40 pb-0.5 text-xs tracking-wide text-primary">
      <Icon className="size-3.5" aria-hidden />
      {text}
    </span>
  );
}

export function ProofAsset({ proof }: { proof: Proof }) {
  if (proof.type === "image" && proof.src) {
    return (
      <img
        src={proof.src}
        alt={proof.caption ?? "Supporting proof"}
        className="h-auto w-full rounded-sm border border-border"
      />
    );
  }

  if (proof.type === "video" && proof.src) {
    return <VideoFrame src={proof.src} title={proof.caption ?? "Proof video"} />;
  }

  if (proof.type === "link" && proof.src) {
    return (
      <a
        href={proof.src}
        target="_blank"
        rel="noreferrer noopener"
        className="inline-flex items-center gap-2 text-lg text-primary underline underline-offset-4"
      >
        {proof.caption ?? proof.src}
        <ArrowUpRight className="size-4" aria-hidden />
      </a>
    );
  }

  return null;
}

/** 16:9 embed slot. Accepts YouTube / Vimeo / Loom URLs. */
export function VideoFrame({ src, title }: { src?: string | undefined; title: string }) {
  if (!src) {
    return (
      <div className="flex aspect-video w-full items-center justify-center border border-dashed border-border bg-muted/50">
        <span className="eyebrow">Video slot — add embed URL</span>
      </div>
    );
  }

  return (
    <div className="aspect-video w-full overflow-hidden border border-border bg-muted">
      <iframe
        src={toEmbedUrl(src)}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        className="size-full"
      />
    </div>
  );
}

function toEmbedUrl(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed${u.pathname}`;
    }
    if (u.hostname.includes("youtube.com") && u.searchParams.get("v")) {
      return `https://www.youtube.com/embed/${u.searchParams.get("v")}`;
    }
    if (u.hostname.includes("vimeo.com") && !u.pathname.startsWith("/video")) {
      return `https://player.vimeo.com/video${u.pathname}`;
    }
    if (u.hostname.includes("loom.com") && u.pathname.includes("/share/")) {
      return url.replace("/share/", "/embed/");
    }
    return url;
  } catch {
    return url;
  }
}
