import { PARTNERS } from "@/content/resume";

/**
 * Partner names on a single looping row. The list is rendered twice and the
 * track travels exactly -50%, so the second copy lands where the first began
 * and the loop has no seam. The duplicate is hidden from assistive tech.
 *
 * Pauses on hover. Under prefers-reduced-motion the track holds at its start
 * and the first few names simply sit there.
 */
export function PartnerMarquee() {
  return (
    <div className="marquee border-y border-border py-8">
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <ul key={copy} className="marquee-list" {...(copy === 1 ? { "aria-hidden": true } : {})}>
            {PARTNERS.map((partner) => (
              <li
                key={partner}
                className="marquee-item font-display text-3xl text-muted-foreground sm:text-4xl"
              >
                {partner}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
