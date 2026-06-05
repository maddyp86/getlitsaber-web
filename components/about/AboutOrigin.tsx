"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ORIGIN_EYEBROW,
  ORIGIN_HEADLINE,
  ORIGIN_BODY_INTRO,
  ORIGIN_PULLQUOTE,
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
      <div className="mx-auto w-full max-w-[1250px] px-[20px] lg:px-[40px] py-[100px]">

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

        {/* Pull-quote */}
        <motion.blockquote
          className="relative my-12 pl-6 border-l-2 border-accent-cyan"
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, delay: 0.15, ease: EASE }}
        >
          {/* Large decorative quote mark */}
          <span
            className="block font-display font-bold text-accent-cyan leading-none mb-3 select-none"
            style={{
              fontSize: "clamp(60px, 8vw, 100px)",
              lineHeight: 0.75,
              textShadow: "0 0 40px rgba(0,229,255,0.4)",
            }}
            aria-hidden="true"
          >
            &ldquo;
          </span>
          <p
            className="font-display font-bold text-white leading-[1.15] italic"
            style={{
              fontSize: "clamp(22px, 3.5vw, 42px)",
              textShadow: "0 0 30px rgba(0,229,255,0.2)",
            }}
          >
            {ORIGIN_PULLQUOTE}
          </p>
          <footer className="mt-4">
            <cite className="font-label text-eyebrow tracking-[0.15em] uppercase text-text-muted not-italic">
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
