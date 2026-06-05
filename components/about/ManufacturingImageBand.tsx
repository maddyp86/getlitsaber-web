"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { MFG_BAND_SRC, MFG_BAND_ALT } from "./about.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function ManufacturingImageBand() {
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);

  // Track scroll progress while the band moves through the viewport
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Gentle vertical parallax — image drifts up as you scroll past
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <motion.div
      ref={sectionRef}
      className="relative hidden lg:block w-full overflow-hidden"
      style={{ height: "clamp(400px, 35vw, 500px)" }}
      aria-hidden="true"
      initial={prefersReduced ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease: EASE }}
    >
      {/* Oversized wrapper so the parallax shift never exposes an edge */}
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{
          y: prefersReduced ? 0 : y,
          top: "-8%",
          height: "116%",
        }}
        initial={prefersReduced ? false : { scale: 1.08 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1.4, ease: EASE }}
      >
        <Image
          src={MFG_BAND_SRC}
          alt={MFG_BAND_ALT}
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>
    </motion.div>
  );
}