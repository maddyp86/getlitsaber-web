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

export default function TechHero() {
  const prefersReduced = useReducedMotion();

  const scrollToInhale = () => {
    document.getElementById("inhale")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative overflow-hidden w-full bg-[linear-gradient(180deg,#000_0%,#150C2D_100%)]"
      aria-label="Built to be seen"
    >
      <div className="mx-auto w-full max-w-[1250px]">
      <div className="flex flex-col lg:grid lg:grid-cols-2 lg:items-stretch">

        {/* Text block — owns the padding now */}
      <div className="flex flex-col items-center text-center lg:items-start lg:text-left justify-center gap-6 px-[20px] py-16 lg:py-24 lg:pl-[60px] lg:pr-16 lg:max-w-[600px]">

    <motion.h1
  className="block font-display font-bold text-display-lg text-center lg:text-left text-text-primary leading-none"
  style={{ fontSize: "clamp(50px, 6.5vw, 75px)" }}
  initial={prefersReduced ? false : { opacity: 0, y: 24 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.75, delay: 0.1, ease: EASE }}
>
  {HERO_HEADLINE_LINE1}
  <span
    className="block font-accent font-normal text-center lg:text-left text-display-accent text-accent-cyan leading-none"
    style={{ fontSize: "clamp(45px, 6.5vw, 75px)" }}
  >
    {HERO_HEADLINE_ACCENT}
  </span>
</motion.h1>

          <motion.p
            className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed"
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

        {/* Hero image — inset rounded card on mobile, full-bleed right on desktop */}
  <motion.div
  className="relative mt-10 mx-[20px] aspect-[4/5] overflow-hidden lg:mt-0 lg:mx-0 lg:aspect-auto lg:rounded-none"
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
    className="object-cover object-center lg:hidden "
    priority
  />
  {/* Desktop crop — visible at lg and up */}
  <Image
    src={HERO_IMAGE_SRC_DESKTOP}
    alt={HERO_IMAGE_ALT}
    fill
    sizes="(min-width: 1024px) 50vw, 0px"
    className="hidden object-cover object-center lg:block"
    priority
  />
</motion.div>
      </div>
      </div>
    </section>
  );
}