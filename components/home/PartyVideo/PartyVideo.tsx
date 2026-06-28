"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { videoUrl } from "@/lib/media";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const VIDEO_SRC = videoUrl("home/litsaber-party.mp4");

export default function PartyVideo() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1025px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const enableParallax = isDesktop && !prefersReduced;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    enableParallax ? ["-15%", "15%"] : ["0%", "0%"]
  );

  useEffect(() => {
    if (prefersReduced) { setVisible(true); return; }
    const el = textRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [prefersReduced]);

  return (
    <section
      ref={sectionRef}
      id="party-video"
      className="relative w-full overflow-hidden"
      style={{ aspectRatio: "16/9", minHeight: "480px" }}
      aria-label="The Ultimate Vaping Experience"
    >
      {/* Background video */}
      <div className="absolute inset-0">
        {prefersReduced ? (
          <div className="absolute inset-0 bg-background-primary" />
        ) : (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src={VIDEO_SRC}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          />
        )}
        {/* Dark overlay for text legibility */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.7) 100%)" }}
          aria-hidden="true"
        />
      </div>

      {/* Text block with parallax */}
      <div
        className="absolute inset-0 z-10 flex items-center justify-center w-full h-full"
      >
        <motion.div
          ref={textRef}
          className="mx-auto w-full max-w-content px-content text-center flex flex-col items-center gap-6"
          style={{ y }}
        >
          <motion.h2
            className="font-display font-bold text-text-primary uppercase"
            style={{
              fontSize: "clamp(45px, 6vw, 75px)",
              lineHeight: "1.05",
              maxWidth: "1000px",
              textShadow: "0 0 50px rgba(0,0,0,0.6)",
            }}
            initial={{ opacity: 0, y: 28 }}
            animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            THE ULTIMATE VAPING EXPERIENCE<br />DESIGNED FOR THE PARTY
          </motion.h2>
          <motion.p
            className="font-body text-text-primary"
            style={{
              fontSize: "clamp(16px, 2vw, 22px)",
              lineHeight: "1.6",
              maxWidth: "650px",
              opacity: 0.9,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={visible ? { opacity: 0.9, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          >
            Made with{" "}
            <strong style={{ color: "#ffffff", fontWeight: 700 }}>high-quality material</strong>
            {" "}for a superior lighting experience and built for{" "}
            <strong style={{ color: "#ffffff", fontWeight: 700 }}>long lasting use</strong>
            {" "}in all situations that life throws your way.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
