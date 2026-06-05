"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  HERO_EYEBROW,
  HERO_HEADLINE_LINE1,
  HERO_HEADLINE_ACCENT,
  HERO_BODY,
  HERO_CTA,
  HERO_IMAGE_SRC,
  HERO_IMAGE_ALT,
  HERO_IMAGE_CAPTION,
} from "./about.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function AboutHero() {
  const prefersReduced = useReducedMotion();

  const scrollToOrigin = () => {
    document.getElementById("origin")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative isolate overflow-hidden w-full bg-[linear-gradient(180deg,#0A0518_0%,#150C2D_60%,#0A0518_100%)]"
      aria-label="Built for the night you came to be a part of"
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

      <div className="mx-auto w-full max-w-[1250px] px-[20px] lg:px-[60px]">
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_auto] lg:items-stretch lg:gap-12 py-16 lg:py-24">

          {/* Left — text */}
          <div className="flex flex-col justify-center gap-6 max-w-[700px]">
            <motion.p
              className="font-label text-eyebrow tracking-[0.2em] uppercase text-accent-cyan"
              initial={prefersReduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              {HERO_EYEBROW}
            </motion.p>

            <motion.h1
              className="font-display font-bold uppercase leading-[1.05]"
              style={{ fontSize: "clamp(55px, 5.5vw, 100px)" }}
              initial={prefersReduced ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            >
              <span className="block text-white">{HERO_HEADLINE_LINE1}</span>
              <span
                className="block font-normal font-accent text-accent-cyan"
                style={{ textShadow: "0 0 50px rgba(0,229,255,0.75)",
                       fontSize: "clamp(50px, 7.3vw, 90px)"}}
              >
                {HERO_HEADLINE_ACCENT}
              </span>
            </motion.h1>
            <motion.p
              className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed max-w-[520px]"
              initial={prefersReduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            >
              {HERO_BODY}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 mt-2"
              initial={prefersReduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.35, ease: EASE }}
            >
              {/* Ghost/secondary CTA */}
              <button
                onClick={scrollToOrigin}
                className="flex items-center justify-center gap-[10px] w-full sm:w-[220px] p-4 rounded-[5px] border border-[#00E5FF] bg-transparent text-[#00E5FF] font-label font-bold text-eyebrow uppercase tracking-wider transition-colors duration-200 hover:bg-[#00E5FF] hover:text-[#0A0518]"
              >
                {HERO_CTA}
              </button>
            </motion.div>

            {/* Scroll chevron */}
            <motion.button
              onClick={scrollToOrigin}
              className="flex flex-col items-start gap-2 group mt-4 w-fit"
              aria-label="Scroll to our story"
              initial={prefersReduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
            >
              <svg
                width="24"
                height="14"
                viewBox="0 0 24 14"
                fill="none"
                aria-hidden="true"
                className="text-text-muted group-hover:text-accent-cyan transition-colors group-hover:translate-y-1 duration-200"
              >
                <path
                  d="M2 2l10 10L22 2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.button>
          </div>

          {/* Right — image with caption chip */}
          <motion.div
            className="relative mt-10 lg:mt-0 w-full max-w-[420px] mx-auto lg:mx-0 lg:w-[420px] aspect-[4/5] rounded-card overflow-hidden"
            initial={prefersReduced ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
          >
            <Image
              src={HERO_IMAGE_SRC}
              alt={HERO_IMAGE_ALT}
              fill
              sizes="(min-width: 1024px) 420px, 100vw"
              className="object-cover object-center"
              priority
            />
            {/* Caption chip */}
            <div className="absolute bottom-4 left-4 right-4">
              <span className="inline-block px-3 py-1.5 rounded-pill bg-[rgba(10,5,24,0.75)] backdrop-blur-sm border border-[#2D1C53] font-label text-[11px] tracking-[0.1em] uppercase text-text-secondary">
                {HERO_IMAGE_CAPTION}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
