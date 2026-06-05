"use client";

import { motion, useReducedMotion } from "framer-motion";
import { HERO_HEADLINE_LINE1, HERO_HEADLINE_ACCENT, HERO_BODY } from "./contact.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function ContactHero() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      className="relative isolate overflow-hidden w-full"
      aria-label="Contact us"
      style={{ background: "#050510" }}
    >
      {/* Purple radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 80%, rgba(75,47,129,0.55) 0%, transparent 70%)",
        }}
      />
      {/* Ambient cyan top */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[300px]"
        style={{
          background:
            "radial-gradient(ellipse 60% 100% at 50% 0%, rgba(0,229,255,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="mx-auto w-full max-w-[1250px] px-[20px] lg:px-[60px] py-[100px] lg:py-[140px]">
        <div className="flex flex-col items-center text-center gap-6 max-w-[860px] mx-auto">
          <motion.h1
            className="font-display font-bold uppercase leading-[1.1]"
            initial={prefersReduced ? false : { opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <span
              className="block text-white"
              style={{
                fontSize: "clamp(55px, 7vw, 100px)",
                textShadow: "0 0 50px rgba(255,255,255,0.75)",
                WebkitTextStrokeWidth: "1px",
                WebkitTextStrokeColor: "#000",
              }}
            >
              {HERO_HEADLINE_LINE1}
            </span>
            <span
              className="block text-white"
              style={{
                fontSize: "clamp(80px, 10vw, 150px)",
                lineHeight: "1",
                textShadow: "0 0 50px rgba(255,255,255,0.75)",
                WebkitTextStrokeWidth: "1px",
                WebkitTextStrokeColor: "#000",
              }}
            >
              {HERO_HEADLINE_ACCENT}
            </span>
          </motion.h1>

          <motion.p
            className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed max-w-[580px]"
            initial={prefersReduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          >
            {HERO_BODY}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
