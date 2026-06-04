"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  SELLS_HEADLINE_PART1,
  SELLS_HEADLINE_PART2,
  SELLS_BODY,
  SELLS_ITSELF_VIDEO_SRC,
  SELLS_ITSELF_IMAGE_SRC,
  SELLS_ITSELF_IMAGE_ALT,
} from "./wholesale.content";
import Image from "next/image";

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

export default function SellsItself() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      className="relative isolate overflow-hidden w-full bg-[#010101]"
      aria-label="It sells itself"
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[500px] w-[500px] rounded-full"
        style={{
          background: "rgba(0, 229, 255, 0.04)",
          filter: "blur(150px)",
        }}
      />

      <div className="mx-auto w-full max-w-[1250px] px-[20px] lg:px-[60px] py-[100px]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16">
          {/* Copy — left on desktop, top on mobile */}
          <div className="flex flex-col gap-6 lg:flex-1">
            <motion.h2
              className="font-display font-bold uppercase leading-[1.1]"
              style={{ fontSize: "clamp(38px, 5vw, 65px)" }}
              initial={prefersReduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.75, ease: EASE }}
            >
              <span
                className="block text-white"
                style={{ textShadow: "0 0 50px rgba(0,229,255,0.6)" }}
              >
                {SELLS_HEADLINE_PART1}
              </span>
              <span
                className="block text-accent-cyan"
                style={{ textShadow: "0 0 50px rgba(0,229,255,0.5)" }}
              >
                {SELLS_HEADLINE_PART2}
              </span>
            </motion.h2>

            {SELLS_BODY.map((block, i) => (
              <motion.p
                key={i}
                className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed"
                initial={prefersReduced ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.65, delay: 0.1 + i * 0.1, ease: EASE }}
              >
                {renderEmphasis(block)}
              </motion.p>
            ))}
          </div>

          {/* Video / image — right on desktop, below on mobile */}
          <motion.div
            className="mt-10 lg:mt-0 w-full max-w-[420px] mx-auto lg:mx-0 lg:w-[350px] max-w-full lg:flex-shrink-0 aspect-[9/16] rounded-card overflow-hidden bg-surface-card border border-border-pill"
            initial={prefersReduced ? false : { opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.85, delay: 0.15, ease: EASE }}
          >
            {SELLS_ITSELF_VIDEO_SRC ? (
              <video
                src={SELLS_ITSELF_VIDEO_SRC}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            ) : SELLS_ITSELF_IMAGE_SRC ? (
              <Image
                src={SELLS_ITSELF_IMAGE_SRC}
                alt={SELLS_ITSELF_IMAGE_ALT}
                fill
                sizes="(min-width: 1024px) 420px, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-full border-2 border-text-muted flex items-center justify-center">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path d="M8 5.14v14l11-7-11-7z" fill="#888888" />
                  </svg>
                </div>
                <span className="font-label text-eyebrow tracking-[0.2em] uppercase text-text-muted">
                  {/* TODO: replace with lifestyle video */}
                  Video Coming Soon
                </span>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
