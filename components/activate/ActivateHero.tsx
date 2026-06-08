"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ACTIVATE_HERO } from "@/content/activate.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Reproduces the navbar's left content edge at every width.
// Must stay in sync with the layout tokens: max-w-content (1440px) and px-content (clamp(20px, 5vw, 70px)).
// Mirror any token change here AND in AboutHero.tsx / TechHero.tsx.
const NAVBAR_LEFT =
  "max(clamp(20px, 5vw, 70px), calc((100vw - 1440px) / 2 + clamp(20px, 5vw, 70px)))";

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
            "radial-gradient(ellipse 60% 50% at 30% 40%, rgba(0,229,255,0.05) 0%, transparent 70%)",
        }}
      />

      {/* Full-width two-column grid — no max-w cap so the photo reaches the viewport right edge */}
      <div className="flex flex-col min-h-screen lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(380px,38%)] lg:items-stretch lg:gap-x-16">

        {/* Left — text column. paddingLeft aligns to the navbar left edge. */}
        <div
          className="px-content lg:pr-0 lg:self-center lg:pt-[50px] lg:pb-16"
          style={{ paddingLeft: NAVBAR_LEFT }}
        >
          <div className="flex flex-col justify-center gap-6 max-w-[800px]">

            {/* Badge */}
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05, ease: EASE }}
            >
              <span className="inline-block rounded-pill border border-accent-cyan px-4 py-1.5 font-label text-eyebrow tracking-[0.15em] uppercase text-accent-cyan">
                {ACTIVATE_HERO.badge}
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              className="font-display font-bold uppercase leading-[1.05]"
              style={{ fontSize: "clamp(55px, 7vw, 100px)" }}
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
                  fontSize: "clamp(55px, 7vw, 90px)",
                }}
              >
                {ACTIVATE_HERO.headingAccent}
              </span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              className="font-body text-subhead text-text-secondary leading-relaxed max-w-[600px]"
              initial={prefersReduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            >
              {ACTIVATE_HERO.sub}
            </motion.p>

            {/* Meta pills */}
            <motion.div
              className="flex flex-wrap gap-3 mt-2"
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

        {/* Right — hero image, flush to viewport right on desktop, inset card on mobile */}
        <motion.div
          className="relative mt-10 mx-[20px] aspect-[3/4] overflow-hidden rounded-card
                     lg:mt-0 lg:mx-0 lg:self-stretch lg:aspect-auto lg:w-full lg:rounded-none"
          initial={prefersReduced ? false : { opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
        >
          {/* TODO: replace placeholder with real in-use shot */}
          <Image
            src="/images/activate/litsaber-demo-placeholder.jpg"
            alt="Litsaber in hand, lit and ready to use"
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover object-center"
            priority
          />
        </motion.div>

      </div>
    </section>
  );
}
