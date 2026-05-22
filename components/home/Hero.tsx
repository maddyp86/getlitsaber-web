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

// Pixel offsets pulled from Figma node 3218:1628 (1440×1460 desktop hero).
// The hero is the only pixel-perfect layout on the site, so these values
// live inline rather than in tokens.json.

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
      className="relative w-full min-h-screen lg:min-h-[1460px] flex flex-col items-center overflow-hidden bg-background-primary pt-section-y-mobile lg:pt-0"
      aria-label="Hero"
    >
      {/* Top background — lifestyle scene, gradient-fades to dark at the seam */}
      <div className="absolute inset-x-0 top-0 h-[300px] lg:h-[585px] z-0">
        <Image
          src="/images/home/hero-lifestyle.jpg"
          alt="Litsaber lighting up a festival crowd at night"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          className="absolute inset-0 bg-hero-fade pointer-events-none"
          aria-hidden="true"
        />
      </div>

      {/* Bottom background — starfield + horizontal device render */}
      <div className="absolute inset-x-0 top-[296px] lg:top-[581px] h-[600px] lg:h-[879px] z-0 overflow-hidden">
        <div className="absolute inset-0 w-[112%] left-1/2 -translate-x-1/2">
          <Image
            src="/images/home/litsaber-hero-image.png"
            alt="Litsaber device floating against a starfield"
            fill
            priority
            sizes="(min-width: 1024px) 112vw, 100vw"
            className="object-cover object-center"
          />
        </div>
      </div>

      {/* Headline */}
      <motion.h1
        className="
          relative z-20 text-center px-container-mobile mb-md
          font-display text-h2 sm:text-h1 text-text-primary
          leading-none tracking-tight
          drop-shadow-[0_0_100px_rgba(240,240,245,1)]
          lg:absolute lg:left-1/2 lg:top-[250px]
          lg:-translate-x-1/2 lg:-translate-y-1/2
          lg:text-display-lg lg:px-0 lg:w-[1118px] lg:mb-0
        "
        variants={variants}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        HIGHLIGHT THE{" "}
        <span className="font-accent text-accent-cyan lg:text-display-accent drop-shadow-[0_0_50px_rgba(0,229,255,0.5)]">
          NIGHT
        </span>
      </motion.h1>

      {/* Sub-headline */}
      <motion.p
        className="
          relative z-20 text-center px-container-mobile mb-lg
          font-body text-body lg:text-subhead text-text-secondary
          max-w-xl lg:max-w-[736px]
          lg:absolute lg:left-1/2 lg:top-[372.5px]
          lg:-translate-x-1/2 lg:-translate-y-1/2
          lg:px-0 lg:mb-0
        "
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
        className="
          relative z-20 flex flex-col sm:flex-row gap-md sm:gap-xl mb-xl
          w-full sm:w-auto px-container-mobile sm:px-0
          lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:top-[457px] lg:mb-0
        "
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
            w-full sm:w-[329px]
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
            w-full sm:w-[329px]
          "
        >
          SEE IT IN MOTION
        </Link>
      </motion.div>

      {/* Glow tagline — sits over the starfield half */}
      <motion.p
        className="
          relative z-20 text-center px-container-mobile mt-xl mb-xl
          font-subhead font-bold text-h3 lg:text-h2 uppercase
          text-text-primary max-w-[1200px]
          drop-shadow-[0_0_50px_rgba(0,229,255,0.5)]
          lg:absolute lg:left-1/2 lg:top-[720px]
          lg:-translate-x-1/2 lg:-translate-y-1/2
          lg:px-0 lg:mt-0 lg:mb-0
        "
        variants={variants}
        initial="hidden"
        animate="visible"
        custom={0.3}
      >
        Glowstick meets 510 battery. This is Litsaber.
      </motion.p>

      {/* Spec pills */}
      <motion.div
        className="
          relative z-20 grid grid-cols-3 sm:grid-cols-6 gap-sm justify-center
          px-container-mobile sm:px-0 mt-xl
          lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:top-[1344px]
          lg:flex lg:gap-md lg:mt-0
        "
        variants={variants}
        initial="hidden"
        animate="visible"
        custom={0.4}
      >
        {SPEC_PILLS.map((label) => (
          <SpecPill key={label} label={label} />
        ))}
      </motion.div>
    </section>
  );
}