"use client";

import { useEffect, useRef, useState } from "react";
import { ACTIVATE_SUBNAV, SECTION_IDS, type SectionId } from "@/content/activate.content";

// Navbar height from tokens: 90px. Sub-nav sits directly below it via sticky top.
const NAVBAR_HEIGHT = 90;

export default function ActivateSubNav() {
  const [activeId, setActiveId] = useState<SectionId>(SECTION_IDS.quickStart);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Track which section is in the upper viewport via IntersectionObserver.
  useEffect(() => {
    const sectionIds = ACTIVATE_SUBNAV.map((item) => item.id);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    // rootMargin: top offset = combined sticky bars height so detection starts
    // just below them; bottom cutoff trims away the lower portion so only
    // the topmost visible section triggers.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id as SectionId);
          }
        });
      },
      { rootMargin: `-${NAVBAR_HEIGHT + 60}px 0px -60% 0px`, threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Scroll the active pill into view inside the horizontal rail on mobile.
  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const activeEl = scrollContainerRef.current.querySelector(
      `[data-id="${activeId}"]`
    ) as HTMLElement | null;
    activeEl?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeId]);

  function handleClick(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div
      className="sticky z-sticky w-full bg-background-primary/95 backdrop-blur-sm border-b border-border-divider"
      style={{ top: NAVBAR_HEIGHT }}
    >
      {/* Horizontal scroll rail — no negative-margin breakout so sticky is not
          killed by an overflow-hidden ancestor. The container itself clips. */}
      <div
        ref={scrollContainerRef}
        className="flex flex-nowrap overflow-x-auto gap-1 px-content py-3 scrollbar-hide"
        style={{ WebkitOverflowScrolling: "touch" }}
        role="navigation"
        aria-label="Page sections"
      >
        {ACTIVATE_SUBNAV.map(({ id, label }) => {
          const isActive = activeId === id;
          return (
            <button
              key={id}
              data-id={id}
              onClick={() => handleClick(id)}
              className={[
                "shrink-0 rounded-pill px-4 py-1.5 font-label text-eyebrow tracking-[0.1em] uppercase transition-colors duration-200 whitespace-nowrap",
                isActive
                  ? "text-accent-cyan border border-accent-cyan bg-accent-cyan-alpha-10"
                  : "text-text-muted border border-transparent hover:text-text-secondary",
              ].join(" ")}
              aria-current={isActive ? "true" : undefined}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
