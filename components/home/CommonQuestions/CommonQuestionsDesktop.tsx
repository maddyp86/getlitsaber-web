"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EYEBROW, HEADLINE, FAQ_ITEMS, FaqItem } from "./commonquestions.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function useScrollReveal(threshold = 0.12) {
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

function FaqCard({ item, index, visible }: { item: FaqItem; index: number; visible: boolean }) {
  // Cards stagger in reading order: row 0 = 0/100ms, row 1 = 200/300ms, row 2 = 400/500ms
  const row = Math.floor(index / 2);
  const col = index % 2;
  const delay = row * 200 + col * 100;

  return (
    <motion.div
      className="flex flex-col gap-3 rounded-card border border-border-pill p-6"
      style={{ background: "#110826" }}
      initial={{ opacity: 0, y: 28 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 750 / 1000, delay: delay / 1000, ease: EASE }}
    >
      {/* Number */}
      <span
        className="font-label text-text-accent"
        style={{ fontSize: "14px", letterSpacing: "0.08em" }}
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
        className="font-body text-text-secondary"
        style={{ fontSize: "16px", lineHeight: "normal", color: "#CCC" }}
      >
        {item.answer}
      </p>
    </motion.div>
  );
}

export default function CommonQuestionsDesktop() {
  const { ref, visible } = useScrollReveal();

  return (
    <section
      id="common-questions"
      className="relative w-full overflow-hidden bg-background-primary py-section-y px-container"
      aria-label="Common Questions"
    >
      {/* Desktop background glow orb */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: "800px",
          height: "800px",
          borderRadius: "800px",
          background:
            "linear-gradient(180deg, rgba(30, 0, 77, 0.40) -19.12%, rgba(54, 0, 140, 0.40) 36.53%, rgba(16, 8, 35, 0.40) 77.45%)",
          filter: "blur(150px)",
          zIndex: 0,
        }}
        aria-hidden="true"
      />

      {/* Header */}
      <div ref={ref} className="relative z-10 flex flex-col items-center text-center mb-14">
        <motion.p
          className="font-label text-text-accent text-eyebrow uppercase tracking-widest mb-4"
          initial={{ opacity: 0, y: 28 }}
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {EYEBROW}
        </motion.p>

        <motion.h2
          className="font-display font-bold text-text-primary uppercase"
          style={{ fontSize: "clamp(48px, 5.5vw, 80px)", lineHeight: "1.05" }}
          initial={{ opacity: 0, y: 28 }}
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
        >
          {HEADLINE}
        </motion.h2>
      </div>

      {/* FAQ Grid — 2 columns */}
      <div
        className="relative z-10 grid grid-cols-2 gap-5 mx-auto"
        style={{ maxWidth: "1250px" }}
      >
        {FAQ_ITEMS.map((item, i) => (
          <FaqCard key={item.number} item={item} index={i} visible={visible} />
        ))}
      </div>
    </section>
  );
}
