"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  KIT_EYEBROW,
  KIT_HEADLINE,
  KIT_BODY,
  KIT_LINK_LABEL,
  KIT_LADDER,
  SIGNUP_URL,
} from "./affiliates.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function SampleKit() {
  const prefersReduced = useReducedMotion();
  const rise = (delay: number) => ({
    initial: prefersReduced ? false : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.7, delay, ease: EASE },
  });

  return (
    <section className="relative w-full py-16 lg:py-[110px]" aria-label="Getting started">
      <div className="mx-auto w-full max-w-content px-content">
        <div className="grid grid-cols-1 items-start gap-9 lg:grid-cols-2 lg:gap-[90px]">
          {/* Pitch */}
          <div className="flex flex-col items-start gap-5">
            <motion.span
              className="font-label font-bold text-xs uppercase tracking-[0.12em] text-accent-cyan"
              {...rise(0)}
            >
              {KIT_EYEBROW}
            </motion.span>
            <motion.h2
              className="font-display font-bold leading-[1.06] text-text-primary drop-shadow-[0_0_60px_rgba(240,240,245,0.25)]"
              style={{ fontSize: "clamp(30px, 5.2vw, 75px)" }}
              {...rise(0.08)}
            >
              {KIT_HEADLINE}
            </motion.h2>
            <motion.p
              className="max-w-[520px] font-body text-body-sm lg:text-[17px] leading-relaxed text-text-muted"
              {...rise(0.14)}
            >
              {KIT_BODY}
            </motion.p>
            <motion.a
              href={SIGNUP_URL}
              className="group inline-flex items-center gap-2 border-b border-cta-alpha-40 pb-[3px] font-label text-xs font-bold uppercase tracking-[0.12em] text-cta transition-colors duration-200 hover:border-cta"
              {...rise(0.2)}
            >
              {KIT_LINK_LABEL}
              <span
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-1"
              >
                →
              </span>
            </motion.a>
          </div>

          {/* Milestone ladder */}
          <ol className="flex list-none flex-col gap-[22px] lg:gap-[26px]">
            {KIT_LADDER.map((step, i) => (
              <motion.li
                key={step.num}
                className="flex flex-col gap-2"
                initial={prefersReduced ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: EASE }}
              >
                <div className="flex items-baseline gap-2.5">
                  <span className="font-label text-[13px] font-bold uppercase tracking-[0.12em] text-accent-cyan drop-shadow-[0_0_26px_rgba(0,229,255,0.55)] lg:text-[15px]">
                    /{step.num}
                  </span>
                  <span className="font-label text-[13px] font-bold uppercase tracking-[0.12em] text-text-primary lg:text-[15px]">
                    {step.title}
                  </span>
                </div>
                <p className="font-body text-sm leading-relaxed text-text-muted lg:text-[15px]">
                  {step.detail}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
