"use client";

import Image from "next/image";
import { Fragment } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  TERMS_EYEBROW,
  TERMS_ROWS,
  TERMS_FINE_PRINT,
  TERMS_IMAGE_SRC,
  TERMS_IMAGE_ALT,
} from "./affiliates.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function ProgramTerms() {
  const prefersReduced = useReducedMotion();

  return (
    <section className="relative w-full pb-16 lg:pb-[110px]" aria-label="Program terms">
      <div className="mx-auto w-full max-w-content px-content">
        <div className="flex flex-col gap-6 lg:gap-[34px]">
          <motion.span
            className="font-label font-bold text-xs uppercase tracking-[0.12em] text-accent-cyan"
            initial={prefersReduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            {TERMS_EYEBROW}
          </motion.span>

          {/* items-stretch on desktop so the image column matches the table's height */}
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2 lg:items-stretch lg:gap-[60px]">
            {/* Terms table */}
            <motion.div
              className="rounded-card border border-white/10 bg-white/[0.04] px-5 pb-5 pt-2 backdrop-blur-sm lg:px-[30px] lg:pb-[26px] lg:pt-2.5"
              initial={prefersReduced ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
            >
              <dl className="m-0 grid grid-cols-1 lg:grid-cols-[150px_minmax(0,1fr)]">
                {TERMS_ROWS.map((row) => (
                  <Fragment key={row.key}>
                    <dt className="pb-1 pt-3.5 font-label text-[10px] uppercase tracking-[0.12em] text-text-muted lg:border-b lg:border-white/10 lg:py-[15px]">
                      {row.key}
                    </dt>
                    <dd className="m-0 border-b border-white/10 pb-3.5 font-body text-[15px] text-text-primary lg:py-[15px]">
                      {row.value}
                    </dd>
                  </Fragment>
                ))}
              </dl>
              <p className="mt-[22px] font-body text-xs leading-relaxed text-text-muted">
                {TERMS_FINE_PRINT}
              </p>
            </motion.div>

            {/* Lifestyle frame */}
            <motion.div
              className="relative h-[260px] w-full overflow-hidden rounded-card border border-border-pill shadow-[0_0_90px_rgba(236,87,147,0.14)] lg:h-auto"
              initial={prefersReduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: 0.16, ease: EASE }}
            >
              <Image
                src={TERMS_IMAGE_SRC}
                alt={TERMS_IMAGE_ALT}
                fill
                sizes="(min-width: 1024px) 600px, 100vw"
                className="object-cover object-center"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
