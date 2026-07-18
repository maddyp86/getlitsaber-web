"use client";

import { Fragment } from "react";
import { motion, useReducedMotion } from "framer-motion";
import RebateForm from "./RebateForm";
import { STEPS_HEADLINE, STEPS } from "./rebate.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Render **bold** segments as brighter, semibold text.
function renderBold(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((seg, i) => {
    if (seg.startsWith("**") && seg.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-white">
          {seg.slice(2, -2)}
        </strong>
      );
    }
    return <Fragment key={i}>{seg}</Fragment>;
  });
}

export default function HowItWorks() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      className="relative isolate overflow-hidden w-full bg-background-primary"
      aria-label="How the rebate works"
    >
      {/* Ellipse behind the form — #4B2F81 @ 50%, heavy layer blur (Figma Section 2) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -z-10 hidden lg:block rounded-full"
        style={{
          width: 600,
          height: 600,
          top: 238,
          right: -30,
          backgroundColor: "#4B2F81",
          opacity: 0.5,
          filter: "blur(300px)",
        }}
      />

      <div className="mx-auto w-full max-w-content px-content py-section-y-mobile lg:py-section-y">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">
          {/* Left — steps */}
          <div className="flex w-full flex-col lg:flex-1">
            <motion.h2
              className="font-display font-bold uppercase text-white leading-[1.1] mb-10"
              style={{ fontSize: "clamp(40px, 5vw, 68px)" }}
              initial={prefersReduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              {STEPS_HEADLINE}
            </motion.h2>

            <div className="flex flex-col gap-8">
              {STEPS.map((step, i) => (
                <motion.div
                  key={step.num}
                  className={
                    step.highlight
                      ? "rounded-[8px] border border-[#EC5793] bg-[#150C2D]/60 p-6"
                      : ""
                  }
                  initial={prefersReduced ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.55, delay: i * 0.08, ease: EASE }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-label text-eyebrow tracking-[0.15em] uppercase ${
                        step.highlight ? "text-[#EC5793]" : "text-accent-cyan"
                      }`}
                    >
                      {step.num}
                    </span>
                    <h3 className="font-label font-bold text-white uppercase tracking-[0.08em] text-body-sm lg:text-body">
                      {step.title}
                    </h3>
                  </div>
                  <p className="mt-3 font-body text-body-sm text-text-secondary leading-relaxed max-w-[560px]">
                    {renderBold(step.body)}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right — claim form */}
          <motion.div
            className="w-full lg:w-[544px] lg:flex-shrink-0"
            initial={prefersReduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          >
            <RebateForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
