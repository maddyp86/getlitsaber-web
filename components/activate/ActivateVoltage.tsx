"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SECTION_IDS, ACTIVATE_VOLTAGE } from "./activate.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function ActivateVoltage() {
  const prefersReduced = useReducedMotion();
  const { eyebrow, title, intro, rows, media } = ACTIVATE_VOLTAGE;

  return (
    <section
      id={SECTION_IDS.voltage}
      className="scroll-mt-[146px] py-section-y-mobile lg:py-section-y bg-[#000000]"
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
          style={{ fontSize: "clamp(45px, 6vw, 75px)",
                  textShadow: "0 0 50px rgba(255, 255, 255, 0.50)"}}
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.05, ease: EASE }}
        >
          {title}
        </motion.h2>

        <motion.p
          className="font-body text-body-sm text-center lg:text-body text-text-secondary mb-16 max-w-[600px] mx-auto"
          initial={prefersReduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
        >
          {intro}
        </motion.p>

        {/* Two-column: cards left, media right */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-16">

{/* Voltage cards — three separate cards stacked with gaps */}
          <div className="flex flex-col items-stretch gap-4 flex-[1_0_0] self-stretch min-w-0 w-full">
            {rows.map((row, i) => (
              <motion.div
                key={row.voltage}
                className="flex flex-1 overflow-hidden border border-[rgba(255,255,255,0.08)] bg-surface-card"
                initial={prefersReduced ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.08, ease: EASE }}
              >
                {/* Colored left accent bar, full card height */}
                <div
                  className="w-1.5 shrink-0 self-stretch"
                  style={{ backgroundColor: row.hex }}
                  aria-hidden="true"
                />

                {/* Card body — vertical stack */}
                <div className="flex flex-col gap-2 px-6 py-5 flex-1 min-w-0">

                  {/* Dot + "{COLOR} LED" label */}
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: row.hex }}
                      aria-hidden="true"
                    />
                    <span
                      className="font-label text-[12px] uppercase font-bold"
                      style={{ color: row.hex }}
                    >
                      {row.colorName} LED
                    </span>
                  </div>

                  {/* Voltage — WHITE, not colored */}
                  <span
                    className="font-subhead font-bold leading-none tabular-nums text-white"
                    style={{ fontSize: "clamp(25px, 3.5vw, 35px)" }}
                  >
                    {row.voltage}
                  </span>

                  {/* Oils — white bold, mixed case */}
                  <span className="font-body text-body font-bold text-text-primary">
                    {row.oils}
                  </span>

                  {/* Body — muted */}
                  <span className="font-body text-body-sm text-text-secondary leading-relaxed">
                    {row.body}
                  </span>

                </div>
              </motion.div>
            ))}
          </div>

          {/* Media column */}
          <motion.div
            className="mt-12 flex min-h-[400px] lg:min-h-[600px] flex-col lg:mt-0 lg:w-[380px] xl:w-[440px] shrink-0"
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
                controls
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