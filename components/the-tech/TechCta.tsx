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
            className="flex flex-col sm:flex-row gap-4 mt-2"
            initial={prefersReduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, delay: 0.25, ease: EASE }}
          >
            <Link
              href={CTA_PRIMARY_HREF}
              className="inline-flex items-center justify-center font-label font-bold text-eyebrow uppercase tracking-wider px-8 py-4 rounded-md bg-cta text-white transition-all hover:shadow-glow-cta-hover hover:brightness-110"
            >
              {CTA_PRIMARY_LABEL}
            </Link>

            <Link
              href={CTA_SECONDARY_HREF}
              className="inline-flex items-center justify-center font-label font-bold text-eyebrow uppercase tracking-wider px-8 py-4 rounded-md border border-text-muted text-text-secondary transition-colors hover:border-text-primary hover:text-text-primary"
            >
              {CTA_SECONDARY_LABEL}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
