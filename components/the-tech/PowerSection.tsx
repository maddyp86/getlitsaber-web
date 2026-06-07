"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  POWER_HEADLINE1,
  POWER_HEADLINE2,
  POWER_BODY,
  POWER_IMAGE_SRC,
  POWER_IMAGE_ALT,
  EXPLODED_RENDER_IMAGE_SRC,
  EXPLODED_RENDER_IMAGE_ALT,
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

export default function PowerSection() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      className="relative isolate overflow-hidden w-full bg-[#100B25]"
      aria-label="Power that keeps up"
    >
      <div className="mx-auto w-full max-w-content px-content py-[150px]">
        
        {/* 2-col: image left, copy right */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16">

      {/* Geometric shape #1 — top-left, behind everything */}
<div
  className="absolute pointer-events-none -z-10"
  style={{ width: "540px", height: "451px", top: 0, left: -100, opacity: 0.4 }}
  aria-hidden="true"
>
  <Image src="/images/tech/geometric-shape.png" alt="" fill sizes="540px" style={{ objectFit: "contain" }} />
</div>
          {/* Image — left on desktop, top on mobile */}
          <motion.div
            className="relative w-full aspect-[3/4] lg:aspect-[4/5] lg:flex-1 rounded-card overflow-hidden"
            initial={prefersReduced ? false : { opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.85, ease: EASE }}
          >
            {POWER_IMAGE_SRC ? (
              <Image
                src={POWER_IMAGE_SRC}
                alt={POWER_IMAGE_ALT}
                fill
                sizes="(min-width: 1024px) 545px, 100vw"
                className="object-cover object-center"
              />
            ) : (
              <div className="w-full h-full bg-surface-card flex items-center justify-center rounded-card border border-border-pill">
                <span className="font-label text-eyebrow text-text-muted tracking-widest uppercase">
                  Power Image
                </span>
              </div>
            )}
          </motion.div>

          {/* Copy — right on desktop, below image on mobile */}
          <div className="flex flex-col gap-5 mt-10 lg:mt-0 lg:flex-1">

            <motion.h2
              className="font-display font-bold uppercase leading-[normal] max-w-[350px] lg:max-w-[810px]"
              style={{ fontSize: "clamp(45px, 6.5vw, 75px)" }}
              initial={prefersReduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.75, delay: 0.1, ease: EASE }}
            >
              <span
                className="text-white"
                style={{ textShadow: "0 0 50px rgba(0, 229, 255, 0.75)" }}
              >
                {POWER_HEADLINE1}
              </span>
              <br />
              <span
                className="text-accent-cyan"
                style={{ textShadow: "0 0 50px rgba(0, 229, 255, 0.75)" }}
              >
                {POWER_HEADLINE2}
              </span>
            </motion.h2>

            {POWER_BODY.map((block, i) => (
              <motion.p
                key={i}
                className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed"
                initial={prefersReduced ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.65, delay: 0.2, ease: EASE }}
              >
                {renderEmphasis(block)}
              </motion.p>
            ))}
          </div>
        </div>
      </div>

      {/* Full-width exploded render below the 2-col */}
      <motion.div
        className="relative w-full lg:py-20 py-10 px-[20px] lg:px-[60px]"
        initial={prefersReduced ? false : { opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.85, delay: 0.1, ease: EASE }}
      >
        {EXPLODED_RENDER_IMAGE_SRC ? (
          <Image
            src={EXPLODED_RENDER_IMAGE_SRC}
            alt={EXPLODED_RENDER_IMAGE_ALT}
            width={1100}
            height={734}
            sizes="100vw"
            className="w-full max-w-[1100px] h-auto mx-auto"
          />
        ) : (
          <div className="w-full aspect-[547/365] bg-surface-card flex items-center justify-center border border-border-pill">
            <span className="font-label text-eyebrow text-text-muted tracking-widest uppercase">
              Exploded 3D Render
            </span>
          </div>
        )}
      </motion.div>
    </section>
  );
}