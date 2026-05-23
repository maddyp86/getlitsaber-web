"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MODES, PULL_BUILD } from "./modes.content";
import { useModesState } from "./useModesState";

interface ThreeModesDesktopProps {
  className?: string;
}

const SLIDE_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const CONTENT_FADE = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: SLIDE_EASE } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.2 } },
};

const IMAGE_FADE = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35, ease: SLIDE_EASE } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export default function ThreeModesDesktop({ className }: ThreeModesDesktopProps) {
  const { activeMode, activePullBuild, setMode, togglePullBuild } = useModesState();
  const [reducedMotion, setReducedMotion] = useState(false);
  const [lightstreakVisible, setLightstreakVisible] = useState(false);
  const lightstreakRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const el = lightstreakRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLightstreakVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const cardBorderClass = (index: number) =>
    activeMode === index
      ? index === 0
        ? "border-t border-r border-b border-accent-cyan border-l-[6px] border-l-accent-cyan shadow-glow-cyan"
        : "border border-accent-cyan shadow-glow-cyan"
      : "border border-border-default";

  return (
    <section
      className={`w-full bg-background-primary overflow-hidden${className ? ` ${className}` : ""}`}
      aria-label="Pick Your Energy — Three Modes"
    >
      {/* TOP BAND: eyebrow + headline + lightstreak image */}
      <div ref={lightstreakRef} className="relative w-full" style={{ minHeight: "500px" }}>
        {/* Lightstreak image — full width, slides in from right */}
        {reducedMotion ? (
          <div className="absolute inset-0 z-0" style={{ top: "318px" }}>
            <img
              src="/images/home/litsaber-lightstreaks.jpg"
              alt=""
              aria-hidden="true"
              className="w-full object-cover"
              style={{ height: "725px" }}
            />
          </div>
        ) : (
          <motion.div
            className="absolute z-0 w-full"
            style={{ top: "318px" }}
            initial={{ x: "100%" }}
            animate={lightstreakVisible ? { x: 0 } : { x: "100%" }}
            transition={{ duration: 0.8, ease: SLIDE_EASE }}
          >
            <img
              src="/images/home/litsaber-lightstreaks.jpg"
              alt=""
              aria-hidden="true"
              className="w-full object-cover"
              style={{ height: "725px" }}
            />
          </motion.div>
        )}

        {/* Left-to-right scrim so text stays readable */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #0A0518 0%, rgba(10,5,24,0.85) 40%, transparent 70%)" }}
          aria-hidden="true"
        />

        {/* Text group */}
        <div className="relative z-20 flex flex-col gap-[20px] pt-[80px]" style={{ maxWidth: "650px", paddingLeft: "100px" }}>
          <p className="font-label text-label text-accent-cyan tracking-widest uppercase">
            INTERACTIVE LIGHTS
          </p>
          <h2 className="font-display font-bold leading-none text-text-primary" style={{ fontSize: "80px" }}>
            TEN WAYS TO{" "}
            <span className="font-accent text-accent-cyan" style={{ fontSize: "80px" }}>
              BE SEEN
            </span>
          </h2>
          <p className="font-body text-text-secondary" style={{ fontSize: "25px" }}>
            41 individually-addressable LEDs. Ten light patterns, three behaviors, zero restraint.
          </p>
        </div>
      </div>

      {/* BOTTOM CONTENT: three modes cards + image */}
      <div className="relative" style={{ paddingLeft: "100px", paddingBottom: "120px", paddingTop: "60px" }}>
        <div className="flex gap-[65px]" style={{ maxWidth: "1240px" }}>

          {/* LEFT: text group + mode cards */}
          <div className="flex flex-col" style={{ width: "614px" }}>
            {/* Sub-section heading group */}
            <div className="flex flex-col gap-[16px] mb-[50px]">
              <p className="font-label text-label text-accent-cyan tracking-widest uppercase">
                THREE MODES
              </p>
              <h3 className="font-display font-bold leading-none text-text-primary" style={{ fontSize: "75px" }}>
                PICK YOUR ENERGY
              </h3>
              <p className="font-body text-text-secondary" style={{ fontSize: "22px" }}>
                Three lighting behaviors built into every device. Switch between them with a five-click sequence. No app required.
              </p>
            </div>

            {/* Mode cards stacked */}
            <div className="flex flex-col" style={{ gap: "35px" }}>

              {/* Litsaber Mode card */}
              <button
                className={`w-full text-left rounded-md p-[28px] transition-all duration-300 bg-background-elevated ${cardBorderClass(0)}`}
                onClick={() => setMode(0)}
                aria-pressed={activeMode === 0}
              >
                <h4
                  className="font-subhead font-bold text-text-primary mb-[20px]"
                  style={{
                    fontSize: "35px",
                    textShadow: activeMode === 0 ? "0 0 20px rgba(0,229,255,0.6)" : "none",
                  }}
                >
                  LITSABER MODE
                </h4>

                {/* Toggle buttons — only interactive when this mode is active */}
                <div className="flex gap-[12px] mb-[20px]">
                  {PULL_BUILD.map((pb, i) => {
                    const isActive = activePullBuild === i;
                    return (
                      <button
                        key={pb.label}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (activeMode !== 0) return;
                          if (!isActive) togglePullBuild();
                        }}
                        disabled={activeMode !== 0}
                        aria-pressed={isActive}
                        className={`font-label text-eyebrow tracking-widest uppercase px-[16px] py-[8px] rounded-sm border transition-all duration-200 ${
                          activeMode === 0 && isActive
                            ? "bg-accent-cyan text-background-primary border-accent-cyan shadow-glow-cyan"
                            : activeMode === 0
                            ? "bg-transparent text-text-muted border-border-default hover:border-accent-cyan hover:text-text-primary"
                            : "bg-transparent text-text-muted border-border-default opacity-50 cursor-default"
                        }`}
                      >
                        {pb.label}
                      </button>
                    );
                  })}
                </div>

                {/* Description — swaps with AnimatePresence */}
                <div style={{ minHeight: "80px" }}>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={`desc-${activePullBuild}`}
                      variants={CONTENT_FADE}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="font-body text-text-secondary"
                      style={{ fontSize: "20px" }}
                    >
                      {PULL_BUILD[activePullBuild].description}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </button>

              {/* Glowstick Mode card */}
              <button
                className={`w-full text-left rounded-md p-[28px] transition-all duration-300 bg-background-elevated ${cardBorderClass(1)}`}
                onClick={() => setMode(1)}
                aria-pressed={activeMode === 1}
              >
                <h4
                  className="font-subhead font-bold mb-[16px]"
                  style={{
                    fontSize: "35px",
                    color: activeMode === 1 ? "var(--tw-text-text-primary, #F0F0F5)" : "#888888",
                    textShadow: activeMode === 1 ? "0 0 20px rgba(0,229,255,0.6)" : "none",
                    transition: "color 0.3s, text-shadow 0.3s",
                  }}
                >
                  GLOWSTICK MODE
                </h4>
                <p className="font-body text-text-secondary" style={{ fontSize: "20px" }}>
                  {MODES[1].body}
                </p>
              </button>

              {/* Stealth Mode card */}
              <button
                className={`w-full text-left rounded-md p-[28px] transition-all duration-300 bg-background-elevated ${cardBorderClass(2)}`}
                onClick={() => setMode(2)}
                aria-pressed={activeMode === 2}
              >
                <h4
                  className="font-subhead font-bold mb-[16px]"
                  style={{
                    fontSize: "35px",
                    color: activeMode === 2 ? "var(--tw-text-text-primary, #F0F0F5)" : "#888888",
                    textShadow: activeMode === 2 ? "0 0 20px rgba(0,229,255,0.6)" : "none",
                    transition: "color 0.3s, text-shadow 0.3s",
                  }}
                >
                  STEALTH MODE
                </h4>
                <p className="font-body text-text-secondary" style={{ fontSize: "20px" }}>
                  {MODES[2].body}
                </p>
              </button>
            </div>
          </div>

          {/* RIGHT: mode image */}
          <div
            className="flex-shrink-0 rounded-md overflow-hidden border border-background-raised"
            style={{ width: "576px", height: "688px", alignSelf: "flex-end" }}
          >
            <div className="relative w-full h-full">
              <AnimatePresence mode="wait">
                <motion.img
                  key={`mode-image-${activeMode}`}
                  src={MODES[activeMode].image}
                  alt={MODES[activeMode].title}
                  variants={IMAGE_FADE}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
