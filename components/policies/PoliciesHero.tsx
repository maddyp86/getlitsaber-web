"use client";

import { motion, useReducedMotion } from "framer-motion";
import { POLICIES_HERO } from "@/content/policies/shared";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function PoliciesHero() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      className="relative isolate w-full overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #0A0518 0%, #150C2D 60%, #0A0518 100%)",
      }}
      aria-label="Policies and Terms"
    >
      {/* Cyan ambient glow at top */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0,229,255,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="mx-auto w-full max-w-content px-content py-[100px] lg:py-[120px]">
        <div className="flex flex-col items-center text-center gap-6 max-w-[800px] mx-auto">

          {/* Eyebrow */}
          <motion.p
            className="font-label text-eyebrow tracking-[0.2em] uppercase text-accent-cyan"
            initial={prefersReduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            {POLICIES_HERO.eyebrow}
          </motion.p>

          {/* Headline */}
          <motion.h1
            className="font-display font-bold uppercase leading-[1.05]"
            style={{ fontSize: "clamp(55px, 7vw, 100px)" }}
            initial={prefersReduced ? false : { opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          >
            <span
              className="block text-text-primary"
              style={{ textShadow: "0 0 50px rgba(255,255,255,0.15)" }}
            >
              {POLICIES_HERO.headlineWhite}
            </span>
            <span
              className="block text-accent-cyan"
              style={{ textShadow: "0 0 50px rgba(0,229,255,0.75)" }}
            >
              {POLICIES_HERO.headlineCyan}
            </span>
          </motion.h1>

          {/* Subline */}
          <motion.p
            className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed max-w-[560px]"
            initial={prefersReduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          >
            {POLICIES_HERO.subline}
          </motion.p>

          {/* Effective date */}
          <motion.p
            className="font-label text-eyebrow text-text-muted tracking-widest uppercase"
            initial={prefersReduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
          >
            {POLICIES_HERO.effectiveLabel}
          </motion.p>

        </div>
      </div>
    </section>
  );
}
