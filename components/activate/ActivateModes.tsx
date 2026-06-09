"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { SECTION_IDS, ACTIVATE_MODES, MODE_ORDER, type ModeId } from "@/content/activate.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Bold the lead phrase before the first colon (e.g. "To enter:") or the first
// explicit emphasis pattern used in the content ("The longer...", "Single-click...").
const BOLD_LEAD_RE = /^([^:]+:\s*)/;

function renderPoint(text: string) {
  const match = text.match(BOLD_LEAD_RE);
  if (match) {
    return (
      <>
        <strong className="font-semibold text-text-primary">{match[0]}</strong>
        {text.slice(match[0].length)}
      </>
    );
  }
  return text;
}

const BADGE_STYLES: Record<string, string> = {
  magenta: "border-accent-magenta text-accent-magenta",
  cyan:    "border-accent-cyan text-accent-cyan",
};

export default function ActivateModes() {
  const prefersReduced = useReducedMotion();
  const [activeMode, setActiveMode] = useState<ModeId>(MODE_ORDER[0]);

  const { eyebrow, title, intro, tabs, modes } = ACTIVATE_MODES;
  const mode = modes[activeMode];

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const idx = MODE_ORDER.indexOf(activeMode);
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        setActiveMode(MODE_ORDER[(idx + 1) % MODE_ORDER.length]);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setActiveMode(MODE_ORDER[(idx - 1 + MODE_ORDER.length) % MODE_ORDER.length]);
      }
    },
    [activeMode]
  );

  return (
    <section
      id={SECTION_IDS.modes}
      className="scroll-mt-[146px] py-section-y-mobile lg:py-section-y bg-[#000000]"
    >
      <div className="mx-auto w-full max-w-content px-content">

        {/* Section header */}
        <motion.p
          className="font-label text-eyebrow text-center uppercase text-accent-cyan mb-2"
          initial={prefersReduced ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {eyebrow}
        </motion.p>

        <motion.h2
          className="font-display font-bold uppercase leading-[1.1] text-center  text-white mb-2"
          style={{ fontSize: "clamp(34px, 7vw, 75px)",
                  textShadow: "0 0 50px rgba(255, 255, 255, 0.50)"}}
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.05, ease: EASE }}
        >
          {title}
        </motion.h2>

        <motion.p
          className="font-body text-body-sm text-center lg:text-body text-text-secondary leading-relaxed md:mb-16 mb-10 max-w-content"
          initial={prefersReduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
        >
          {intro}
        </motion.p>

        {/* Three-way toggle */}
        <motion.div
          role="tablist"
          aria-label="Light modes"
          onKeyDown={handleKeyDown}
          className="flex flex-nowrap items-center justify-between gap-6 sm:gap-6 md:gap-16 md:mb-16 mb-10 max-w-full"
          initial={prefersReduced ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
        >
          {tabs.map((tab) => {
            const isActive = activeMode === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`mode-panel-${tab.id}`}
                id={`mode-tab-${tab.id}`}
                onClick={() => setActiveMode(tab.id)}
                className={[
            "flex-1 min-w-0 text-center whitespace-nowrap px-3 py-4 sm:px-4 md:px-5 font-label text-[12px] sm:text-body-sm md:text-body uppercase transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary",
                  isActive
                    ? "border border-accent-cyan text-accent-cyan bg-[rgba(0,229,255,0.08)]"
                    : "border border-transparent text-text-muted hover:text-text-secondary",
                ].join(" ")}
              >
                {tab.label}
              </button>
            );
          })}
        </motion.div>

        {/* Mode panel — AnimatePresence key-swap for fade+slide transition */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeMode}
            id={`mode-panel-${activeMode}`}
            role="tabpanel"
            aria-labelledby={`mode-tab-${activeMode}`}
            initial={prefersReduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="flex flex-col lg:flex-row lg:items-start lg:gap-16"
          >
            {/* Text column */}
            <div className="flex-1 min-w-0 flex flex-col gap-6">

              {/* Mode name + badge */}
              <div className="flex flex-wrap items-center justify between gap-3">
                <h3
                  className="font-subhead font-bold uppercase text-white leading-none"
                  style={{ fontSize: "clamp(24px, 3vw, 38px)" }}
                >
                  {mode.name}
                </h3>
                <span
                  className={[
                    "border px-3 py-1 font-label text-[10px] tracking-[0.15em] uppercase shrink-0",
                    BADGE_STYLES[mode.badgeColor],
                  ].join(" ")}
                >
                  {mode.badge}
                </span>
              </div>

              {/* Tagline */}
              <p className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed -mt-2">
                {mode.tagline}
              </p>

              {/* Bullet points */}
              <ul className="flex flex-col gap-4" aria-label={`${mode.name} details`}>
                {mode.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    {/* Cyan triangle marker */}
                    <span
                      aria-hidden="true"
                      className="mt-[5px] shrink-0 text-accent-cyan"
                      style={{ fontSize: "10px", lineHeight: 1 }}
                    >
                      &#9654;
                    </span>
                    <p className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed">
                      {renderPoint(point)}
                    </p>
                  </li>
                ))}
              </ul>

              {/* Callout — only when non-null, magenta left-accent border */}
              {mode.callout && (
                <div className="rounded-md border-l-2 border-l-accent-magenta border border-[rgba(255,0,229,0.15)] bg-surface-card px-5 py-4">
                  <p className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed">
                    {mode.callout}
                  </p>
                </div>
              )}

            </div>

            {/* Media column — right on desktop, below text on mobile */}
            <div  className="mt-12 flex min-h-[400px] lg:min-h-[600px] flex-col lg:mt-0 lg:w-[380px] xl:w-[440px] shrink-0">
              {mode.media.src ? (
                <video
                  src={mode.media.src}
                  poster={mode.media.poster ?? undefined}
                  aria-label={mode.media.alt}
                  muted
                  autoPlay
                  loop
                  playsInline
                  className="w-full rounded-card object-cover"
                />
              ) : (
                   <div className="w-full flex-1 rounded-card border border-border-pill bg-[#000000] flex flex-col items-center justify-center gap-3">
                  <span className="font-label text-eyebrow tracking-[0.12em] uppercase text-text-muted">
                    media pending hosting
                  </span>
                </div>
              )}
            </div>

          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}