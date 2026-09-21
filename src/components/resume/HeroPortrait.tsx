import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { onFrame } from "@/lib/lenis";
import { cn } from "@/lib/utils";

const SRC = "/portrait.png";

/** How far the portrait lags the page: scrolling 1px moves it up 0.88px. */
const LAG = 0.12;

/** Pointer travel, in px, at the very edge of the hero. */
const PORTRAIT_SHIFT = 8;
const BLOOM_SHIFT = 16;

/**
 * The hero portrait, in three layers back to front: a soft phase-1 bloom, a
 * single arc that passes behind the shoulder and exits frame right, and the
 * portrait itself, unfiltered, at its natural saturation.
 *
 * The image file is optional. Nothing paints until it has actually loaded, and
 * an error removes the whole treatment — so a missing public/portrait.png
 * leaves the hero clean rather than showing a gap where a face should be.
 *
 * Depth comes from two independent transforms: the page's scroll moves the
 * portrait on the outer element with no transition, while the pointer moves
 * the inner image and the bloom the opposite way, on a 400ms settle. The two
 * are split so the eased pointer response never lags the scroll.
 */
export function HeroPortrait() {
  const host = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const portrait = useRef<HTMLImageElement>(null);
  const bloom = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  // The image is in the server-rendered HTML, so a cached file can finish
  // loading before React attaches its handlers and the load event is missed.
  // Settle the state from the element itself on mount.
  useEffect(() => {
    const img = portrait.current;
    if (!img || !img.complete) return;
    if (img.naturalWidth > 0) setLoaded(true);
    else setFailed(true);
  }, []);

  // Scroll parallax. Rides the page's existing RAF rather than a scroll
  // listener; under reduced motion that loop never runs and this never binds.
  useEffect(() => {
    if (reduced || !loaded) return;
    const el = scroller.current;
    if (!el) return;

    return onFrame(() => {
      const y = window.scrollY;
      // the hero is one viewport tall; past it the transform is off-screen
      if (y > window.innerHeight * 1.5) return;
      el.style.transform = `translate3d(0, ${(y * LAG).toFixed(2)}px, 0)`;
    });
  }, [reduced, loaded]);

  // Pointer parallax, bound to the hero section so the portrait answers
  // movement anywhere in it rather than only over the image.
  useEffect(() => {
    if (reduced || !loaded) return;
    const hero = host.current?.closest("section");
    const img = portrait.current;
    const glow = bloom.current;
    if (!hero || !img || !glow) return;

    // below lg the portrait is a flat background wash, so it does not track
    const mq = window.matchMedia("(min-width: 1024px)");

    const onMove = (event: PointerEvent) => {
      if (!mq.matches) return;
      const box = hero.getBoundingClientRect();
      // -1 .. 1 from the centre of the hero
      const nx = ((event.clientX - box.left) / box.width) * 2 - 1;
      const ny = ((event.clientY - box.top) / box.height) * 2 - 1;
      img.style.transform = `translate3d(${(nx * PORTRAIT_SHIFT).toFixed(2)}px, ${(ny * PORTRAIT_SHIFT).toFixed(2)}px, 0)`;
      glow.style.transform = `translate3d(${(-nx * BLOOM_SHIFT).toFixed(2)}px, ${(-ny * BLOOM_SHIFT).toFixed(2)}px, 0)`;
    };

    const onLeave = () => {
      img.style.transform = "";
      glow.style.transform = "";
    };

    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerleave", onLeave);
    return () => {
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced, loaded]);

  if (failed) return null;

  return (
    <div
      ref={host}
      aria-hidden={!loaded}
      className={cn(
        "pointer-events-none absolute inset-y-0 right-0 z-0 w-full transition-opacity duration-700",
        "lg:w-[38%]",
        // under lg the portrait drops behind the copy as a faint ground and
        // the bloom and arc sit out, so the headline keeps a quiet backdrop
        loaded ? "opacity-[0.12] lg:opacity-100" : "opacity-0",
      )}
    >
      {/* (a) bloom — offset up and left of the subject */}
      <div
        ref={bloom}
        className="hero-bloom absolute left-[-14%] top-[6%] hidden size-[92%] lg:block"
        aria-hidden
      />

      {/* (b) one arc, passing behind the shoulder and leaving frame right */}
      <svg
        viewBox="0 0 280 280"
        className="hero-arc absolute right-[-72px] top-[26%] hidden size-[280px] lg:block"
        aria-hidden
      >
        <circle cx="140" cy="140" r="139" />
      </svg>

      {/* (c) the portrait, full colour, melting out at the bottom */}
      <div ref={scroller} className="absolute inset-0">
        <img
          ref={portrait}
          src={SRC}
          alt="Louis Park"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          decoding="async"
          className="hero-portrait absolute bottom-0 right-0 h-auto max-h-full w-full object-contain object-bottom"
        />
      </div>
    </div>
  );
}
