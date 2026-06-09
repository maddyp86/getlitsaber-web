"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SECTION_IDS, ACTIVATE_QUICKSTART } from "@/content/activate.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function ActivateQuickStart() {
  const prefersReduced = useReducedMotion();
  const { eyebrow, title, intro, stepsHeading, steps, callout, media } =
    ACTIVATE_QUICKSTART;

  return (
    <section
      id={SECTION_IDS.quickStart}
      className="scroll-mt-[150px] py-section-y-mobile lg:py-section-y bg-[#000000]"
    >
      <div className="mx-auto w-full max-w-content px-content">

        {/* Section header */}
        <motion.p
          className="font-label text-eyebrow uppercase text-accent-cyan mb-4"
          initial={prefersReduced ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {eyebrow}
        </motion.p>

        <motion.h2
          className="font-display font-bold uppercase text-white mb-6"
          style={{ fontSize: "clamp(45px, 5vw, 75px)" }}
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.05, ease: EASE }}
        >
          {title}
        </motion.h2>

        <motion.p
          className="font-body text-body-sm lg:text-body text-text-secondary mb-12 max-w-content"
          initial={prefersReduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
        >
          {intro}
        </motion.p>

        {/* Two-column: steps left, media right */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-16">

  {/* Steps column */}
        <div className="flex flex-col justify-center items-start gap-5 flex-[1_0_0] self-stretch min-w-0">
          <motion.h3
            className="font-subhead font-bold text-eyebrow text-[35px] uppercase text-white"
            initial={prefersReduced ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
          >
            {stepsHeading}
          </motion.h3>

          <div className="flex flex-col gap-0">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                className="flex gap-5 border-l-2 border-[rgba(0,229,255,0.20)] pl-5 pb-10 last:pb-0"
                initial={prefersReduced ? false : { opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.08, ease: EASE }}
              >
                <div className="flex flex-col gap-2 w-full">
                  {/* Step header row */}
                  <div className="flex items-baseline gap-3">
                    <span className="font-label text-eyebrow text-accent-cyan shrink-0">
                      {step.num}
                    </span>
                    <span className="font-label text-label uppercase text-text-primary font-bold">
                      {step.label}
                    </span>
                  </div>
                  {/* Step body */}
                  <p className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

            <div className="flex flex-col gap-0">
              {steps.map((step, i) => (
                <motion.div
                  key={step.num}
                  className="flex gap-5 border-l-2 border-[rgba(0,229,255,0.20)] pl-5 pb-10 last:pb-0"
                  initial={prefersReduced ? false : { opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.08, ease: EASE }}
                >
                  <div className="flex flex-col gap-2 w-full">
                    {/* Step header row */}
                    <div className="flex items-baseline gap-3">
                      <span className="font-label text-eyebrow text-accent-cyan shrink-0">
                        {step.num}
                      </span>
                      <span className="font-label text-label uppercase text-text-primary font-bold">
                        {step.label}
                      </span>
                    </div>
                    {/* Step body */}
                    <p className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed">
                      {step.body}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Callout block */}
            <motion.div
              className="mt-10 rounded-md border border-[rgba(0,229,255,0.15)] bg-surface-card px-5 py-4"
              initial={prefersReduced ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
            >
              <p className="font-body text-body-sm text-text-secondary">
                {callout}
              </p>
            </motion.div>
          </div>

          {/* Media column — stacks below on mobile */}
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
              <div className="w-full aspect-[9/16] rounded-card border border-border-pill bg-surface-card flex flex-col items-center justify-center gap-3">
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
