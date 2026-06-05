"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  CLOSING_HEADLINE_PART1,
  CLOSING_HEADLINE_ACCENT,
  CLOSING_BODY,
  CLOSING_CTA_PRIMARY,
  CLOSING_CTA_PRIMARY_HREF,
  CLOSING_CTA_SECONDARY,
  CLOSING_CTA_SECONDARY_HREF,
} from "./about.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function AboutClosingCta() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      className="relative w-full bg-background-primary"
      aria-label="Get yours"
    >
      <div className="mx-auto w-full max-w-[1250px] px-[20px] lg:px-[60px] py-[100px]">
        <div className="flex flex-col items-center text-center gap-6">

          <motion.h2
            className="font-display font-bold uppercase leading-[1.1] max-w-[800px]"
            style={{ fontSize: "clamp(45px, 7vw, 75px)" }}
            initial={prefersReduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.75, ease: EASE }}
          >
            <span className="block text-white">{CLOSING_HEADLINE_PART1}</span>
            <span
              className="block text-accent-cyan"
              style={{ textShadow: "0 0 50px rgba(0,229,255,0.6)" }}
            >
              {CLOSING_HEADLINE_ACCENT}
            </span>
          </motion.h2>

          <motion.p
            className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed max-w-[750px]"
            initial={prefersReduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          >
            {CLOSING_BODY}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 sm:gap-5 w-full sm:w-auto mt-2"
            initial={prefersReduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, delay: 0.2, ease: EASE }}
          >
            <Link
              href={CLOSING_CTA_PRIMARY_HREF}
className="flex items-center justify-center gap-[10px] w-full sm:w-[300px] p-5 rounded-[5px] border border-[#EC5793] bg-[#EB3D7B] text-white font-label font-bold text-eyebrow uppercase tracking-wider shadow-[0_0_50px_0_rgba(235,62,124,0.50)] transition-all hover:brightness-110"
            >
              {CLOSING_CTA_PRIMARY}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

            <Link
              href={CLOSING_CTA_SECONDARY_HREF}
  className="flex items-center justify-center gap-[10px] w-full sm:w-[300px] p-5 rounded-[5px] border border-[#00E5FF] bg-transparent text-[#00E5FF] font-label font-bold text-eyebrow uppercase tracking-wider transition-colors duration-200 hover:bg-[#00E5FF] hover:text-white"
            >
              {CLOSING_CTA_SECONDARY}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
