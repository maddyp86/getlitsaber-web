"use client";

import { useRef, useEffect } from "react";

export default function ChargingAnimation() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!barRef.current) return;
        const segs = barRef.current.querySelectorAll<HTMLElement>(".seg");
        segs.forEach((seg) => {
          seg.style.animationPlayState = entry.isIntersecting ? "running" : "paused";
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(bar);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      className="charging-bar grid gap-1 rounded p-[10px]"
      style={{
        gridTemplateColumns: "repeat(5, 1fr)",
        background: "rgba(0,0,0,0.5)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "4px",
      }}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <div
          key={n}
          className={`seg seg-${n} h-12 sm:h-14 md:h-16`}
        />
      ))}
    </div>
  );
}
