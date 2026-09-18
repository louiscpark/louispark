import type Lenis from "lenis";

/**
 * The page's single Lenis instance, held at module scope so anything that
 * needs to drive the scroll (anchor links, in particular) can reach it
 * without threading context through the tree. Null whenever smooth scrolling
 * is off — reduced motion, or before mount.
 */
let instance: Lenis | null = null;

export const getLenis = () => instance;
export const setLenis = (next: Lenis | null) => {
  instance = next;
};

type FrameCallback = () => void;

const frameCallbacks = new Set<FrameCallback>();

/**
 * Runs a callback once per animation frame, on the same RAF the page is
 * already driven by. Anything reading scroll position — the tracing beam —
 * rides this rather than adding a scroll listener of its own: Lenis
 * interpolates between native scroll events, so a listener would sample a
 * position the page has already moved past.
 *
 * Returns an unsubscribe. Nothing ticks under prefers-reduced-motion, where
 * Lenis never mounts; callers are expected to render a resting state there.
 */
export const onFrame = (callback: FrameCallback) => {
  frameCallbacks.add(callback);
  return () => {
    frameCallbacks.delete(callback);
  };
};

/** Called by the RAF loop in <SmoothScroll>, after Lenis has advanced. */
export const emitFrame = () => {
  for (const callback of frameCallbacks) callback();
};
