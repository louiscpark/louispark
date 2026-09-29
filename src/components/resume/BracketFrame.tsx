import { cn } from "@/lib/utils";

/**
 * One corner mark, rotated into each of the four corners. The path draws the
 * top edge then the right edge, so it reads as a top-right corner at 0deg and
 * walks clockwise from there.
 */
const CORNERS = [
  { deg: 0, place: "top-0 right-0" },
  { deg: 90, place: "bottom-0 right-0" },
  { deg: 180, place: "bottom-0 left-0" },
  { deg: 270, place: "top-0 left-0" },
];

/**
 * Four corner brackets implying a frame, rather than a drawn box. Decorative:
 * the parent needs a positioning context, and nothing here is announced.
 */
export function BracketFrame({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
      {CORNERS.map(({ deg, place }) => (
        <svg
          key={deg}
          viewBox="0 0 11 11"
          width="11"
          height="11"
          className={cn("bracket-corner absolute", place)}
          style={{ transform: `rotate(${deg}deg)` }}
        >
          <path d="M0 0.5H10V10.5" />
        </svg>
      ))}
    </span>
  );
}
