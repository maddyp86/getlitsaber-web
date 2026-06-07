"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import SpecPill from "@/components/primitives/SpecPill";
import ResponsiveImage from "@/components/primitives/ResponsiveImage";
import { useRevealVariants } from "@/lib/useRevealVariants";
import {
  HEADLINE_DESKTOP,
  SUBHEADLINE,
  CTA_PRIMARY,
  CTA_SECONDARY,
  TAGLINE,
  SPEC_PILLS,
} from "./hero.content";

interface HeroDesktopProps {
  className?: string;
}

export default function HeroDesktop({ className }: HeroDesktopProps) {
  const variants = useRevealVariants();

  return (
    <section
      className={`relative w-full bg-background-primary${className ? ` ${className}` : ""}`}
      style={{ minHeight: "1513px" }}
      aria-label="Hero"
    >
      {/* Lifestyle band — 700px, transparent navbar overlaps the top 90px */}
      <div className="absolute inset-x-0 top-0 z-0 overflow-hidden" style={{ height: "700px" }}>
        <ResponsiveImage
          mobileSrc="/images/home/hero-lifestyle-mobile.jpg"
          desktopSrc="/images/home/hero-lifestyle.jpg"
          alt="Litsaber lighting up a festival crowd at night"
          breakpoint="1024px"
          priority
          className="absolute inset-0 object-cover object-top w-full h-full"
        />
  {/* SINGLE seamless gradient — top to bottom */}
  <div
    className="absolute inset-0 pointer-events-none"
    style={{ 
      background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 50%, #000 100%)" 
    }}
    aria-hidden="true"
  />
</div>

      {/* Device + starfield — begins at y=634, overlapping the lifestyle fade by ~66px */}
      <div
        className="absolute inset-x-0 z-0 overflow-hidden"
        style={{ top: "634px", height: "879px" }}
      >
        <Image
          src="/images/home/litsaber-hero-image.png"
          alt="Litsaber device floating against a starfield"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Tagline + spec pills anchored within the starfield zone */}
        <div
          className="absolute w-max-[1250px] inset-0 z-10 flex flex-col justify-between items-center"
          style={{ padding: "100px" }}
        >
          <motion.p
            className="text-center w-full font-subhead font-bold text-[45px] uppercase text-text-primary drop-shadow-[0_0_50px_rgba(0,229,255,0.5)]"
            variants={variants}
            initial="hidden"
            animate="visible"
            custom={0.3}
          >
            {TAGLINE}
          </motion.p>

          <motion.div
            className="flex flex-row gap-md justify-center w-full"
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
      </div>

      {/* Content group — Figma: top 166px, centered, 708px wide, flex-col gap-20px */}
      {/* Soft radial scrim behind text only for readability against the brighter image */}
      <div
        className="absolute left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-[20px]"
        style={{
          top: "166px",
          width: "708px",
          background: "radial-gradient(ellipse 80% 90% at 50% 40%, rgba(0,0,0,0.35) 0%, transparent 100%)",
        }}
      >
        <motion.h1
          className="text-center w-full leading-[120px] tracking-tight"
          variants={variants}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <span className="block font-display font-bold text-display-lg text-text-primary drop-shadow-[0_0_100px_rgba(255,255,255,0.75)]">
            {HEADLINE_DESKTOP.white}
          </span>
          <span className="block font-accent font-normal text-display-accent text-accent-cyan drop-shadow-[0_0_50px_rgba(0,229,255,0.5)]">
            {HEADLINE_DESKTOP.cyan}
          </span>
        </motion.h1>

        <motion.p
          className="text-center w-full font-body text-subhead text-text-secondary mb-6"
          variants={variants}
          initial="hidden"
          animate="visible"
          custom={0.1}
        >
          {SUBHEADLINE}
        </motion.p>

        <motion.div
          className="flex flex-row gap-[50px] justify-center w-full"
          variants={variants}
          initial="hidden"
          animate="visible"
          custom={0.2}
        >
          {/* Primary CTA: pink border, cyan-tint bg, pink text */}
          <Link
            href={CTA_PRIMARY.href}
            className="flex items-center justify-center px-[20px] py-[20px] rounded-sm w-[329px] border border-border-cta bg-surface-tint-cyan text-cta font-label text-label tracking-widest uppercase shadow-glow-cta transition-all duration-200 ease-in-out hover:-translate-y-px hover:shadow-glow-cta-hover"
          >
            {CTA_PRIMARY.label}
          </Link>

          {/* Secondary CTA: grey border, white-tint bg, white text */}
          <Link
            href={CTA_SECONDARY.href}
            className="flex items-center justify-center px-[20px] py-[20px] rounded-sm w-[329px] border border-border-default bg-surface-tint-white text-text-primary font-label text-label tracking-widest uppercase transition-all duration-200 ease-in-out hover:-translate-y-px hover:border-border-accent hover:text-accent-cyan hover:shadow-glow-cyan"
          >
            {CTA_SECONDARY.label}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
