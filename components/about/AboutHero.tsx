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

      {/* Full-bleed: no max-width, no right padding, so the photo reaches the viewport edge */}
      <div className="w-full px-[20px] lg:pl-[70px] lg:pr-0">
        <div className="flex flex-col py-16 lg:grid lg:grid-cols-[minmax(0,1fr)_clamp(400px,28vw,515px)] lg:items-end lg:gap-x-10 lg:pt-[100px] lg:pb-0">

          {/* Left — text (vertically centered against the taller image column) */}
          <div className="flex flex-col justify-center gap-6 max-w-[800px] lg:self-center lg:pb-16">
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
              style={{ fontSize: "clamp(55px, 7vw, 90px)" }}
              initial={prefersReduced ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            >
              <span className="block text-white"
                 style={{ textShadow: "0 0 50px rgba(255,255,255,0.25)",}}>
                {HERO_HEADLINE_LINE1}
              </span>
              <span
                className="block font-normal font-accent text-accent-cyan"
                style={{ textShadow: "0 0 50px rgba(0,229,255,0.75)",
                       fontSize: "clamp(50px, 7vw, 90px)"}}
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

            {/* Learn More — text + chevron, stacked (replaces old box button + chevron) */}
            <motion.div
              className="mt-4"
              initial={prefersReduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
            >
              <button
                onClick={scrollToOrigin}
                className="flex flex-col items-center gap-2 group"
                aria-label="Scroll to our story"
              >
                <span className="font-label font-bold text-eyebrow tracking-[0.2em] uppercase text-accent-cyan group-hover:text-white transition-colors mb-2">
                  {HERO_CTA}
                </span>
                <Image
                  src="/images/icons/down-arrow-download-svgrepo-com 1.svg"
                  alt=""
                  width={24}
                  height={24}
                  aria-hidden="true"
                  className="group-hover:translate-y-1 transition-transform"
                />
              </button>
            </motion.div>
          </div>

          {/* Right — image: flush to viewport right + hero bottom on desktop, stacked on mobile */}
          <motion.div
            className="relative mt-10 w-full aspect-[3/4] overflow-hidden rounded-card
                       lg:mt-0 lg:self-end lg:aspect-auto lg:h-[687px] lg:w-full lg:rounded-none"
            initial={prefersReduced ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
          >
            <Image
              src={HERO_IMAGE_SRC}
              alt={HERO_IMAGE_ALT}
              fill
              sizes="(min-width: 1024px) 515px, 100vw"
              className="object-cover object-center"
              priority
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}