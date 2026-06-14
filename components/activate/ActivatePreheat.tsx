"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SECTION_IDS, ACTIVATE_PREHEAT } from "./activate.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function ActivatePreheat() {
  const prefersReduced = useReducedMotion();
  const { eyebrow, title, intro, cardLabel, cardBadge, bestFor, points, callout, media } =
    ACTIVATE_PREHEAT;

  return (
    <section
      id={SECTION_IDS.preheat}
      className="scroll-mt-[150px] py-section-y-mobile lg:py-section-y bg-[#0C0C18]"
    >
      <div className="mx-auto w-full max-w-content px-content">

        {/* Section header */}
        <motion.p
          className="font-label text-center text-eyebrow uppercase text-accent-cyan mb-2"
          initial={prefersReduced ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {eyebrow}
        </motion.p>

        <motion.h2
          className="font-display text-center font-bold uppercase leading-[1.1] text-white mb-2"
          style={{ fontSize: "clamp(45px, 6vw, 75px)" ,
                  textShadow: "0 0 50px rgba(255, 255, 255, 0.50)"}}
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.05, ease: EASE }}
        >
          {title}
        </motion.h2>

        <motion.p
              className="font-body text-center text-body-sm lg:text-body text-text-secondary mb-16 max-w-content mx-auto"
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
          <div className="flex flex-col justify-center items-start gap-8 flex-[1_0_0] self-stretch min-w-0">

           {/* Pre-heat block (no card chrome per Figma) */}
            <motion.div
              className="w-full flex flex-col gap-4"
              initial={prefersReduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
            >
              {/* Header: label + badge */}
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="font-subhead font-bold text-white leading-none"
                  style={{ fontSize: "clamp(25px, 3vw, 35px)" }}
                >
                  {cardLabel}
                </span>
                <span className="rounded-[4px] border border-accent-magenta text-accent-magenta px-3 py-1 font-label text-[12px] uppercase shrink-0">
                  {cardBadge}
                </span>
              </div>

              {/* Best for */}
              <p className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed">
                {bestFor}
              </p>

              {/* Points with divider lines between */}
              <ul className="flex flex-col mt-2" aria-label="Pre-heat instructions">
                {points.map((point, i) => (
                  <li
                    key={i}
               className="flex items-start gap-3 py-4 border-b border-[#113757] last:border-0"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[6px] shrink-0 text-accent-cyan"
                      style={{ fontSize: "12px", lineHeight: 1 }}
                    >
                      &#9654;
                    </span>
                    <p
                      className={[
                        "font-body text-body-sm lg:text-body leading-relaxed",
                        point.emphasis
                          ? "text-text-primary font-semibold"
                          : "text-text-secondary",
                      ].join(" ")}
                    >
                      {point.text}
                    </p>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Callout block */}
            <motion.div
              className="border-l-4 border-accent-cyan bg-[#0E1023] px-5 py-4"
              initial={prefersReduced ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
            >
              <p className="font-body text-[16px] leading-[normal] text-[#CCC] font-normal">
                <span className="text-accent-cyan font-bold">{callout.lead} </span>
                {callout.body}
              </p>
            </motion.div>

          </div>

          {/* Media column */}
          <motion.div
className="mt-12 flex min-h-[400px] lg:min-h-[600px] flex-col lg:mt-0 lg:w-[380px] xl:w-[440px] shrink-0"
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
                controls
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
          </motion.div>

        </div>
      </div>
    </section>
  );
}
