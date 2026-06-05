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
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <span className="font-label text-accent-cyan text-eyebrow tracking-[0.18em] uppercase">
          6 YEARS OF PROTOTYPES
        </span>
        <span className="font-label text-eyebrow tracking-[0.18em] uppercase text-text-muted">
          2019 — 2024
        </span>
      </div>

      {/* Desktop: 6-column static row */}
      <div className="hidden lg:grid grid-cols-6 gap-4">
        {PROTOTYPES.map((proto, i) => (
          <motion.div
            key={proto.version}
            className="flex flex-col gap-3"
            initial={prefersReduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
          >
            {/* Text above image */}
            <div className="flex flex-col gap-1">
              <span className="font-label text-[10px] tracking-[0.15em] uppercase text-accent-cyan">
                {proto.version}
              </span>
              <h4 className="font-label font-bold text-white text-[13px] leading-tight">
                {proto.title}
              </h4>
              <p className="font-body text-[12px] text-text-muted leading-relaxed">
                {proto.blurb}
              </p>
            </div>

            {/* Image with year chip */}
            <div className="relative aspect-[3/4] rounded-md overflow-hidden bg-surface-card">
              <Image
                src={proto.imageSrc}
                alt={proto.imageAlt}
                fill
                sizes="(min-width: 1024px) 16vw, 0px"
                className="object-cover object-center"
              />
              <div className="absolute bottom-2 left-2">
                <span className="inline-block px-2 py-0.5 rounded-sm bg-[rgba(0,0,0,0.7)] backdrop-blur-sm font-label text-[10px] tracking-[0.12em] uppercase text-accent-cyan border border-[rgba(0,229,255,0.3)]">
                  {proto.year}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
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
              {/* Image with year chip */}
              <div className="relative w-full aspect-[4/5] rounded-card overflow-hidden bg-surface-card">
                <Image
                  src={PROTOTYPES[current].imageSrc}
                  alt={PROTOTYPES[current].imageAlt}
                  fill
                  sizes="100vw"
                  className="object-cover object-center"
                />
                <div className="absolute bottom-3 left-3">
                  <span className="inline-block px-2.5 py-1 rounded-sm bg-[rgba(0,0,0,0.75)] backdrop-blur-sm font-label text-[11px] tracking-[0.15em] uppercase text-accent-cyan border border-[rgba(0,229,255,0.3)]">
                    {PROTOTYPES[current].year}
                  </span>
                </div>
              </div>

              {/* Text */}
              <div className="flex flex-col gap-2">
                <span className="font-label text-eyebrow tracking-[0.2em] uppercase text-accent-cyan">
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
