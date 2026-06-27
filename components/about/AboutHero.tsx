"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { mediaUrl } from "@/lib/media";
import {
  HERO_HEADLINE_LINE1,
  HERO_HEADLINE_ACCENT,
  HERO_BODY,
  HERO_CTA,
  HERO_IMAGE_SRC,
  HERO_IMAGE_ALT,
} from "./about.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Reproduces the navbar's left content edge at every width.
// Must stay in sync with the layout tokens: max-w-content (1600px) and px-content (clamp(16px, 2vw, 32px)).
// Mirror any token change here AND in TechHero.tsx.
const NAVBAR_LEFT =
  "max(clamp(20px, 5vw, 70px), calc((100vw - 1440px) / 2 + clamp(20px, 5vw, 70px)))";

export default function AboutHero() {
  const prefersReduced = useReducedMotion();

  const scrollToOrigin = () => {
    document.getElementById("origin")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative isolate overflow-hidden w-full min-h-screen bg-[linear-gradient(180deg,#0A0518_0%,#150C2D_60%,#0A0518_100%)]"
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

      {/* Full-width grid — no max-w cap, so the photo reaches the viewport right edge.
          No top padding here: the image starts at the section top; the text cell
          carries its own top padding instead. */}
   <div className="flex flex-col min-h-screen lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(380px,38%)] lg:items-stretch lg:gap-x-16">

        {/* Left — text column. paddingLeft uses NAVBAR_LEFT to align the text's left edge to the navbar. */}
        <div
          className="px-content lg:pr-0 lg:self-center lg:pt-[50px] lg:pb-16"
          style={{ paddingLeft: NAVBAR_LEFT }}
        >
          {/* Inner — capped readable copy width, left-aligned */}
          <div className="flex flex-col justify-center gap-6 max-w-[800px]">

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
                {HERO_HEADLINE_LINE1}
              </span>
              <span
                className="block font-normal font-accent text-accent-cyan"
                style={{
                  textShadow: "0 0 50px rgba(0,229,255,0.75)",
                  fontSize: "clamp(55px, 7vw, 90px)",
                }}
              >
                {HERO_HEADLINE_ACCENT}
              </span>
            </motion.h1>

            <motion.p
                    className="font-body text-body-sm md:text-subhead text-text-secondary max-w-[720px]"
              initial={prefersReduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            >
              {HERO_BODY}
            </motion.p>

            {/* Learn More — text + chevron, stacked */}
            <motion.div
              className="mt-4 self-center lg:self-start"
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
                  src={mediaUrl("icons/down-arrow-download-svgrepo-com 1.svg")}
                  alt=""
                  width={24}
                  height={24}
                  aria-hidden="true"
                  className="group-hover:translate-y-1 transition-transform"
                />
              </button>
            </motion.div>
          </div>
        </div>

        {/* Right — image: fixed 810px tall, pinned to section top, flush to viewport right
            on desktop; inset card on mobile. */}
        <motion.div
          className="relative mt-10 mx-[20px] aspect-[3/4] overflow-hidden rounded-card
                     lg:mt-0 lg:mx-0 lg:self-stretch lg:aspect-auto lg:w-full lg:rounded-none"
          initial={prefersReduced ? false : { opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
        >
          <Image
            src={HERO_IMAGE_SRC}
            alt={HERO_IMAGE_ALT}
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover object-center"
            priority
          />

 {/* Caption pill — floats near the bottom of the image */}
          <motion.div
            className="absolute left-4 sm:left-6 bottom-6 lg:bottom-[70px] z-10
                       whitespace-nowrap rounded-[6px] border border-accent-cyan bg-black/90
                       px-5 py-3"
            initial={prefersReduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
          >
            <span
              className="font-label uppercase text-accent-cyan"
              style={{ fontSize: "clamp(12px, 1vw, 16px)", letterSpacing: "0.08em" }}
            >
              Matt &amp; Brendan - ComicCon 2025
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}