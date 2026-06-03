"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  HERO_EYEBROW,
  HERO_HEADLINE_LINE1,
  HERO_HEADLINE_ACCENT,
  HERO_BODY,
  HERO_CTA,
  HERO_IMAGE_SRC,
  HERO_IMAGE_ALT,
} from "./the-tech.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function TechHero() {
  const prefersReduced = useReducedMotion();

  const scrollToInhale = () => {
    document.getElementById("inhale")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
   <section
  className="relative w-full bg-[linear-gradient(180deg,#000_0%,#150C2D_100%)]"
  aria-label="Built to be seen"
>
    <div className="mx-auto w-full max-w-[1250px] px-[20px] lg:px-[50px] py-10 lg:py-24">
        {/* Mobile: text above image. Desktop: 2-col side by side */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16">

          {/* Text block */}
          <div className="flex flex-col gap-6 lg:flex-1 lg:max-w-[560px]">
            <motion.p
              className="font-label text-eyebrow tracking-[0.2em] uppercase text-accent-cyan"
              initial={prefersReduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              {HERO_EYEBROW}
            </motion.p>

<motion.h1
  className="block font-display font-bold text-display-lg text-text-primary leading-none"
  initial={prefersReduced ? false : { opacity: 0, y: 24 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.75, delay: 0.1, ease: EASE }}
>
  {HERO_HEADLINE_LINE1}
  <span
    className="block font-accent font-normal text-display-accent text-accent-cyan leading-none"
  >
    {HERO_HEADLINE_ACCENT}
  </span>
</motion.h1>

            <motion.p
              className="font-body text-[25px] lg:text-body text-text-secondary leading-relaxed"
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
                <span className="font-label font-bold text-eyebrow tracking-[0.2em] uppercase text-accent-cyan group-hover:text-white transition-colors">
                  {HERO_CTA}
                </span>
                {/* Down arrow */}
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-accent-cyan group-hover:translate-y-1 transition-transform"
                  aria-hidden="true"
                >
                  <path
                    d="M12 5v14M5 12l7 7 7-7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </motion.div>
          </div>

          {/* Hero image */}
          <motion.div
            className="relative mt-10 lg:mt-0 lg:flex-1 w-full aspect-[4/5] lg:aspect-[3/4] rounded-card overflow-hidden"
            initial={prefersReduced ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
          >
            {HERO_IMAGE_SRC ? (
              <Image
                src={HERO_IMAGE_SRC}
                alt={HERO_IMAGE_ALT}
                fill
                className="object-cover object-center"
                priority
              />
            ) : (
              <div className="w-full h-full bg-surface-card flex items-center justify-center rounded-card border border-border-pill">
                <span className="font-label text-eyebrow text-text-muted tracking-widest uppercase">
                  Hero Image
                </span>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
