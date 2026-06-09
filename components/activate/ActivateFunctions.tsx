"use client";

import { Fragment } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SECTION_IDS, ACTIVATE_FUNCTIONS } from "@/content/activate.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function ActivateFunctions() {
  const prefersReduced = useReducedMotion();
  const { eyebrow, title, intro, tableHeading, columns, rows } = ACTIVATE_FUNCTIONS;

  return (
    <section
      id={SECTION_IDS.functions}
      className="scroll-mt-[150px] py-section-y-mobile lg:py-section-y bg-[#0F0824]"
    >
      <div className="mx-auto w-full max-w-content px-content">

        {/* Section header */}
        <motion.p
          className="font-label text-eyebrow uppercase text-accent-cyan"
          initial={prefersReduced ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {eyebrow}
        </motion.p>

        <motion.h2
          className="font-display font-bold uppercase leading-[1.1] text-white"
          style={{ fontSize: "clamp(45px, 5vw, 75px)" }}
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.05, ease: EASE }}
        >
          {title}
        </motion.h2>

        <motion.p
          className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed mb-10 max-w-content"
          initial={prefersReduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
        >
          {intro}
        </motion.p>

        <motion.p
          className="font-label text-eyebrow tracking-[0.15em] uppercase text-text-muted mb-5"
          initial={prefersReduced ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
        >
          {tableHeading}
        </motion.p>

        {/* Table — wrapped in overflow-x-auto to prevent page-level overflow
            which would silently break the sticky sub-nav */}
        <motion.div
          className="w-full overflow-x-auto"
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
        >
          <table className="w-full min-w-[350px] border-collapse rounded-card overflow-hidden">
            <thead>
              <tr className="bg-[#0C0C18]">
                <th
                  scope="col"
                  className="w-[38%] px-5 py-4 text-left font-label text-eyebrow tracking-[0.15em] uppercase text-accent-cyan border-b border-border-divider"
                >
                  {columns.action}
                </th>
                <th
                  scope="col"
                  className="px-5 py-4 text-left font-label text-eyebrow tracking-[0.15em] uppercase text-accent-cyan border-b border-border-divider"
                >
                  {columns.result}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <Fragment key={row.action}>
                  <tr className={i % 2 === 0 ? "bg-transparent" : "bg-surface-card/30"}>
                    <td className="px-5 py-4 font-label text-body-sm text-text-primary align-top border-b border-border-divider last:border-0">
                      {row.action}
                    </td>
                    <td className="px-5 py-4 font-body text-body-sm text-text-secondary align-top border-b border-border-divider last:border-0">
                      {row.result}
                    </td>
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>
        </motion.div>

      </div>
    </section>
  );
}
