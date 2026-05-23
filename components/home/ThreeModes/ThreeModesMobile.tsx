"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MODES, PULL_BUILD } from "./modes.content";
import { useModesState } from "./useModesState";

interface ThreeModesMobileProps {
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

export default function ThreeModesMobile({ className }: ThreeModesMobileProps) {
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

  const activeCardBorder = (index: number) =>
    activeMode === index
      ? index === 0
        ? "border-t-[6px] border-t-accent-cyan border-x border-b border-accent-cyan shadow-glow-cyan"
        : "border border-accent-cyan shadow-glow-cyan"
      : "border border-border-default";

  return (
    <section
      className={`w-full bg-background-primary overflow-hidden${className ? ` ${className}` : ""}`}
      aria-label="Pick Your Energy — Three Modes"
    >
      {/* TOP: eyebrow + headline + body + lightstreak image */}
      <div className="px-container-mobile pt-[60px]">
        <p className="font-label text-eyebrow text-accent-cyan tracking-widest uppercase mb-[12px]">
          INTERACTIVE LIGHTS
        </p>
        <h2 className="font-display font-bold leading-none text-text-primary mb-[16px]" style={{ fontSize: "45px" }}>
          TEN WAYS TO{" "}
          <span className="font-accent text-accent-cyan" style={{ fontSize: "45px" }}>
            BE SEEN
          </span>
        </h2>
        <p className="font-body text-text-secondary mb-[32px]" style={{ fontSize: "16px" }}>
          41 individually-addressable LEDs. Ten light patterns, three behaviors, zero restraint.
        </p>
      </div>

      {/* Lightstreak image — full width, slides in from right */}
      <div ref={lightstreakRef} className="relative w-full overflow-hidden mb-[50px]" style={{ height: "258px" }}>
        {reducedMotion ? (
          <img
            src="/images/home/litsaber-lightstreaks-mobile.jpg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
          />
        ) : (
          <motion.img
            src="/images/home/litsaber-lightstreaks-mobile.jpg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
            initial={{ x: "100%" }}
            animate={lightstreakVisible ? { x: 0 } : { x: "100%" }}
            transition={{ duration: 0.8, ease: SLIDE_EASE }}
          />
        )}
      </div>

      {/* BOTTOM: three modes stacked */}
      <div className="px-container-mobile pb-[80px]">
        {/* Sub-section heading group */}
        <div className="flex flex-col gap-[12px] mb-[32px]">
          <p className="font-label text-eyebrow text-accent-cyan tracking-widest uppercase">
            THREE MODES
          </p>
          <h3 className="font-display font-bold leading-none text-text-primary" style={{ fontSize: "45px" }}>
            PICK YOUR ENERGY
          </h3>
          <p className="font-body text-text-secondary" style={{ fontSize: "18px" }}>
            Three lighting behaviors built into every device. Switch between them with a five-click sequence.
          </p>
        </div>

        {/* Mode cards stacked */}
        <div className="flex flex-col gap-[24px]">

          {/* Litsaber Mode card */}
          <div
            role="button"
            tabIndex={0}
            className={`w-full text-left rounded-md overflow-hidden transition-all duration-300 bg-background-elevated cursor-pointer ${activeCardBorder(0)}`}
            onClick={() => setMode(0)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setMode(0); } }}
            aria-label="Activate Litsaber Mode"
          >
            <div className="p-[20px]">
              <h4
                className="font-subhead font-bold text-text-primary mb-[16px]"
                style={{
                  fontSize: "24px",
                  textShadow: activeMode === 0 ? "0 0 20px rgba(0,229,255,0.6)" : "none",
                }}
              >
                LITSABER MODE
              </h4>

              {/* Toggle buttons */}
              <div className="flex gap-[10px] mb-[16px]">
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
                      className={`font-label text-eyebrow tracking-widest uppercase px-[12px] py-[6px] rounded-sm border transition-all duration-200 ${
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

              {/* Description */}
              <div style={{ minHeight: "72px" }}>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`desc-mobile-${activePullBuild}`}
                    variants={CONTENT_FADE}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="font-body text-text-secondary"
                    style={{ fontSize: "16px" }}
                  >
                    {PULL_BUILD[activePullBuild].description}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>

            {/* Mode image inside card */}
            <div className="relative w-full" style={{ aspectRatio: "574 / 670" }}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={`mode-img-mobile-${activeMode}`}
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

          {/* Glowstick Mode card */}
          <div
            role="button"
            tabIndex={0}
            className={`w-full text-left rounded-md overflow-hidden transition-all duration-300 bg-background-elevated cursor-pointer ${activeCardBorder(1)}`}
            onClick={() => setMode(1)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setMode(1); } }}
            aria-label="Activate Glowstick Mode"
          >
            <div className="p-[20px]">
              <h4
                className="font-subhead font-bold mb-[12px]"
                style={{
                  fontSize: "24px",
                  color: activeMode === 1 ? "#F0F0F5" : "#888888",
                  textShadow: activeMode === 1 ? "0 0 20px rgba(0,229,255,0.6)" : "none",
                  transition: "color 0.3s, text-shadow 0.3s",
                }}
              >
                GLOWSTICK MODE
              </h4>
              <p className="font-body text-text-secondary" style={{ fontSize: "16px" }}>
                {MODES[1].body}
              </p>
            </div>

            {activeMode === 1 && (
              <div className="relative w-full" style={{ aspectRatio: "574 / 670" }}>
                <img
                  src={MODES[1].image}
                  alt={MODES[1].title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Stealth Mode card */}
          <div
            role="button"
            tabIndex={0}
            className={`w-full text-left rounded-md overflow-hidden transition-all duration-300 bg-background-elevated cursor-pointer ${activeCardBorder(2)}`}
            onClick={() => setMode(2)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setMode(2); } }}
            aria-label="Activate Stealth Mode"
          >
            <div className="p-[20px]">
              <h4
                className="font-subhead font-bold mb-[12px]"
                style={{
                  fontSize: "24px",
                  color: activeMode === 2 ? "#F0F0F5" : "#888888",
                  textShadow: activeMode === 2 ? "0 0 20px rgba(0,229,255,0.6)" : "none",
                  transition: "color 0.3s, text-shadow 0.3s",
                }}
              >
                STEALTH MODE
              </h4>
              <p className="font-body text-text-secondary" style={{ fontSize: "16px" }}>
                {MODES[2].body}
              </p>
            </div>

            {activeMode === 2 && (
              <div className="relative w-full" style={{ aspectRatio: "574 / 670" }}>
                <img
                  src={MODES[2].image}
                  alt={MODES[2].title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
