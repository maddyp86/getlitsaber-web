"use client";

import { Fragment } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SECTION_IDS, ACTIVATE_VOLTAGE } from "@/content/activate.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function ActivateVoltage() {
  const prefersReduced = useReducedMotion();
  const { eyebrow, title, intro, rows, media } = ACTIVATE_VOLTAGE;

  return (
    <section
      id={SECTION_IDS.voltage}
      className="scroll-mt-[146px] py-section-y-mobile lg:py-section-y bg-background-primary"
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
          className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed mb-10 max-w-[640px]"
          initial={prefersReduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
        >
          {intro}
        </motion.p>

        {/* Two-column: rows left, media right */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-16">

          {/* Voltage rows */}
          <motion.div
            className="flex-1 min-w-0 rounded-card border border-[rgba(255,255,255,0.08)] bg-surface-card overflow-hidden"
            initial={prefersReduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          >
            {rows.map((row, i) => (
              <Fragment key={row.voltage}>
                <div className="flex items-stretch gap-0">
                  {/* Colored left accent bar */}
                  <div
                    className="w-1 shrink-0 self-stretch"
                    style={{ backgroundColor: row.hex }}
                    aria-hidden="true"
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 px-6 py-5 flex-1">
                    {/* Voltage + color name */}
                    <div className="shrink-0 flex items-baseline gap-3 sm:w-[120px]">
                      <span
                        className="font-display font-bold leading-none tabular-nums"
                        style={{ fontSize: "clamp(28px, 3vw, 40px)", color: row.hex }}
                      >
                        {row.voltage}
                      </span>
                      <span
                        className="font-label text-[10px] tracking-[0.15em] uppercase font-bold"
                        style={{ color: row.hex }}
                      >
                        {row.colorName}
                      </span>
                    </div>
                    {/* Oils + body */}
                    <div className="flex flex-col gap-1">
                      <span className="font-label text-body-sm tracking-[0.05em] uppercase text-text-primary font-semibold">
                        {row.oils}
                      </span>
                      <span className="font-body text-body-sm text-text-secondary leading-relaxed">
                        {row.body}
                      </span>
                    </div>
                  </div>
                </div>
                {i < rows.length - 1 && (
                  <div className="h-px w-full bg-[rgba(255,255,255,0.06)]" aria-hidden="true" />
                )}
              </Fragment>
            ))}
          </motion.div>

          {/* Media column */}
          <motion.div
            className="mt-12 lg:mt-0 lg:w-[380px] xl:w-[440px] shrink-0"
            initial={prefersReduced ? false : { opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.75, delay: 0.2, ease: EASE }}
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
