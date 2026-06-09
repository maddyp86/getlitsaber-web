"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ACTIVATE_HERO } from "@/content/activate.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function ActivateHero() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      className="relative isolate overflow-hidden w-full min-h-screen bg-[linear-gradient(180deg,#0A0518_0%,#150C2D_60%,#0A0518_100%)]"
      aria-label="Activate your Litsaber"
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 45%, rgba(0,229,255,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Centered content column */}
      <div className="flex min-h-screen items-center justify-center px-content">
        <div className="flex flex-col mb-20 items-center text-center gap-6 max-w-[820px] w-full">

          {/* Badge */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: EASE }}
          >
            <span className="inline-flex items-center gap-2 rounded-pill border border-accent-cyan px-4 py-1.5 font-label text-eyebrow tracking-[0.15em] uppercase text-accent-cyan">
              <span aria-hidden="true" className="inline-block w-1.5 h-1.5 rounded-full bg-accent-cyan" />
              {ACTIVATE_HERO.badge}
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            className="font-display font-bold uppercase leading-[1.05]"
            style={{ fontSize: "clamp(45px, 7vw, 100px)" }}
            initial={prefersReduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          >
            <span
              className="block text-white"
              style={{ textShadow: "0 0 50px rgba(255,255,255,0.25)" }}
            >
              {ACTIVATE_HERO.headingLead}
            </span>
            <span
              className="block font-normal font-accent text-accent-cyan"
              style={{
                textShadow: "0 0 50px rgba(0,229,255,0.75)",
                fontSize: "clamp(45px, 7vw, 90px)",
              }}
            >
              {ACTIVATE_HERO.headingAccent}
            </span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            className="font-body text-subhead text-text-secondary max-w-[640px]"
            initial={prefersReduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          >
            {ACTIVATE_HERO.sub}
          </motion.p>

          {/* Meta pills */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mt-2"
            initial={prefersReduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
          >
            {ACTIVATE_HERO.meta.map((item) => (
              <span
                key={item}
                className="rounded-pill border border-border-pill bg-surface-card px-4 py-1.5 font-label text-eyebrow tracking-[0.12em] uppercase text-text-muted"
              >
                {item}
              </span>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
