"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import SpecPill from "@/components/primitives/SpecPill";

const SPEC_PILLS = [
  "41 LEDS",
  "10 Colors",
  "3 Modes",
  "800 mAh",
  "USB-C",
  "510 Thread",
];

const HERO_IMAGE_EXISTS = true; // TODO: set to true once /images/hero/hero-main.jpg is added

function useRevealVariants(prefersReduced: boolean | null) {
  return {
    hidden: prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: prefersReduced
        ? { duration: 0 }
        : { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const },
    }),
  };
}

export default function Hero() {
  const prefersReduced = useReducedMotion();
  const variants = useRevealVariants(prefersReduced);

  return (
    <section
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background-primary"
      aria-label="Hero"
    >
      {/* Background image or fallback glow */}
      {HERO_IMAGE_EXISTS ? (
        <div className="absolute inset-0 z-0">
          {/* TODO: replace placeholder */}
          <Image
            src="images/home/hero-lifestyle.png"
            alt="Litsaber glowing at a festival"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      ) : (
        /* Fallback: atmospheric radial glow pool */
        <div
          className="absolute inset-0 z-0 bg-background-primary"
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-gradient-cta-radial opacity-60" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-accent-purple opacity-10 blur-[160px]" />
          <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full bg-cta opacity-10 blur-[120px]" />
        </div>
      )}

      {/* Hero bottom-fade gradient */}
      <div
        className="absolute bottom-0 left-0 right-0 h-64 z-10 bg-hero-fade pointer-events-none"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center text-center px-container-mobile lg:px-container w-full max-w-container mx-auto">

        {/* Headline */}
        <motion.h1
          className="font-display text-h1 lg:text-display-lg text-text-primary leading-none tracking-tight mb-md lg:mb-lg drop-shadow-[0_0_100px_rgba(240,240,245,1)]"
          variants={variants}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          HIGHLIGHT THE{" "}
          <span className="font-accent text-accent-cyan drop-shadow-[0_0_50px_rgba(0,229,255,0.5)]">
            NIGHT
          </span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          className="font-body text-body text-text-secondary max-w-xl mb-lg lg:mb-xl"
          variants={variants}
          initial="hidden"
          animate="visible"
          custom={0.1}
        >
          Interactive 510 battery built for festivals, nightlife, and the
          moments worth showing off.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row gap-md w-full sm:w-auto mb-xl"
          variants={variants}
          initial="hidden"
          animate="visible"
          custom={0.2}
        >
          <Link
            href="/shop/litsaber-og"
            className="
              group relative flex items-center justify-center
              px-xl py-md rounded-sm
              border border-border-cta bg-surface-tint-cta text-text-primary
              font-label text-label tracking-widest uppercase
              shadow-glow-cta
              transition-all duration-200 ease-in-out
              hover:-translate-y-px hover:shadow-glow-cta-hover
              w-full sm:w-auto
            "
          >
            GET YOURS — $59.99
          </Link>

          <Link
            href="#three-modes"
            className="
              group flex items-center justify-center
              px-xl py-md rounded-sm
              border border-border-accent bg-transparent text-accent-cyan
              font-label text-label tracking-widest uppercase
              transition-all duration-200 ease-in-out
              hover:-translate-y-px hover:bg-surface-tint-cyan hover:shadow-glow-cyan
              w-full sm:w-auto
            "
          >
            SEE IT IN MOTION
          </Link>
        </motion.div>

        {/* Glow tagline */}
        <motion.p
          className="font-label text-eyebrow text-accent-cyan tracking-widest mb-lg drop-shadow-[0_0_50px_rgba(0,229,255,0.5)]"
          variants={variants}
          initial="hidden"
          animate="visible"
          custom={0.3}
        >
          Glowstick meets 510 battery. This is Litsaber.
        </motion.p>

        {/* Spec pills */}
        <motion.div
          className="grid grid-cols-3 sm:grid-cols-6 gap-sm justify-center"
          variants={variants}
          initial="hidden"
          animate="visible"
          custom={0.35}
        >
          {SPEC_PILLS.map((label) => (
            <SpecPill key={label} label={label} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
