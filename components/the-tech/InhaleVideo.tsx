"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  INHALE_HEADLINE_LINE1,
  INHALE_HEADLINE_LINE2,
  INHALE_BODY,
  VIDEO_SRC,
  BREATH_BODY_BLOCKS,
  BREATH_RESPONSE_IMAGE_SRC,
  BREATH_RESPONSE_IMAGE_ALT,
} from "./the-tech.content";

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

export default function InhaleVideo() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      id="inhale"
      className="relative isolate overflow-hidden w-full bg-[#010101]"
      aria-label="Inhale. Watch what happens."
    >
      <div className="mx-auto w-full max-w-[1250px] px-[20px] lg:px-[60px] py-[100px]">
        {/* Centered headline */}
        <div className="flex flex-col items-center text-center gap-5 mb-12">
          <motion.h2
            className="font-display font-bold uppercase leading-[normal] max-w-[350px] lg:max-w-[810px]"
            style={{ fontSize: "clamp(45px, 6.5vw, 75px)" }}
            initial={prefersReduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.75, ease: EASE }}
          >
            <span
              className="text-white"
              style={{ textShadow: "0 0 50px rgba(0, 229, 255, 0.75)" }}
            >
              {INHALE_HEADLINE_LINE1}
            </span>
            <br />
            <span
              className="text-accent-cyan"
              style={{ textShadow: "0 0 50px rgba(0, 229, 255, 0.75)" }}
            >
              {INHALE_HEADLINE_LINE2}
            </span>
          </motion.h2>

          <motion.p
            className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed max-w-[850px]"
            initial={prefersReduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          >
            {INHALE_BODY}
          </motion.p>
        </div>

        {/* 16:9 video block */}
        <motion.div
          className="w-full aspect-video rounded-card overflow-hidden bg-surface-card border border-border-pill max-w-[1250px]"
          initial={prefersReduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
        >
          {VIDEO_SRC ? (
            <video
              src={VIDEO_SRC}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full border-2 border-text-muted flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M8 5.14v14l11-7-11-7z" fill="#888888" />
                </svg>
              </div>
              <span className="font-label text-eyebrow tracking-[0.2em] uppercase text-text-muted">
                Video Coming Soon
              </span>
            </div>
          )}
        </motion.div>

        {/* Breath response — two-column copy/image block */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-16 mt-16 lg:mt-24">

          {/* Image — right on desktop, below on mobile */}
          <motion.div
            className="relative mt-10 lg:mt-0 mx-auto lg:mx-0 w-[350px] max-w-full aspect-[70/93] lg:w-auto lg:flex-1 lg:aspect-auto lg:self-stretch rounded-card overflow-hidden"
            initial={prefersReduced ? false : { opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.85, delay: 0.15, ease: EASE }}
          >
            <Image
              src={BREATH_RESPONSE_IMAGE_SRC}
              alt={BREATH_RESPONSE_IMAGE_ALT}
              fill
              sizes="(min-width: 1024px) 550px, 350px"
              className="object-cover object-center"
            />
          </motion.div> 
          {/* Copy — left on desktop, top on mobile */}
          <div className="flex mt-10 flex-col gap-2 lg:flex-1">
            {BREATH_BODY_BLOCKS.map((block, i) => (
              <motion.p
                key={i}
                className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed"
                initial={prefersReduced ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.1 + i * 0.1, ease: EASE }}
              >
                {renderEmphasis(block)}
              </motion.p>
            ))}
          </div>

 
        </div>

        {/* Ambient glow — sits behind all section content */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[200px] -z-10 h-[350px] w-[350px] lg:h-[800px] lg:w-[800px] -translate-x-1/2 rounded-full"
          style={{
            background: "rgba(30, 0, 77, 0.75)",
            filter: "blur(150px)",
          }}
        />
      </div>
    </section>
  );
}