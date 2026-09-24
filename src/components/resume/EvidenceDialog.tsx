import { useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DocumentViewer } from "@/components/resume/DocumentViewer";
import { LazyVimeo } from "@/components/resume/LazyVimeo";
import { getLenis } from "@/lib/lenis";
import type { Evidence } from "@/content/resume";

/** The artifact itself, in whatever form the evidence declares. */
function Artifact({ evidence, title }: { evidence: Evidence; title: string }) {
  if (evidence.type === "image") {
    return (
      <img
        src={evidence.src}
        alt={evidence.caption ?? title}
        className="h-auto w-full rounded-sm border border-border"
      />
    );
  }

  if (evidence.type === "video") {
    return <LazyVimeo vimeoId={evidence.src} title={evidence.caption ?? title} />;
  }

  if (evidence.type === "gallery") {
    // the flyer lightbox: thumbnails here, full page on click
    return <DocumentViewer pages={evidence.src} title={evidence.caption ?? title} />;
  }

  return (
    <a
      href={evidence.src}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 text-lg text-primary underline underline-offset-4"
    >
      {evidence.caption ?? evidence.src}
      <ArrowUpRight className="size-4" aria-hidden />
    </a>
  );
}

/**
 * The evidence behind one proof card: the figure, its label, the artifact, and
 * the line saying where the number came from.
 *
 * Focus trapping, ESC, click-outside and focus return are Radix's, so the
 * dialog behaves like every other one on the page. Lenis is paused while it is
 * open, otherwise a wheel over the overlay scrolls the page underneath.
 */
export function EvidenceDialog({
  open,
  onOpenChange,
  value,
  label,
  evidence,
  onCloseFocus,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  label: string;
  evidence: Evidence | undefined;
  /** Where focus goes on close. Runs instead of Radix's own restore. */
  onCloseFocus?: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    lenis?.stop();
    return () => lenis?.start();
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="evidence-dialog max-w-3xl"
        // Radix restores focus on unmount, which lands on the body here
        // because the card is only the trigger by convention, not by markup.
        // Take it over and hand focus back to the card that opened this.
        onCloseAutoFocus={(e) => {
          if (!onCloseFocus) return;
          e.preventDefault();
          onCloseFocus();
        }}
      >
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-normal">{value}</DialogTitle>
          <p className="text-sm text-muted-foreground">{label}</p>
        </DialogHeader>

        {evidence ? (
          <>
            <Artifact evidence={evidence} title={label} />

            {evidence.caption && evidence.type !== "link" ? (
              <p className="text-sm text-muted-foreground">{evidence.caption}</p>
            ) : null}

            <p className="border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
              <span className="eyebrow text-[0.625rem]">Source</span>{" "}
              <span className="ml-2">{evidence.source}</span>
            </p>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
