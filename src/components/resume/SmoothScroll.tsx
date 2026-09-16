import { useEffect } from "react";
import Lenis from "lenis";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { getLenis, setLenis } from "@/lib/lenis";

/** Header height to clear when jumping to an anchor, matching scroll-padding-top. */
const ANCHOR_OFFSET = -80;

/**
 * Drives the page with Lenis. Renders nothing.
 *
 * Also routes every same-page hash link through lenis.scrollTo() via one
 * delegated listener, rather than patching each link: a native anchor jump
 * moves the browser instantly while Lenis is mid-interpolation, and the two
 * fight. That covers the sidebar nav, the hero button and the scroll cue.
 *
 * Under prefers-reduced-motion none of this mounts — the page keeps native
 * scrolling and native anchor jumps.
 */
export function SmoothScroll() {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({ smoothWheel: true });
    setLenis(lenis);

    let raf = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onClick = (event: MouseEvent) => {
      // let the browser handle modified clicks and anything not a plain left click
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const link = (event.target as HTMLElement | null)?.closest?.("a");
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#") || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      getLenis()?.scrollTo(target as HTMLElement, { offset: ANCHOR_OFFSET });
      history.pushState(null, "", href);
    };

    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, [reduced]);

  return null;
}
