import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export type DocumentViewerProps = {
  /** ordered page image paths */
  pages: string[];
  /** used for alt text: "<title> — page 2 of 4" */
  title: string;
};

export function DocumentViewer({ pages, title }: DocumentViewerProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastTrigger = useRef<number>(0);

  const close = useCallback(() => {
    setOpenIndex(null);
    triggerRefs.current[lastTrigger.current]?.focus();
  }, []);

  const step = useCallback(
    (dir: number) => {
      setOpenIndex((i) =>
        i === null ? i : (i + dir + pages.length) % pages.length,
      );
    },
    [pages.length],
  );

  useEffect(() => {
    if (openIndex === null) return;
    dialogRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        step(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        step(-1);
      } else if (e.key === "Tab") {
        // focus trap
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
          "button, [href], [tabindex]:not([tabindex='-1'])",
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0]!;
        const last = focusables[focusables.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [openIndex, close, step]);

  return (
    <>
      <div className="grid grid-cols-4 gap-3">
        {pages.map((src, i) => (
          <button
            key={src}
            type="button"
            ref={(el) => {
              triggerRefs.current[i] = el;
            }}
            onClick={() => {
              lastTrigger.current = i;
              setOpenIndex(i);
            }}
            className="doc-thumb overflow-hidden rounded-sm border border-border bg-muted"
            aria-label={`${title} — page ${i + 1} of ${pages.length}`}
          >
            <img
              src={src}
              alt={`${title} — page ${i + 1} of ${pages.length}`}
              loading="lazy"
              className="aspect-[3/4] w-full object-cover"
            />
          </button>
        ))}
      </div>

      {openIndex !== null ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            className="flex h-full max-h-[92vh] w-full max-w-4xl flex-col items-center gap-4 outline-none"
          >
            <div className="flex w-full items-center justify-between">
              <span className="eyebrow">{title}</span>
              <button
                type="button"
                onClick={close}
                aria-label="Close document viewer"
                className="flex size-9 items-center justify-center border border-border transition-colors hover:border-foreground"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>

            <div className="flex min-h-0 w-full flex-1 items-center gap-4">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous page"
                className="flex size-10 shrink-0 items-center justify-center border border-border transition-colors hover:border-foreground"
              >
                <ChevronLeft className="size-5" aria-hidden />
              </button>

              <img
                src={pages[openIndex]}
                alt={`${title} — page ${openIndex + 1} of ${pages.length}`}
                className="mx-auto h-full max-h-full w-auto max-w-full border border-border object-contain"
              />

              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next page"
                className="flex size-10 shrink-0 items-center justify-center border border-border transition-colors hover:border-foreground"
              >
                <ChevronRight className="size-5" aria-hidden />
              </button>
            </div>

            <p className="text-xs tracking-wide text-muted-foreground tabular-nums">
              {openIndex + 1} / {pages.length}
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
