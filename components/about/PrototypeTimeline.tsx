"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { PROTOTYPES } from "./about.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function PrototypeTimeline() {
  const prefersReduced = useReducedMotion();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const go = (next: number) => {
    setDirection(next > current ? 1 : -1);
    setCurrent(next);
  };

  const prev = () => go(current === 0 ? PROTOTYPES.length - 1 : current - 1);
  const next = () => go(current === PROTOTYPES.length - 1 ? 0 : current + 1);

  const variants = {
    enter: (dir: number) => ({
      x: prefersReduced ? 0 : dir * 60,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: prefersReduced ? 0 : dir * -60,
      opacity: 0,
    }),
  };

  return (
    <div className="mt-10 mb-12">
      {/* Header row — cyan bottom border */}
      <div className="flex items-center justify-between pb-5 mb-8 border-b border-[rgba(0,229,255,0.20)]">
        <span className="font-label text-accent-cyan text-eyebrow tracking-[0.18em] uppercase">
          6 YEARS OF PROTOTYPES
        </span>
        <span className="font-label text-eyebrow tracking-[0.18em] uppercase text-text-muted">
          2019 — 2024
        </span>
      </div>

      {/* Desktop: horizontal scroller, larger fixed-width cards */}
      <div className="hidden lg:block -mx-[60px] px-[60px] overflow-x-auto scrollbar-thin">
        <div className="flex gap-6 w-max pb-4">
          {PROTOTYPES.map((proto, i) => (
            <motion.div
              key={proto.version}
              className="flex w-[300px] shrink-0 flex-col gap-3"
              initial={prefersReduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
            >
              {/* Text above image */}
              <div className="flex flex-col gap-1">
                <span className="font-display font-bold text-accent-cyan text-[14px] tracking-[0.04em] uppercase">
                  {proto.version}
                </span>
                <h4 className="font-label font-bold text-white text-[15px] leading-tight">
                  {proto.title}
                </h4>
                <p className="font-body text-[13px] text-text-muted leading-relaxed">
                  {proto.blurb}
                </p>
              </div>

              {/* Image — bigger, fixed ratio, cyan border (no year overlay) */}
              <div className="relative mt-auto aspect-[200/339] overflow-hidden rounded-[10px] border border-[rgba(0,229,255,0.20)] bg-surface-card">
                <Image
                  src={proto.imageSrc}
                  alt={proto.imageAlt}
                  fill
                  sizes="300px"
                  className="object-cover object-center"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile: single-card stepper */}
      <div className="lg:hidden flex flex-col gap-4">
        {/* Segmented progress bar */}
        <div className="flex gap-1.5">
          {PROTOTYPES.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className="h-[3px] flex-1 rounded-full transition-colors duration-300"
              style={{ background: i === current ? "#00E5FF" : "rgba(255,255,255,0.15)" }}
              aria-label={`Go to prototype ${i + 1}`}
            />
          ))}
        </div>

        {/* Card */}
        <div className="relative overflow-hidden" style={{ minHeight: 480 }}>
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: EASE }}
              className="flex flex-col gap-4"
            >
              {/* Image (no year overlay — burned into photo) */}
              <div className="relative w-full aspect-[200/339] overflow-hidden rounded-[10px] border border-[rgba(0,229,255,0.20)] bg-surface-card">
                <Image
                  src={PROTOTYPES[current].imageSrc}
                  alt={PROTOTYPES[current].imageAlt}
                  fill
                  sizes="100vw"
                  className="object-cover object-center"
                />
              </div>

              {/* Text */}
              <div className="flex flex-col gap-2">
                <span className="font-display font-bold text-accent-cyan text-[13px] tracking-[0.04em] uppercase">
                  {PROTOTYPES[current].version}
                </span>
                <h4
                  className="font-label font-bold text-white leading-tight"
                  style={{ fontSize: "clamp(16px, 2vw, 20px)" }}
                >
                  {PROTOTYPES[current].title}
                </h4>
                <p className="font-body text-body-sm text-text-secondary leading-relaxed">
                  {PROTOTYPES[current].blurb}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Prev / Next */}
        <div className="flex items-center justify-between mt-2">
          <button
            onClick={prev}
            className="flex items-center gap-2 font-label text-eyebrow text-text-muted uppercase tracking-[0.15em] hover:text-accent-cyan transition-colors"
            aria-label="Previous prototype"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            PREV
          </button>
          <span className="font-label text-eyebrow text-text-muted tracking-[0.1em]">
            {current + 1} / {PROTOTYPES.length}
          </span>
          <button
            onClick={next}
            className="flex items-center gap-2 font-label text-eyebrow text-text-muted uppercase tracking-[0.15em] hover:text-accent-cyan transition-colors"
            aria-label="Next prototype"
          >
            NEXT
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}