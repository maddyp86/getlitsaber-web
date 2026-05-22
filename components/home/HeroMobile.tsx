"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import SpecPill from "@/components/primitives/SpecPill";
import ResponsiveImage from "@/components/primitives/ResponsiveImage";
import { useRevealVariants } from "@/lib/useRevealVariants";
import {
  HEADLINE_MOBILE,
  SUBHEADLINE,
  CTA_PRIMARY,
  CTA_SECONDARY,
  TAGLINE,
  SPEC_PILLS,
} from "./hero.content";

interface HeroMobileProps {
  className?: string;
}

export default function HeroMobile({ className }: HeroMobileProps) {
  const variants = useRevealVariants();

  return (
    <section
      className={`relative w-full flex flex-col items-center bg-background-primary pt-section-y-mobile${className ? ` ${className}` : ""}`}
      aria-label="Hero"
    >
      {/* Two-layer background */}
      <div className="absolute inset-x-0 top-0 z-0 overflow-hidden">
        {/* Lifestyle scene — mobile aspect ratio */}
        <div className="relative w-full aspect-[41/69]">
          <ResponsiveImage
            mobileSrc="/images/home/hero-lifestyle-mobile.jpg"
            desktopSrc="/images/home/hero-lifestyle.jpg"
            alt="Litsaber lighting up a festival crowd at night"
            breakpoint="1024px"
            priority
          />
          <div
            className="absolute inset-0 bg-hero-fade pointer-events-none"
            aria-hidden="true"
          />
        </div>

        {/* Device + starfield */}
        <div className="relative w-full h-[600px] overflow-hidden">
          {/* intentional 112% bleed to fill narrow viewports without cropping the device render */}
          <div className="absolute inset-0 w-[112%] left-1/2 -translate-x-1/2">
            <Image
              src="/images/home/litsaber-hero-image.png"
              alt="Litsaber device floating against a starfield"
              fill
              priority
              sizes="112vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>

      {/* Content column */}
      <div className="relative z-20 flex flex-col items-center w-full px-container-mobile">
        {/* Headline — two structural lines with different cyan grouping */}
        <motion.h1
          className="text-center mb-md w-full"
          variants={variants}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <span className="block font-display font-bold text-h2 text-text-primary leading-none tracking-tight drop-shadow-[0_0_100px_rgba(240,240,245,1)]">
            {HEADLINE_MOBILE.white}
          </span>
          <span className="block font-accent font-normal text-h2 text-accent-cyan leading-none drop-shadow-[0_0_50px_rgba(0,229,255,0.5)]">
            {HEADLINE_MOBILE.cyan}
          </span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          className="
            text-center mb-lg
            font-body text-body text-text-secondary
            max-w-xl
          "
          variants={variants}
          initial="hidden"
          animate="visible"
          custom={0.1}
        >
          {SUBHEADLINE}
        </motion.p>

        {/* CTAs — stacked full-width */}
        <motion.div
          className="flex flex-col gap-md mb-xl w-full"
          variants={variants}
          initial="hidden"
          animate="visible"
          custom={0.2}
        >
          <Link
            href={CTA_PRIMARY.href}
            className="
              flex items-center justify-center
              px-xl py-md rounded-sm w-full
              border border-border-cta bg-surface-tint-cta text-text-primary
              font-label text-label tracking-widest uppercase
              shadow-glow-cta
              transition-all duration-200 ease-in-out
              hover:-translate-y-px hover:shadow-glow-cta-hover
            "
          >
            {CTA_PRIMARY.label}
          </Link>

          <Link
            href={CTA_SECONDARY.href}
            className="
              flex items-center justify-center
              px-xl py-md rounded-sm w-full
              border border-border-accent bg-transparent text-accent-cyan
              font-label text-label tracking-widest uppercase
              transition-all duration-200 ease-in-out
              hover:-translate-y-px hover:bg-surface-tint-cyan hover:shadow-glow-cyan
            "
          >
            {CTA_SECONDARY.label}
          </Link>
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="
            text-center mx-auto mt-xl mb-xl
            font-subhead font-bold text-h3 uppercase leading-tight
            text-text-primary w-full
            drop-shadow-[0_0_50px_rgba(0,229,255,0.5)]
          "
          variants={variants}
          initial="hidden"
          animate="visible"
          custom={0.3}
        >
          {TAGLINE}
        </motion.p>

        {/* Spec pills — 3×2 grid per mobile spec */}
        <motion.div
          className="grid grid-cols-3 gap-sm justify-center pb-section-y-mobile"
          variants={variants}
          initial="hidden"
          animate="visible"
          custom={0.4}
        >
          {SPEC_PILLS.map((label) => (
            <SpecPill key={label} label={label} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
