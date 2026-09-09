import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * Layered cut-out portraits, largest in front, each offset in scale and height
 * so they overlap rather than sit in a grid. Files are optional: any that is
 * not in public/ removes itself on the image's error event, so the hero works
 * with three, one, or none of them present.
 */
const LAYERS = [
  { src: "/portrait-1.png", position: "right-0 bottom-0 w-[80%]", z: "z-30" },
  { src: "/portrait-2.png", position: "right-[30%] bottom-[10%] w-[56%]", z: "z-20" },
  { src: "/portrait-3.png", position: "right-[6%] bottom-[22%] w-[44%]", z: "z-10" },
];

/** How far the stack lags the page: scrolling 1px moves it up 0.85px. */
const LAG = 0.15;

export function HeroPortraits() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [missing, setMissing] = useState<string[]>([]);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;

    const apply = () => {
      raf = 0;
      const y = window.scrollY;
      // the hero is one viewport tall; past it the transform is off-screen anyway
      if (y > window.innerHeight * 1.5) return;
      el.style.transform = `translate3d(0, ${(y * LAG).toFixed(2)}px, 0)`;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  const present = LAYERS.filter((l) => !missing.includes(l.src));
  if (present.length === 0) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "pointer-events-none absolute inset-y-0 right-0 z-0 w-full",
        // below lg the stack drops behind the copy as a faint ground; the
        // headline keeps its full contrast either way
        "opacity-15",
        "lg:w-[42%] lg:opacity-90",
      )}
    >
      {present.map((layer, i) => (
        <img
          key={layer.src}
          src={layer.src}
          // the first portrait carries the identity; the rest are echoes of it
          alt={i === 0 ? "Louis Park" : ""}
          onError={() => setMissing((m) => (m.includes(layer.src) ? m : [...m, layer.src]))}
          loading="lazy"
          decoding="async"
          className={cn("hero-portrait absolute h-auto object-contain", layer.position, layer.z)}
        />
      ))}
    </div>
  );
}
