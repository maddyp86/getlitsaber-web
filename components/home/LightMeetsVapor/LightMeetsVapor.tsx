"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
export default function LightMeetsVapor() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReduced ? ["0%", "0%"] : ["-15%", "15%"]
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
      id="light-meets-vapor"
      className="relative w-full overflow-hidden [aspect-ratio:375/600] lg:[aspect-ratio:8/5]"
      aria-label="Where Light and Vapor Meet"
    >
      {/* Parallax background image — scaled up so edges don't show during travel */}
      <motion.div
        className="absolute inset-0 scale-110"
        style={{ y }}
      >
        <picture className="absolute inset-0 block">
          <source media="(min-width: 1025px)" srcSet="/images/home/light-meets-vapor.jpg" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/home/light-meets-vapor-mobile.jpg"
            alt=""
            className="absolute inset-0 object-cover object-center w-full h-full"
            loading="lazy"
            decoding="async"
          />
        </picture>
      </motion.div>
      {/* Text block — full-bleed image behind, text aligned to site container */}
      <div
        ref={textRef}
        className="absolute inset-0 flex flex-col justify-start lg:justify-center pt-[40px] lg:pt-0"
      >
        <div className="mx-auto w-full max-w-content px-content">
          <div className="w-full lg:max-w-[800px] lg:-translate-y-24" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Headline — Monoton (accent font), two lines */}
            <div>
              <motion.h2
                className="font-accent uppercase text-text-primary block"
                style={{
                  color: "#FFF",
                  fontFamily: "var(--font-monoton)",
                  fontSize: "clamp(45px, 6.5vw, 75px)",
                  fontWeight: 400,
                  lineHeight: "1.1",
                  textShadow: "0 0 40px rgba(255, 0, 229, 0.75)",
                }}
                initial={{ opacity: 0, y: 28 }}
                animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
                transition={{ duration: 0.8, ease: EASE }}
              >
                WHERE LIGHT <br/> AND VAPOR MEET
              </motion.h2>
            </div>
            {/* Body copy */}
            <motion.p
              className="font-body text-text-primary"
              style={{
                fontSize: "clamp(16px, 2.5vw, 25px)",
                lineHeight: "normal",
                fontWeight: 500,
                maxWidth: "600px",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            >
              Clean hits. Lit clouds. The lights catch the exhale on its way out, turning every hit into something you can actually see an experience.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}