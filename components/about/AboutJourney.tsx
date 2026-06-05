"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  JOURNEY_EYEBROW,
  JOURNEY_HEADLINE,
  JOURNEY_BODY_INTRO,
  JOURNEY_BODY_CLOSING,
} from "./about.content";
import PrototypeTimeline from "./PrototypeTimeline";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function AboutJourney() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      className="relative w-full bg-background-primary"
      aria-label="The journey"
    >
      <div className="mx-auto w-full max-w-[1250px] px-[20px] lg:px-[60px] py-[100px]">

        <motion.p
          className="font-label text-eyebrow tracking-[0.2em] uppercase text-accent-cyan mb-4"
          initial={prefersReduced ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {JOURNEY_EYEBROW}
        </motion.p>

        <motion.h2
          className="font-display font-bold leading-[1.1] text-white mb-8"
          style={{ fontSize: "clamp(34px, 4vw, 55px)" }}
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, delay: 0.05, ease: EASE }}
        >
          {JOURNEY_HEADLINE}
        </motion.h2>

        <motion.p
          className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed"
          initial={prefersReduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
        >
          {JOURNEY_BODY_INTRO}
        </motion.p>

        <PrototypeTimeline />

        <motion.p
          className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed"
          initial={prefersReduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {JOURNEY_BODY_CLOSING}
        </motion.p>
      </div>
    </section>
  );
}
