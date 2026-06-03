"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EYEBROW, HEADLINE, FAQ_ITEMS, FaqItem } from "./commonquestions.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function useScrollReveal(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) { setVisible(true); return; }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, prefersReduced]);

  return { ref, visible };
}

function FaqCardMobile({ item, index, visible }: { item: FaqItem; index: number; visible: boolean }) {
  const delay = index * 80;

  return (
    <motion.div
      className="flex flex-col gap-3 rounded-card border border-border-pill p-5"
      style={{ background: "#110826" }}
      initial={{ opacity: 0, y: 24 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.7, delay: delay / 1000, ease: EASE }}
    >
      {/* Number */}
      <span
        className="font-label text-text-accent"
        style={{ fontSize: "13px", letterSpacing: "0.08em" }}
      >
        {item.number}
      </span>

      {/* Question — Orbitron bold 18px */}
      <h3
        className="font-subhead font-bold text-text-primary"
        style={{ fontSize: "18px", lineHeight: "normal" }}
      >
        {item.question}
      </h3>

      {/* Answer — Inter regular 16px */}
      <p
        className="font-body"
        style={{ fontSize: "16px", lineHeight: "normal", color: "#CCC" }}
      >
        {item.answer}
      </p>
    </motion.div>
  );
}

export default function CommonQuestionsMobile() {
  const { ref, visible } = useScrollReveal();

  return (
    <section
      id="common-questions"
      className="relative w-full overflow-hidden bg-background-primary py-section-y-mobile px-container-mobile"
      aria-label="Common Questions"
    >
      {/* Mobile background glow orb */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: "375px",
          height: "375px",
          aspectRatio: "1/1",
          borderRadius: "375px",
          background: "rgba(30, 0, 77, 0.75)",
          filter: "blur(150px)",
          zIndex: 0,
        }}
        aria-hidden="true"
      />

      {/* Header */}
      <div ref={ref} className="relative z-10 flex flex-col items-start text-left mb-8">
        <motion.p
          className="font-label text-text-accent text-center text-eyebrow uppercase tracking-widest mb-3"
          initial={{ opacity: 0, y: 24 }}
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {EYEBROW}
        </motion.p>

        <motion.h2
          className="font-display font-bold text-text-primary uppercase text-center"
          style={{ 
              textShadow: "0 0 50px rgba(0, 229, 255, 0.75)", 
              lineHeight: "normal",
              fontSize: "clamp(45px, 6.5vw, 75px)",
            }}
          initial={{ opacity: 0, y: 24 }}
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
        >
          {HEADLINE}
        </motion.h2>
      </div>

      {/* FAQ Stack — single column */}
      <div className="relative z-10 flex flex-col gap-4">
        {FAQ_ITEMS.map((item, i) => (
          <FaqCardMobile key={item.number} item={item} index={i} visible={visible} />
        ))}
      </div>
    </section>
  );
}
