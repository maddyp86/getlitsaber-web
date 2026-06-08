"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SECTION_IDS, ACTIVATE_PREHEAT } from "@/content/activate.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const BOLD_LEAD_RE = /^([^.]+\.\s*)/;

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

export default function ActivatePreheat() {
  const prefersReduced = useReducedMotion();
  const { eyebrow, title, intro, cardLabel, cardBadge, bestFor, points, callout, media } =
    ACTIVATE_PREHEAT;

  return (
    <section
      id={SECTION_IDS.preheat}
      className="scroll-mt-[146px] py-section-y-mobile lg:py-section-y bg-background-elevated"
    >
      <div className="mx-auto w-full max-w-content px-content">

        {/* Section header */}
        <motion.p
          className="font-label text-eyebrow tracking-[0.2em] uppercase text-accent-cyan mb-4"
          initial={prefersReduced ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {eyebrow}
        </motion.p>

        <motion.h2
          className="font-display font-bold uppercase leading-[1.05] text-white mb-6"
          style={{ fontSize: "clamp(32px, 4vw, 55px)" }}
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.05, ease: EASE }}
        >
          {title}
        </motion.h2>

        <motion.p
          className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed mb-10 max-w-[580px]"
          initial={prefersReduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
        >
          {intro}
        </motion.p>

        {/* Two-column: content left, media right */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-16">

          {/* Content column */}
          <div className="flex-1 min-w-0 flex flex-col gap-8">

            {/* Pre-heat card */}
            <motion.div
              className="rounded-card border border-[rgba(0,229,255,0.20)] bg-surface-card p-6 flex flex-col gap-4"
              initial={prefersReduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
            >
              {/* Card header: label + badge */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-label text-label tracking-[0.1em] uppercase text-text-primary font-semibold">
                  {cardLabel}
                </span>
                <span className="rounded-pill border border-accent-cyan text-accent-cyan bg-[rgba(0,229,255,0.08)] px-3 py-1 font-label text-[10px] tracking-[0.15em] uppercase shrink-0">
                  {cardBadge}
                </span>
              </div>

              {/* Best for */}
              <p className="font-body text-body-sm text-text-secondary leading-relaxed">
                {bestFor}
              </p>

              {/* Points */}
              <ul className="flex flex-col gap-3" aria-label="Pre-heat instructions">
                {points.map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-[5px] shrink-0 text-accent-cyan"
                      style={{ fontSize: "10px", lineHeight: 1 }}
                    >
                      &#9654;
                    </span>
                    <p className="font-body text-body-sm text-text-secondary leading-relaxed">
                      {renderPoint(point)}
                    </p>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Callout block */}
            <motion.div
              className="rounded-md border border-[rgba(0,229,255,0.15)] bg-surface-card px-5 py-4"
              initial={prefersReduced ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
            >
              <p className="font-body text-body-sm text-text-secondary leading-relaxed">
                {callout}
              </p>
            </motion.div>

          </div>

          {/* Media column */}
          <motion.div
            className="mt-12 lg:mt-0 lg:w-[380px] xl:w-[440px] shrink-0"
            initial={prefersReduced ? false : { opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.75, delay: 0.15, ease: EASE }}
          >
            {media.src ? (
              <video
                src={media.src}
                poster={media.poster ?? undefined}
                aria-label={media.alt}
                muted
                autoPlay
                loop
                playsInline
                className="w-full rounded-card object-cover"
              />
            ) : (
              <div className="w-full aspect-[9/16] rounded-card border border-border-pill bg-surface-card flex items-center justify-center">
                <span className="font-label text-eyebrow tracking-[0.12em] uppercase text-text-muted">
                  media pending hosting
                </span>
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
