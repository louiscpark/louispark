import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { SECTIONS } from "@/content/resume";

export function SideNav() {
  const [active, setActive] = useState<string>(SECTIONS[0]?.id ?? "intro");

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      Boolean,
    ) as HTMLElement[];

    const onScroll = () => {
      const mark = window.scrollY + window.innerHeight * 0.35;
      let current = els[0]?.id ?? "";
      for (const el of els) if (el.offsetTop <= mark) current = el.id;
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Mobile: slim top bar */}
      <nav
        aria-label="Section navigation"
        className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/90 backdrop-blur-sm lg:hidden"
      >
        <div className="flex items-center gap-4 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <span className="shrink-0 font-display text-base">Louis Park</span>
          <span className="h-4 w-px shrink-0 bg-border" />
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={cn(
                "shrink-0 text-xs tracking-wide whitespace-nowrap text-muted-foreground transition-colors",
                active === s.id && "text-primary",
              )}
            >
              {s.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Desktop: sticky left sidebar */}
      <nav
        aria-label="Section navigation"
        className="fixed top-0 left-0 z-40 hidden h-screen w-64 flex-col justify-between border-r border-border px-8 py-12 lg:flex xl:w-72"
      >
        <div>
          <a href="#intro" className="font-display text-2xl">
            Louis Park
          </a>
          <p className="eyebrow mt-2">Marketing / Strategy</p>
        </div>

        <ul className="space-y-3.5">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={cn(
                  "group flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground",
                  active === s.id && "text-foreground",
                )}
              >
                <span
                  className={cn(
                    "h-px bg-border transition-all",
                    active === s.id ? "w-6 bg-primary" : "w-3",
                  )}
                />
                {s.label}
              </a>
            </li>
          ))}
        </ul>

        <p className="text-xs text-muted-foreground">
          Real estate / proptech
          <br />
          Orange County · LA · Bay Area
        </p>
      </nav>
    </>
  );
}
