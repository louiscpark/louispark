import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Downward cue at the foot of the hero. It fades out for good once the reader
 * is 15% of a viewport down the page — past that point it has done its job, so
 * the scroll listener detaches and never re-arms.
 *
 * The anchor is a plain hash link, so it inherits the page's smooth scrolling
 * (and, under prefers-reduced-motion, the instant jump) without any script.
 */
export function ScrollCue({ href }: { href: string }) {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (gone) return;

    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.15) setGone(true);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [gone]);

  return (
    <a
      href={href}
      data-gone={gone}
      aria-label="Scroll to the next section"
      tabIndex={gone ? -1 : undefined}
      className="scroll-cue absolute bottom-10 left-1/2 flex size-10 items-center justify-center"
    >
      <ChevronDown className="scroll-cue-icon size-6" aria-hidden />
    </a>
  );
}
