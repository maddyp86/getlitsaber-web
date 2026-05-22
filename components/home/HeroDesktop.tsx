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
      className={`relative w-full min-h-screen flex flex-col items-center justify-center bg-background-primary${className ? ` ${className}` : ""}`}
      aria-label="Hero"
    >
      {/* Full-bleed background — lifestyle scene fills the full viewport, device/starfield below */}
      <div className="absolute inset-x-0 top-0 z-0 overflow-hidden">
        {/* Lifestyle scene — fills full viewport height so crowd fills screen behind content */}
        <div
          className="relative w-full overflow-hidden"
          style={{ height: "100vh" }}
        >
          <ResponsiveImage
            mobileSrc="/images/home/hero-lifestyle-mobile.jpg"
            desktopSrc="/images/home/hero-lifestyle.jpg"
            alt="Litsaber lighting up a festival crowd at night"
            breakpoint="1024px"
            priority
            className="absolute inset-0 object-cover object-top w-full h-full"
          />
          <div
            className="absolute inset-0 bg-hero-fade pointer-events-none"
            aria-hidden="true"
          />
        </div>

        {/* Device + starfield — spec: 1440×879, aspect-ratio 77/47 */}
        <div
          className="relative w-full overflow-hidden"
          style={{ height: "879px", aspectRatio: "77/47" }}
        >
          <Image
            src="/images/home/litsaber-hero-image.png"
            alt="Litsaber device floating against a starfield"
            fill
            priority
            sizes="1440px"
            className="object-cover object-center"
          />

          {/* Anchor zone — absolutely overlaid on the starfield; tagline at top, pills pinned to bottom */}
          <div
            className="absolute inset-0 z-10 flex flex-col justify-between items-center"
            style={{ padding: "100px" }}
          >
            <motion.p
              className="
                text-center w-full
                font-subhead font-bold text-h2 uppercase leading-tight
                text-text-primary
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
      </div>

      {/* Content group — vertically centered by parent justify-center; mt-navbar keeps it clear of the fixed bar */}
      <div className="relative z-20 mt-navbar flex flex-col items-center gap-[20px] w-full">
        <motion.h1
          className="
            text-center px-container w-full
            leading-none tracking-tight
            max-w-[1118px]
          "
          variants={variants}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <span className="block font-display font-bold text-display-lg text-text-primary drop-shadow-[0_0_100px_rgba(240,240,245,1)]">
            {HEADLINE_DESKTOP.white}
          </span>
          <span className="block font-accent font-normal text-display-accent text-accent-cyan drop-shadow-[0_0_50px_rgba(0,229,255,0.5)]">
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
    </section>
  );
}
