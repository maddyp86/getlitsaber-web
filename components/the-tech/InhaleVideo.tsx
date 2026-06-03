"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  INHALE_HEADLINE_LINE1,
  INHALE_HEADLINE_LINE2,
  INHALE_BODY,
  VIDEO_SRC,
} from "./the-tech.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function InhaleVideo() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      id="inhale"
      className="relative w-full bg-background-primary"
      aria-label="Inhale. Watch what happens."
    >
      <div className="mx-auto w-full max-w-[1250px] px-5 lg:px-0 py-16 lg:py-24">
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
    <span className="text-accent-cyan">
      {INHALE_HEADLINE_LINE2}
    </span>
  </motion.h2>

          <motion.p
            className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed max-w-[640px]"
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
          className="w-full aspect-video rounded-card overflow-hidden bg-surface-card border border-border-pill"
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
              {/* Play icon */}
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
      </div>
    </section>
  );
}
