"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  CTA_HEADLINE,
  CTA_SUBHEADLINE,
  CTA_PRIMARY_LABEL,
  CTA_PRIMARY_HREF,
  CTA_SECONDARY_LABEL,
  CTA_SECONDARY_HREF,
} from "./the-tech.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function TechCta() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      className="relative w-full bg-background-primary"
      aria-label="Ready to see it in person"
    >
      <div className="mx-auto w-full max-w-[1250px] px-5 lg:px-0 py-16 lg:py-24">
        <div className="flex flex-col items-center text-center gap-6">
          <motion.h2
            className="font-display font-bold uppercase leading-[normal] max-w-[350px] lg:max-w-[810px]"
            style={{ fontSize: "clamp(45px, 6.5vw, 75px)" }}
            initial={prefersReduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.75, ease: EASE }}
          >
            {CTA_HEADLINE}
          </motion.h2>

          <motion.p
            className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed max-w-[700px]"
            initial={prefersReduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          >
            {CTA_SUBHEADLINE}
          </motion.p>

         <motion.div
  className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-[50px] mt-2"
  initial={prefersReduced ? false : { opacity: 0, y: 16 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-60px" }}
  transition={{ duration: 0.65, delay: 0.25, ease: EASE }}
>
  {/* Primary — GET YOURS */}
  <Link
    href={CTA_PRIMARY_HREF}
    className="flex items-center justify-center gap-[10px] w-full sm:w-[300px] p-5 rounded-[5px] border border-[#EC5793] bg-[#EB3D7B] text-white font-label font-bold text-eyebrow uppercase tracking-wider shadow-[0_0_50px_0_rgba(235,62,124,0.50)] transition-all hover:brightness-110"
  >
    {CTA_PRIMARY_LABEL}
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0"
      aria-hidden="true"
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </Link>

  {/* Secondary — VIEW WHOLESALE */}
  <Link
    href={CTA_SECONDARY_HREF}
    className="flex items-center justify-center gap-[10px] w-full sm:w-[300px] p-5 rounded-[5px] border border-[#00E5FF] text-[#00E5FF] font-label font-bold text-eyebrow uppercase tracking-wider transition-colors hover:bg-[#00E5FF]/10"
  >
    {CTA_SECONDARY_LABEL}
  </Link>
</motion.div>
        </div>
      </div>
    </section>
  );
}
