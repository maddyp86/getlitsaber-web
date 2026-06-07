"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  HERO_HEADLINE_LINE1,
  HERO_HEADLINE_LINE2,
  HERO_HEADLINE_ACCENT,
  HERO_BODY,
  HERO_CTA_PRIMARY,
  HERO_CTA_SECONDARY,
} from "./wholesale.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function WholesaleHero() {
  const prefersReduced = useReducedMotion();

  return (
<section
  className="relative isolate overflow-hidden w-full bg-[#0A0518]"
  aria-label="The 510 battery you've been looking for"
>
  {/* Background image — backmost layer */}
<Image
  src="/images/wholesale/smoke-background.jpg"
  alt=""
  fill
  priority
  sizes="100vw"
  aria-hidden="true"
  className="object-cover object-center -z-20 pointer-events-none"
/>

{/* Gradient overlay — translucent, sits over the image */}
<div
  aria-hidden="true"
  className="pointer-events-none absolute inset-0 -z-10"
  style={{
    background:
      "linear-gradient(180deg, rgba(0,0,0,0.50) 0%, rgba(21,12,45,0.50) 100%)",
  }}
/>

  {/* Bottom purple gradient — above image + dark overlay, below content */}
<div
  aria-hidden="true"
  className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/2"
  style={{
    background:
      "linear-gradient(0deg, rgba(75,47,129,0.75) 0%, rgba(0,0,0,0.00) 69.71%)",
  }}
/>
      <div className="mx-auto w-full max-w-content px-content py-[100px] lg:py-[140px]">
        <div className="flex flex-col items-center text-center gap-8 max-w-[900px] mx-auto">
          <motion.h1
  className="font-display font-bold uppercase text-center"
  style={{ fontSize: "clamp(55px, 7vw, 100px)", lineHeight: "1.1" }}
  initial={prefersReduced ? false : { opacity: 0, y: 32 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: EASE }}
>
  <span
    className="block text-white"
    style={{ textShadow: "0 0 50px rgba(255,255,255,0.25)" }}
  >
    {HERO_HEADLINE_LINE1}
  </span>
  <span
    className="block font-normal font-accent text-accent-cyan"
    style={{ fontSize: "clamp(50px, 7vw, 90px)"}}
  >
    {HERO_HEADLINE_LINE2}
  </span>
  <span
    className="block font-normal font-accent text-accent-cyan"
    style={{ fontSize: "clamp(50px, 7vw, 90px)" }}
  >
    {HERO_HEADLINE_ACCENT}
  </span>
</motion.h1>

          <motion.p
            className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed max-w-[640px]"
            initial={prefersReduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          >
            {HERO_BODY}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 sm:gap-5 w-full sm:w-auto"
            initial={prefersReduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.3, ease: EASE }}
          >
            <Link
              href="#apply"
              className="flex items-center justify-center gap-[10px] w-full sm:w-[280px] p-5 rounded-[5px] border border-[#EC5793] bg-[#EB3D7B] text-white font-label font-bold text-eyebrow uppercase tracking-wider shadow-[0_0_50px_0_rgba(235,62,124,0.50)] transition-all hover:brightness-110"
            >
              {HERO_CTA_PRIMARY}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                className="shrink-0"
                aria-hidden="true"
              >
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>

            <Link
              href="#numbers"
              className="flex items-center justify-center gap-[10px] w-full sm:w-[280px] p-5 rounded-[5px] border border-[#00E5FF] bg-transparent text-[#00E5FF] font-label font-bold text-eyebrow uppercase tracking-wider transition-colors duration-200 hover:bg-[#00E5FF] hover:text-white"
            >
              {HERO_CTA_SECONDARY}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
