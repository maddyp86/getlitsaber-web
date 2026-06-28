"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import SpecPill from "@/components/primitives/SpecPill";
import ResponsiveImage from "@/components/primitives/ResponsiveImage";
import { useRevealVariants } from "@/lib/useRevealVariants";
import { usePlayWhenVisible } from "@/lib/usePlayWhenVisible";
import { useDiag } from "@/components/diag/DiagContext";
import { mediaUrl } from "@/lib/media";
import {
  HEADLINE_MOBILE,
  SUBHEADLINE,
  CTA_PRIMARY,
  CTA_SECONDARY,
  TAGLINE,
  SPEC_PILLS,
  HERO_VIDEO_SRC,
  HERO_POSTER_SRC,
} from "./hero.content";

interface HeroMobileProps {
  className?: string;
}

export default function HeroMobile({ className }: HeroMobileProps) {
  const variants = useRevealVariants();
  const prefersReduced = useReducedMotion();
  const setVideoRef = usePlayWhenVisible();
  const { novideo } = useDiag();

  return (
    <section
      className={`relative w-full flex flex-col items-center bg-background-primary${className ? ` ${className}` : ""}`}
      aria-label="Hero"
    >
      {/* Lifestyle scene — absolute background, covers only the top zone */}
      <div className="absolute inset-x-0 top-0 z-0 h-[600px] overflow-hidden">
        <ResponsiveImage
          mobileSrc={mediaUrl("home/hero-lifestyle-mobile.jpg")}
          desktopSrc={mediaUrl("home/hero-lifestyle.jpg")}
          alt="Litsaber lighting up a festival crowd at night"
          breakpoint="1024px"
          priority
        />
        <div
          className="absolute inset-0 bg-hero-fade pointer-events-none"
          aria-hidden="true"
        />
      </div>

      {/* Content group — navbar height + xl breathing room = ~140px, close to Figma 150px */}
      <div className="relative z-20 pt-navbar mt-20 flex flex-col items-center gap-[20px] w-full px-content">
        <motion.h1
          className="text-center w-full"
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

        <motion.p
          className="text-center font-body text-body text-text-secondary max-w-xl mb-6"
          variants={variants}
          initial="hidden"
          animate="visible"
          custom={0.1}
        >
          {SUBHEADLINE}
        </motion.p>

        <motion.div
          className="flex flex-col gap-[20px] w-full"
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
      </div>

      {/* Anchor zone — stacked flex column, black background, fixed dimensions per spec */}
      <div
        className="flex w-auto py-xl px-container-mobile flex-col justify-center items-center gap-[39px] flex-shrink-0 bg-black"
      >
        <motion.p
          className="
            text-center
            font-subhead font-bold text-h4 uppercase leading-tight
            text-text-primary w-full
            drop-shadow-[0_0_50px_rgba(0,229,255,0.5)]
          "
          style={{ height: "150px" }}
          variants={variants}
          initial="hidden"
          animate="visible"
          custom={0.3}
        >
          {TAGLINE}
        </motion.p>

        <motion.div
          className="relative w-full"
          style={{ aspectRatio: "375/227" }}
          variants={variants}
          initial="hidden"
          animate="visible"
          custom={0.35}
        >
          {prefersReduced || novideo ? (
            <Image
              src={HERO_POSTER_SRC}
              alt="Litsaber device"
              fill
              className="object-contain object-center"
            />
          ) : (
            <video
              ref={setVideoRef}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={HERO_POSTER_SRC}
              aria-hidden={true}
              className="absolute inset-0 w-full h-full object-contain object-center"
            >
              <source src={HERO_VIDEO_SRC} type="video/mp4" />
            </video>
          )}
        </motion.div>

        <motion.div
          className="flex flex-col w-full"
          style={{ gap: "20px", alignSelf: "stretch" }}
          variants={variants}
          initial="hidden"
          animate="visible"
          custom={0.4}
        >
          {[SPEC_PILLS.slice(0, 3), SPEC_PILLS.slice(3)].map((row, i) => (
            <div
              key={i}
              style={{ display: "flex", alignItems: "center", gap: "20px", alignSelf: "stretch" }}
            >
              {row.map((label) => (
                <SpecPill key={label} label={label} />
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
