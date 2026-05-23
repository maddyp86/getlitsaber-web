"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import ResponsiveImage from "@/components/primitives/ResponsiveImage";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function LightMeetsVapor() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) { setVisible(true); return; }
    const el = ref.current;
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
      id="light-meets-vapor"
      className="relative w-full overflow-hidden [aspect-ratio:375/600] lg:[aspect-ratio:8/5]"
      aria-label="Where Light and Vapor Meet"
    >
      {/* Full-bleed background image — desktop / mobile swap */}
      <ResponsiveImage
        desktopSrc="/images/home/light-meets-vapor.jpg"
        mobileSrc="/images/home/light-meets-vapor-mobile.jpg"
        alt=""
      />

     

      {/* Text block — top-aligned on mobile (content starts near top), centered on desktop */}
      <div
        ref={ref}
        className="absolute inset-0 flex flex-col justify-start lg:justify-center px-[20px] lg:px-[70px] pt-[40px]"
      >
        <div className="w-full lg:max-w-[750px] lg:-translate-y-16" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

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
              fontSize: "clamp(16px, 1.5vw, 25px)",
              lineHeight: "normal",
              fontweight: 500,
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
    </section>
  );
}
