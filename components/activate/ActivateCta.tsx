"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ACTIVATE_CTA } from "./activate.content";
import FestivalDropList from "./FestivalDropList";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function ActivateCta() {
  const prefersReduced = useReducedMotion();
  const { heading, body, primary, secondary } = ACTIVATE_CTA;

  return (
    <>
      {/* Festival Drop List band */}
      <FestivalDropList />

      {/* Still Stuck CTA */}
      <section className="py-section-y-mobile lg:py-section-y border-t border-border-divider">
        <div className="mx-auto w-full max-w-content px-content text-center flex flex-col items-center gap-8">

          <div className="flex flex-col items-center gap-4">
            <motion.h2
              className="font-display font-bold uppercase leading-[1.1] text-white"
              style={{ fontSize: "clamp(34px, 6vw, 75px)" }}
              initial={prefersReduced ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              {heading}
            </motion.h2>
            <motion.p
              className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed max-w-[440px]"
              initial={prefersReduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
            >
              {body}
            </motion.p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* Primary — magenta-filled */}
            <Link
              href={primary.href}
              className="inline-block rounded-pill px-8 py-3 font-label text-label tracking-widest uppercase transition-all duration-200"
              style={{
                background: "#FF00E5",
                color: "#ffffff",
                border: "1px solid #FF00E5",
              }}
            >
              {primary.label}
            </Link>

            {/* Secondary — outlined ghost */}
            <Link
              href={secondary.href}
              className="inline-block rounded-pill px-8 py-3 font-label text-label tracking-widest uppercase text-text-secondary border border-[rgba(255,255,255,0.20)] hover:border-[rgba(255,255,255,0.40)] transition-colors duration-200"
            >
              {secondary.label}
            </Link>
          </div>

        </div>
      </section>
    </>
  );
}