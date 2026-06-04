"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Fragment } from "react";
import {
  VOLTAGE_EYEBROW,
  VOLTAGE_HEADLINE_LINE1,
  VOLTAGE_HEADLINE_ACCENT,
  VOLTAGE_BODY,
  VOLTAGE_ROWS,
  VOLTAGE_DEVICE_IMAGE_SRC,
  VOLTAGE_DEVICE_IMAGE_ALT,
} from "./the-tech.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function VoltageSection() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      className="relative w-full bg-[#0A0619]"
      aria-label="Tuned for the oil"
    >
      <div className="mx-auto w-full max-w-[1250px] px-[20px] lg:px-[60px] py-[100px]">
        <div className="flex flex-col lg:flex-row lg:items-stretch lg:gap-16">

          {/* Left: voltage table + device image, wrapped in a bordered card */}
          <motion.div
            className="flex flex-col items-center w-full max-w-[506px] rounded-xl border border-[#32205A] bg-[#0A0515]"
            initial={prefersReduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            {/* Voltage table */}
            <div className="flex flex-col w-full">
              {VOLTAGE_ROWS.map((row, i) => (
                <Fragment key={row.voltage}>
                  <div className="flex items-center justify-between gap-4 p-6">
                    <span
                      className="font-display text-3xl lg:text-5xl font-bold leading-none tabular-nums"
                      style={{ color: row.color }}
                    >
                      {row.voltage}
                    </span>
                    <div className="flex flex-col items-end">
                      <span className="font-body text-body-sm text-right text-text-secondary">
                        {row.oilType1}
                      </span>
                      <span className="font-body text-body-sm text-right text-text-secondary">
                        {row.oilType2}
                      </span>
                    </div>
                  </div>
                  {i < VOLTAGE_ROWS.length - 1 && (
                    <div className="h-px w-full bg-[#32205A]" aria-hidden="true" />
                  )}
                </Fragment>
              ))}
            </div>
          {/* Device image below the table */}
    <div className="relative w-full h-[322px] overflow-hidden">
  {VOLTAGE_DEVICE_IMAGE_SRC ? (
    <Image
      src={VOLTAGE_DEVICE_IMAGE_SRC}
      alt={VOLTAGE_DEVICE_IMAGE_ALT}
      fill
      sizes="(min-width: 1024px) 460px, 100vw"
      className="object-cover object-center rounded-b-xl"
    />
  ) : (
    <div className="w-full h-full bg-surface-card flex items-center justify-center rounded-card border border-border-pill">
      <span className="font-label text-eyebrow text-text-muted tracking-widest uppercase">
        Voltage Device Image
      </span>
    </div>
  )}
</div>
          </motion.div>

          {/* Right: headline + copy */}
          <div className="flex flex-col  gap-5 mt-10 lg:mt-0  justify-center lg:flex-1">
            <motion.p
              className="font-label text-eyebrow tracking-[0.2em] uppercase text-accent-cyan"
              initial={prefersReduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              {VOLTAGE_EYEBROW}
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
              {VOLTAGE_HEADLINE_LINE1}
                </span>
                          <br />
              <span
                className="text-accent-cyan"
                style={{ textShadow: "0 0 50px rgba(0,229,255,0.5)" }}
              >
                {VOLTAGE_HEADLINE_ACCENT}
              </span>
            </motion.h2>

            <motion.p
              className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed"
              initial={prefersReduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, delay: 0.2, ease: EASE }}
            >
              {VOLTAGE_BODY}
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}