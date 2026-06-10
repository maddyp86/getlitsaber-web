"use client";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ACTIVATE_CTA } from "./activate.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function ActivateCta() {
  const prefersReduced = useReducedMotion();
  const { heading, body, primary, secondary } = ACTIVATE_CTA;

  return (
    <section
      className="relative w-full border-t border-border-divider bg-background-primary"
      aria-label="Still stuck"
    >
      <div className="mx-auto w-full max-w-content px-content py-section-y-mobile lg:py-section-y">
        <div className="flex flex-col items-center text-center gap-6">

          <motion.h2
            className="font-display font-bold uppercase leading-[1.1] text-white max-w-[800px]"
            style={{ fontSize: "clamp(45px, 5vw, 75px)" }}
            initial={prefersReduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.75, ease: EASE }}
          >
            {heading}
          </motion.h2>

          <motion.p
            className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed max-w-[750px]"
            initial={prefersReduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          >
            {body}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-[50px] mt-2 w-full sm:w-auto"
            initial={prefersReduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, delay: 0.2, ease: EASE }}
          >
            {/* Primary — pink-filled with arrow */}
            <Link
              href={primary.href}
              className="flex items-center justify-center gap-[10px] w-full sm:w-[300px] p-5 rounded-[5px] border border-[#EC5793] bg-[#EB3D7B] text-white font-label font-bold text-eyebrow uppercase tracking-wider shadow-[0_0_50px_0_rgba(235,62,124,0.50)] transition-all hover:brightness-110"
            >
              {primary.label}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

            {/* Secondary — cyan outlined */}
            <Link
              href={secondary.href}
              className="flex items-center justify-center gap-[10px] w-full sm:w-[300px] p-5 rounded-[5px] border border-[#00E5FF] bg-transparent text-[#00E5FF] font-label font-bold text-eyebrow uppercase tracking-wider transition-colors duration-200 hover:bg-[#00E5FF] hover:text-white"
            >
              {secondary.label}
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}