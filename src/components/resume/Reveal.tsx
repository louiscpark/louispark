import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Reveal({
  children,
  className,
  delay = 0,
  shift,
  duration,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** travel in px; defaults to the 18px house value */
  shift?: number;
  /** ms; defaults to the 700ms house value */
  duration?: number;
  as?: "div" | "section" | "li" | "article";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      data-visible={visible}
      style={
        {
          "--reveal-delay": `${delay}ms`,
          ...(shift === undefined ? {} : { "--reveal-shift": `${shift}px` }),
          ...(duration === undefined ? {} : { "--reveal-duration": `${duration}ms` }),
        } as React.CSSProperties
      }
      className={cn("reveal", className)}
    >
      {children}
    </Tag>
  );
}
