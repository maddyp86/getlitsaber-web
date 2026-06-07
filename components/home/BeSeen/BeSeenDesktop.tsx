"use client";

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ResponsiveImage from "@/components/primitives/ResponsiveImage";
import { STAGES } from "./crowd.content";
import { useStageScroll } from "./useStageScroll";

interface BeSeenDesktopProps {
  className?: string;
}

const FADE = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  exit:   { opacity: 0, transition: { duration: 0.4 } },
};

export default function BeSeenDesktop({ className }: BeSeenDesktopProps) {
  const outerRef = useRef<HTMLElement>(null);
  const { activeStage, scrollToStage, reducedMotion } = useStageScroll(outerRef);

  if (reducedMotion) {
    return (
      <section
        id="be-seen"
        className={`w-full bg-background-primary${className ? ` ${className}` : ""}`}
        aria-label="Be Seen Across The Crowd"
      >
        {STAGES.map((stage, i) => (
          <div key={i} className="relative w-full overflow-hidden" style={{ height: "100vh" }}>
            <ResponsiveImage
              desktopSrc={stage.desktopImg}
              mobileSrc={stage.mobileImg}
              alt={stage.headline}
              breakpoint="1024px"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(to right, #000 0%, transparent 55%)" }}
              aria-hidden="true"
            />
            {/* Text column — aligned to the site container edge */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
              <div className="mx-auto w-full max-w-content px-content">
                <div className="flex flex-col justify-between max-w-[580px] h-[550px]">
                  <div className="flex flex-col gap-[20px]">
                    <p className="font-label text-label text-accent-cyan tracking-widest uppercase">
                      {stage.eyebrow}
                    </p>
                    <h2 className="font-display font-bold text-h1 text-text-primary leading-none">
                      {stage.headline}
                    </h2>
                    <p className="font-body text-body text-text-secondary" style={{ fontSize: "22px" }}>
                      {stage.body}
                    </p>
                  </div>
                  <div className="flex gap-[24px]">
                    {STAGES.map((_, j) => (
                      <div
                        key={j}
                        style={{ width: "40px", height: "5px", borderRadius: "2px" }}
                        className={i === j ? "bg-accent-cyan" : "bg-text-muted"}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    );
  }

  return (
    <section
      ref={outerRef}
      id="be-seen"
      className={`w-full bg-background-primary${className ? ` ${className}` : ""}`}
      style={{ height: "300vh" }}
      aria-label="Be Seen Across The Crowd"
    >
      {/* Sticky viewport-height container */}
      <div className="sticky w-full overflow-hidden" style={{ top: "90px", height: "calc(100vh - 90px)" }}>
        {/* Stage images — crossfade layer */}
        <div className="absolute inset-0">
          <AnimatePresence mode="sync">
            {STAGES.map((stage, i) =>
              i === activeStage ? (
                <motion.div
                  key={i}
                  className="absolute inset-0"
                  variants={FADE}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <ResponsiveImage
                    desktopSrc={stage.desktopImg}
                    mobileSrc={stage.mobileImg}
                    alt={stage.headline}
                    breakpoint="1024px"
                  />
                </motion.div>
              ) : null
            )}
          </AnimatePresence>
        </div>

        {/* Left-to-right gradient scrim for text readability */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{ background: "linear-gradient(to right, #000 0%, rgba(0,0,0,0.7) 35%, transparent 55%)" }}
          aria-hidden="true"
        />

        {/* Text column — aligned to the site container edge */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-20">
          <div className="mx-auto w-full max-w-content px-content">
            <div className="flex flex-col justify-between max-w-[580px] h-[550px]">
              {/* Text group — crossfades per stage */}
              <div className="flex flex-col gap-[20px]">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`eyebrow-${activeStage}`}
                    className="font-label text-label text-accent-cyan tracking-widest uppercase"
                    variants={FADE}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {STAGES[activeStage].eyebrow}
                  </motion.p>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  <motion.h2
                    key={`headline-${activeStage}`}
                    className="font-display font-bold text-h1 text-text-primary leading-none"
                    variants={FADE}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {STAGES[activeStage].headline}
                  </motion.h2>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  <motion.p
                    key={`body-${activeStage}`}
                    className="font-body text-text-secondary"
                    style={{ fontSize: "22px" }}
                    variants={FADE}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {STAGES[activeStage].body}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Progress bars */}
              <div className="flex gap-[24px]" role="group" aria-label="Stage navigation">
                {STAGES.map((stage, i) => (
                  <button
                    key={i}
                    onClick={() => scrollToStage(i)}
                    aria-label={`Go to stage: ${stage.eyebrow}`}
                    aria-current={activeStage === i ? "true" : undefined}
                    style={{ width: "40px", height: "5px", borderRadius: "2px", padding: 0, border: "none", cursor: "pointer" }}
                    className={`transition-colors duration-300 ${activeStage === i ? "bg-accent-cyan" : "bg-text-muted"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}