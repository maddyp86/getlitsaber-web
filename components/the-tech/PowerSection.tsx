"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  POWER_EYEBROW,
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
      className="relative w-full bg-background-primary"
      aria-label="Power that keeps up"
    >
      <div className="mx-auto w-full max-w-[1250px] lg:px-[60px] px-[20px] py-[100px] mb-12">

        {/* 2-col: image left, copy right */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16">

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
            <motion.p
              className="font-label text-eyebrow tracking-[0.2em] uppercase text-accent-cyan"
              initial={prefersReduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              {POWER_EYEBROW}
            </motion.p>

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

        {/* Full-width exploded render below the 2-col */}
        <motion.div
          className="mt-10 relative w-full mt-16 lg:mt-20 aspect-[16/7] lg:aspect-[16/6] rounded-card overflow-hidden"
          initial={prefersReduced ? false : { opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.85, delay: 0.1, ease: EASE }}
        >
          {EXPLODED_RENDER_IMAGE_SRC ? (
            <Image
              src={EXPLODED_RENDER_IMAGE_SRC}
              alt={EXPLODED_RENDER_IMAGE_ALT}
              fill
              className="object-contain object-center"
            />
          ) : (
            <div className="w-full h-full bg-surface-card flex items-center justify-center rounded-card border border-border-pill">
              <span className="font-label text-eyebrow text-text-muted tracking-widest uppercase">
                Exploded 3D Render
              </span>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
