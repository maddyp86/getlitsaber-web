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

const BOTTOM_HEIGHT = 900;

export default function HeroDesktop({ className }: HeroDesktopProps) {
  const variants = useRevealVariants();

  return (
    <section
      className={`relative w-full flex flex-col items-center bg-background-primary${className ? ` ${className}` : ""}`}
      aria-label="Hero"
    >
      {/* ── UPPER ZONE: lifestyle scene ───────────────────────── */}
      <div className="relative w-full h-[55vh]">
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

        {/* Content group — 150px from top, flex-col gap-[20px] */}
        <div className="absolute inset-x-0 top-[150px] z-20 flex flex-col items-center gap-[20px] w-full">
          <motion.h1
            className="
              text-center px-container w-full
              font-display font-bold text-display-lg text-text-primary
              leading-none tracking-tight whitespace-nowrap
              drop-shadow-[0_0_100px_rgba(240,240,245,1)]
              max-w-[1118px] mx-auto
            "
            variants={variants}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            {HEADLINE_DESKTOP.white}{" "}
            <span className="font-accent font-normal text-accent-cyan text-display-accent drop-shadow-[0_0_50px_rgba(0,229,255,0.5)]">
              {HEADLINE_DESKTOP.cyan}
            </span>
          </motion.h1>

          <motion.p
            className="
              text-center px-container
              font-body text-subhead text-text-secondary
              max-w-[736px]
            "
            variants={variants}
            initial="hidden"
            animate="visible"
            custom={0.1}
          >
            {SUBHEADLINE}
          </motion.p>

          <motion.div
            className="flex flex-row gap-[20px] justify-center"
            variants={variants}
            initial="hidden"
            animate="visible"
            custom={0.2}
          >
            <Link
              href={CTA_PRIMARY.href}
              className="
                flex items-center justify-center
                px-xl py-md rounded-sm w-[329px]
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
                px-xl py-md rounded-sm w-[329px]
                border border-border-accent bg-transparent text-accent-cyan
                font-label text-label tracking-widest uppercase
                transition-all duration-200 ease-in-out
                hover:-translate-y-px hover:bg-surface-tint-cyan hover:shadow-glow-cyan
              "
            >
              {CTA_SECONDARY.label}
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ── LOWER ZONE: Bottom.png background + tagline/pills overlay ── */}
      <div className="relative w-full" style={{ height: BOTTOM_HEIGHT }}>
        {/* Full-bleed device + starfield background */}
        <Image
          src="/images/home/Bottom.png"
          alt="Litsaber device floating against a starfield"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Overlay grid: tagline top, pills bottom, device shows through the middle */}
        <div className="absolute inset-0 z-10 flex flex-col justify-between py-[80px] items-center">
          <motion.p
            className="
              text-center px-container
              font-display font-bold text-display-lg uppercase leading-tight
              text-text-primary w-full max-w-[1118px]
              drop-shadow-[0_0_50px_rgba(0,229,255,0.5)]
            "
            variants={variants}
            initial="hidden"
            animate="visible"
            custom={0.3}
          >
            {TAGLINE}
          </motion.p>

          <motion.div
            className="flex flex-row gap-md justify-center"
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
    </section>
  );
}
