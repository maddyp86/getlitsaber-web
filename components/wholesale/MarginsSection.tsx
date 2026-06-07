"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  MARGINS_HEADLINE_LINE1,
  MARGINS_HEADLINE_ACCENT,
  MARGINS_BODY,
  MARGINS_STATS,
  MARGINS_BAND_HEADLINE,
  MARGINS_BAND_SUBLINE,
  MARGINS_BAND_CTA,
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


export default function MarginsSection() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      id="numbers"
      className="relative isolate overflow-hidden w-full -mt-px bg-[linear-gradient(180deg,#000_0%,#150C2D_100%)]"
      aria-label="Premium margins, real numbers"
    >
{/* Geometric shape — top-right, behind everything */}
<div
  className="absolute pointer-events-none -z-10 bottom-[0px] lg:top-0"
  style={{ width: "540px", height: "451px", right: -100, opacity: 0.5 }}
  aria-hidden="true"
>
  <Image
    src="/images/tech/geometric-shape.png"
    alt=""
    fill
    sizes="540px"
    style={{ objectFit: "contain" }}
  />
</div>

      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[80px] -z-10 h-[400px]"
        style={{
          background: "linear-gradient(180deg, rgba(75,47,129,0.35) 0%, transparent 100%)",
          filter: "blur(80px)",
        }}
      />

      <div className="mx-auto w-full max-w-content px-content pt-[100px] pb-[200px]">
        {/* Top row: copy left + stats card right */}
        <div className="flex flex-col pb-10 lg:flex-row lg:items-stretch lg:gap-16">
          {/* Copy */}
          <div className="flex flex-col justify-center gap-6 lg:flex-1">
  
            <motion.h2
              className="font-display font-bold uppercase leading-[1.1]"
              style={{ fontSize: "clamp(45px, 5vw, 75px)" }}
              initial={prefersReduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.75, delay: 0.1, ease: EASE }}
            >
              <span
                className="block text-white"
                style={{ textShadow: "0 0 50px rgba(0,229,255,0.75)" }}
              >
                {MARGINS_HEADLINE_LINE1}
              </span>
              <span
                className="block text-accent-cyan"
                style={{ textShadow: "0 0 50px rgba(0,229,255,0.5)" }}
              >
                {MARGINS_HEADLINE_ACCENT}
              </span>
            </motion.h2>
            
 {MARGINS_BODY.map((block, i) => (
            <motion.p
                 key={i}
              className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed max-w-[480px]"
              initial={prefersReduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, delay: 0.2, ease: EASE }}
            >
               {renderEmphasis(block)}
            </motion.p>
             ))}
          </div>

          {/* Stats card */}
          <motion.div
            className="mt-10 lg:mt-0 w-full max-w-[480px] lg:w-[460px] lg:flex-shrink-0 rounded-xl border border-[#32205A] bg-[#0A0515]"
            initial={prefersReduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          >
            {MARGINS_STATS.map((row, i) => (
              <Fragment key={row.label}>
                <div className="flex flex-col gap-1 p-10">
                  <span className="font-body text-[14px] pb-2 uppercase text-text-muted">
                    {row.label}
                  </span>
                  <span
                    className="font-label font-bold leading-none"
                    style={{ fontSize: "clamp(30px, 3vw, 45px)", color: row.color }}
                  >
                    {row.value}
                  </span>
                </div>
                {i < MARGINS_STATS.length - 1 && (
                  <div className="h-px w-full bg-[#32205A]" aria-hidden="true" />
                )}
              </Fragment>
            ))}
          </motion.div>
        </div>

        {/* CTA band + blur backdrop */}
        <div className="relative isolate mt-16 lg:mt-20">
          {/* Blur element behind the band */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-full max-w-[1150px] h-full min-h-[350px]"
            style={{
              background:
                "linear-gradient(180deg, rgba(21,12,45,0.50) -23.86%, rgba(0,229,255,0.30) 130.46%)",
              filter: "blur(100px)",
            }}
          />

          {/* CTA band */}
          <motion.div
            className="rounded-xl border  min-h-[350px] border-[#113757] bg-[#080215] px-10 py-10 flex flex-col items-center justify-center text-center gap-5"
            initial={prefersReduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          >
            <h3
              className="font-label font-bold text-white uppercase leading-[1.1]"
              style={{ fontSize: "clamp(25px, 3vw, 35px)" }}
            >
              {MARGINS_BAND_HEADLINE}
            </h3>
            <p className="font-label text-eyebrow tracking-[0.15em] mb-4 uppercase text-accent-cyan">
              {MARGINS_BAND_SUBLINE}
            </p>
            <Link
              href="#apply"
              className="flex items-center justify-center gap-[10px] w-full sm:w-[320px] p-5 rounded-[5px] border border-[#EC5793] bg-[#EB3D7B] text-white font-label font-bold text-eyebrow uppercase tracking-wider shadow-[0_0_50px_0_rgba(235,62,124,0.50)] transition-all hover:brightness-110"
            >
              {MARGINS_BAND_CTA}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                className="shrink-0"
                aria-hidden="true"
              >
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}