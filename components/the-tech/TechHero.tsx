"use client";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  HERO_HEADLINE_LINE1,
  HERO_HEADLINE_ACCENT,
  HERO_BODY,
  HERO_CTA,
  HERO_IMAGE_SRC_DESKTOP,
  HERO_IMAGE_SRC_MOBILE,
  HERO_IMAGE_ALT,
} from "./the-tech.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const NAVBAR_LEFT =
  "max(clamp(20px, 5vw, 70px), calc((100vw - 1440px) / 2 + clamp(20px, 5vw, 70px)))";

export default function TechHero() {
  const prefersReduced = useReducedMotion();
  const scrollToInhale = () => {
    document.getElementById("inhale")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative overflow-hidden w-full min-h-screen bg-[linear-gradient(180deg,#000_0%,#150C2D_100%)]"
      aria-label="Built to be seen"
    >
      {/* Full-width grid — no max-w cap, so the image can reach the right edge.
          Image column widened to 45% to absorb the middle gap. */}
      <div className="flex flex-col h-full lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(380px,38%)] lg:items-stretch lg:gap-x-16">
        {/* Left — text column. paddingLeft uses NAVBAR_LEFT to align the text's left edge to the navbar. */}
        <div
          className="px-content lg:pr-0 lg:self-center lg:pb-16 py-16"
          style={{ paddingLeft: NAVBAR_LEFT }}
        >
          {/* Inner content — capped readable copy width, left-aligned (matches About) */}
          <div className="flex flex-col justify-center gap-6 max-w-[700px]">
            <motion.h1
              className="block font-display font-bold text-text-primary leading-none"
              style={{ fontSize: "clamp(55px, 7vw, 100px)" }}
              initial={prefersReduced ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.1, ease: EASE }}
            >
              {HERO_HEADLINE_LINE1}
              <span
                className="block font-accent font-normal text-accent-cyan leading-none"
                style={{ fontSize: "clamp(50px, 7vw, 90px)" }}
              >
                {HERO_HEADLINE_ACCENT}
              </span>
            </motion.h1>

            <motion.p
              className="font-body text-subhead text-text-secondary leading-relaxed max-w-[720px]"
              initial={prefersReduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            >
              {HERO_BODY}
            </motion.p>

            <motion.div
              initial={prefersReduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
            >
              <button
                onClick={scrollToInhale}
                className="flex flex-col items-center gap-2 group"
                aria-label="Scroll to next section"
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
        </div>

        {/* Hero image — inset rounded card on mobile, fixed 810px flush-right on desktop */}
        <motion.div
          className="relative mt-10 mx-[20px] aspect-[3/4] overflow-hidden lg:mt-0 lg:mx-0 lg:self-start lg:h-[640px] lg:aspect-auto lg:rounded-none"
          initial={prefersReduced ? false : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
        >
          {/* Mobile crop — visible below lg */}
          <Image
            src={HERO_IMAGE_SRC_MOBILE}
            alt={HERO_IMAGE_ALT}
            fill
            sizes="(min-width: 1024px) 0px, 100vw"
            className="object-cover object-center lg:hidden"
            priority
          />
          {/* Desktop crop — visible at lg and up */}
          <Image
            src={HERO_IMAGE_SRC_DESKTOP}
            alt={HERO_IMAGE_ALT}
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="hidden object-cover object-center lg:block"
            priority
          />
        </motion.div>
      </div>
    </section>
  );
}