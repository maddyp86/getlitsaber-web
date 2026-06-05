"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ORIGIN_EYEBROW,
  ORIGIN_HEADLINE,
  ORIGIN_BODY_INTRO,
  ORIGIN_PULLQUOTE,
  ORIGIN_PULLQUOTE_ACCENT,
  ORIGIN_PULLQUOTE_ATTRIBUTION,
  ORIGIN_BODY_CLOSING,
} from "./about.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function AboutOrigin() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      id="origin"
      className="relative w-full bg-[#000000]"
      aria-label="Origin story"
    >
      <div className="mx-auto w-full max-w-[1250px] px-[20px] lg:px-[60px] py-[100px]">

        <motion.p
          className="font-label text-eyebrow tracking-[0.2em] uppercase text-accent-cyan mb-4"
          initial={prefersReduced ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {ORIGIN_EYEBROW}
        </motion.p>

        <motion.h2
          className="font-display font-bold leading-[1.1] text-white mb-8"
          style={{ fontSize: "clamp(34px, 4vw, 55px)" }}
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, delay: 0.05, ease: EASE }}
        >
          {ORIGIN_HEADLINE}
        </motion.h2>

        <motion.p
          className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed mb-12"
          initial={prefersReduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
        >
          {ORIGIN_BODY_INTRO}
        </motion.p>

      {/* Pull-quote — centered bordered card (Figma: 1000px, 20/50 pad, cyan 20% border) */}
<motion.blockquote
  className="mx-auto my-12 flex w-full max-w-[1000px] flex-col items-center gap-5 rounded-[10px] border border-[rgba(0,229,255,0.20)] px-6 py-5 lg:px-[50px]"
  initial={prefersReduced ? false : { opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-60px" }}
  transition={{ duration: 0.75, delay: 0.15, ease: EASE }}
>
  {/* Quote mark (Figma "Quote Left", 50x50, centered) */}
  <span
    className="block select-none font-accent font-bold leading-none text-accent-cyan"
    style={{ fontSize: "50px", lineHeight: 1 }}
    aria-hidden="true"
  >
    &ldquo;
  </span>

  <p
    className="text-center font-subhead leading-normal"
    style={{ fontSize: "clamp(26px, 4.5vw, 45px)" }}
  >
    <span className="font-normal text-white">{ORIGIN_PULLQUOTE} </span>
    <span className="font-extrabold text-accent-cyan">{ORIGIN_PULLQUOTE_ACCENT}</span>
  </p>

  <footer>
    <cite className="font-body text-eyebrow uppercase tracking-[0.15em] text-text-muted not-italic">
      — {ORIGIN_PULLQUOTE_ATTRIBUTION}
    </cite>
  </footer>
</motion.blockquote>

        <motion.p
          className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed"
          initial={prefersReduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
        >
          {ORIGIN_BODY_CLOSING}
        </motion.p>
      </div>
    </section>
  );
}
