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
