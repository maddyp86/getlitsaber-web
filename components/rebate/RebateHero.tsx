"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  HERO_IMAGE_SRC,
  HERO_IMAGE_ALT,
  HERO_EYEBROW,
  HERO_HEADLINE_PART1,
  HERO_HEADLINE_ACCENT,
  HERO_BODY,
  HERO_CTA,
} from "./rebate.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function RebateHero() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      className="relative isolate overflow-hidden w-full"
      style={{ background: "linear-gradient(180deg, #000000 0%, #150C2D 100%)" }}
      aria-label="Rebate offer — show it off, get $5 off"
    >
      <div className="mx-auto w-full max-w-content px-content py-section-y-mobile lg:py-section-y">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-16">
          {/* Left — copy */}
          <motion.div
            className="flex w-full flex-col gap-6 lg:flex-1"
            initial={prefersReduced ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <p className="font-label text-eyebrow tracking-[0.25em] uppercase text-accent-cyan">
              {HERO_EYEBROW}
            </p>

            <h1
              className="font-display font-bold uppercase leading-[1.05]"
              style={{ fontSize: "clamp(48px, 6vw, 90px)" }}
            >
              <span
                className="block text-white"
                style={{ textShadow: "0 0 50px rgba(255,255,255,0.25)" }}
              >
                {HERO_HEADLINE_PART1}
              </span>
              <span
                className="block text-accent-cyan"
                style={{ textShadow: "0 0 50px rgba(0,229,255,0.5)" }}
              >
                {HERO_HEADLINE_ACCENT}
              </span>
            </h1>

            <p className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed max-w-[520px]">
              {HERO_BODY}
            </p>

            <div className="mt-2">
              <a
                href="#claim"
                className="inline-flex items-center justify-center gap-[10px] w-full sm:w-auto sm:min-w-[290px] p-5 rounded-[5px] border border-[#EC5793] bg-[#EB3D7B] text-white font-label font-bold text-eyebrow uppercase tracking-wider shadow-[0_0_50px_0_rgba(235,62,124,0.50)] transition-all hover:brightness-110"
              >
                {HERO_CTA}
              </a>
            </div>
          </motion.div>

          {/* Right — lifestyle image (below the copy on mobile) */}
          <motion.div
            className="w-full lg:w-[400px] lg:flex-shrink-0"
            initial={prefersReduced ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-[#32205A]">
              <Image
                src={HERO_IMAGE_SRC}
                alt={HERO_IMAGE_ALT}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 400px"
                className="object-cover object-center"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Full-width cyan divider between the hero and section 2 */}
      <div
        aria-hidden="true"
        className="w-full h-[2px]"
        style={{
          background:
            "linear-gradient(90deg, #150C2D 0%, #00E5FF 48%, #150C2D 100%)",
        }}
      />
    </section>
  );
}
