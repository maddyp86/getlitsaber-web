"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  KIT_HEADLINE_PART1,
  KIT_HEADLINE_ACCENT,
  KIT_BODY,
  KIT_ITEMS,
  RETAIL_KIT_IMAGE_SRC,
  RETAIL_KIT_IMAGE_ALT,
} from "./wholesale.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function renderEmphasis(text: string) {
  return text.split("**").map((segment, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-bold text-white">
        {segment}
      </strong>
    ) : (
      segment
    )
  );
}

export default function RetailKit() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      className="relative isolate overflow-hidden w-full bg-[#010101]"
      aria-label="You don't just get a case of pens"
    >
      {/* Ellipse glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 -z-10 h-[600px] w-[600px] rounded-full"
        style={{
          background: "rgba(0, 229, 255, 0.04)",
          filter: "blur(180px)",
        }}
      />

      <div className="mx-auto w-full max-w-[1250px] px-[20px] lg:px-[60px] py-[100px]">
        {/* Section headline */}
        <div className="flex flex-col mx-auto gap-4 mb-16">
          <motion.h2
            className="font-display text-center font-bold uppercase leading-[1.1]"
            style={{ fontSize: "clamp(38px, 5.5vw, 70px)" }}
            initial={prefersReduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.75, ease: EASE }}
          >
            <span
              className="text-white"
              style={{ textShadow: "0 0 50px rgba(0,229,255,0.6)" }}
            >
              {KIT_HEADLINE_PART1}
            </span>{" "}
            <span
              className="text-accent-cyan"
              style={{ textShadow: "0 0 50px rgba(0,229,255,0.5)" }}
            >
              {KIT_HEADLINE_ACCENT}
            </span>
          </motion.h2>

          <motion.p
            className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed max-w-[600px]"
            initial={prefersReduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
          >
            {KIT_BODY}
          </motion.p>
        </div>

        {/* Sticky scroll layout */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-16">
          {/* Left — sticky on desktop, static on mobile */}
          <motion.div
            className="w-full max-w-[420px] mx-auto lg:mx-0 lg:w-[420px] lg:flex-shrink-0 lg:sticky lg:top-[120px] lg:self-start aspect-[3/4] rounded-card overflow-hidden"
            initial={prefersReduced ? false : { opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.85, ease: EASE }}
          >
            {RETAIL_KIT_IMAGE_SRC ? (
              <Image
                src={RETAIL_KIT_IMAGE_SRC}
                alt={RETAIL_KIT_IMAGE_ALT}
                fill
                sizes="(min-width: 1024px) 420px, 100vw"
                className="object-cover object-center"
              />
            ) : (
              <div className="w-full h-full bg-surface-card flex flex-col items-center justify-center gap-3 border border-border-pill">
                {/* TODO: replace with retail kit product photo */}
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                  <rect x="8" y="12" width="24" height="20" rx="2" stroke="#444" strokeWidth="1.5" />
                  <path d="M14 12V9a6 6 0 0112 0v3" stroke="#444" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span className="font-label text-eyebrow text-text-muted tracking-widest uppercase text-center px-6">
                  Retail Kit Image
                </span>
              </div>
            )}
          </motion.div>

          {/* Right — scrolling list */}
          <div className="flex flex-col mt-10 lg:mt-0 lg:flex-1">
            {KIT_ITEMS.map((item, i) => (
              <motion.div
                key={item.num}
                className="flex flex-col gap-2 py-8 border-b border-[#1E1040] first:border-t"
                initial={prefersReduced ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
              >
                <span className="font-label text-eyebrow tracking-[0.2em] text-accent-cyan uppercase">
                  {item.num}
                </span>
                <h3
                  className="font-display font-bold text-white uppercase leading-tight"
                  style={{ fontSize: "clamp(18px, 2.2vw, 26px)" }}
                >
                  {item.title}
                </h3>
                <p className="font-body text-body-sm text-text-secondary leading-relaxed">
                  {item.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
