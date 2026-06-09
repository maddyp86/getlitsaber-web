"use client";
import { useEffect, useRef, useState } from "react";
import { ACTIVATE_SUBNAV, SECTION_IDS, type SectionId } from "@/content/activate.content";

// Top offset = main navbar height so the sub-nav sticks directly beneath it.
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
    // just below them; bottom cutoff trims the lower portion so only the
    // topmost visible section triggers.
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

  // Scroll the active item into view inside the horizontal rail on mobile.
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
    // Full-bleed sticky bar. Solid #150C2D with cyan/20 top + bottom borders per Figma.
    <div
      className="sticky z-sticky w-full bg-[#150C2D] border-t border-b border-accent-cyan/20"
      style={{ top: NAVBAR_HEIGHT }}
    >
      {/* Inner rail: capped + padded on the SAME element. Centered on desktop
          (gap 35px); left-aligned horizontal scroll on mobile. overflow-x-auto
          lives on this child, not on a sticky ancestor, so sticky is safe. */}
      <div
        ref={scrollContainerRef}
        className="mx-auto flex h-[70px] max-w-content items-center justify-start gap-6 overflow-x-auto px-content scrollbar-hide md:justify-center md:gap-[35px]"
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
                "flex h-full shrink-0 items-center justify-center gap-[10px] whitespace-nowrap border-b-2 p-[10px] font-body text-[14px] font-semibold uppercase transition-colors duration-200",
                isActive
                  ? "border-accent-cyan text-accent-cyan"
                  : "border-transparent text-[#64748B] hover:text-text-secondary",
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