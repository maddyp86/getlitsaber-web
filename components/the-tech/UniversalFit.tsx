"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  FIT_HEADLINE_LINE1,
  FIT_HEADLINE_ACCENT,
  FIT_BODY,
  CART_LINEUP_IMAGE_SRC,
  CART_LINEUP_IMAGE_ALT,
} from "./the-tech.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function renderEmphasis(text: string) {
  return text.split("**").map((segment, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-bold text-white">
        {segment}
      </strong>
    ) : (
      segment
    )
  );
}


export default function UniversalFit() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      className="relative w-full bg-black"
      aria-label="Universal fit"
    >
       <div className="mx-auto w-full max-w-content px-content pt-[100px]">
        {/* Centered header block */}
        <div className="flex flex-col items-center text-center gap-5 mb-12">

          <motion.h2
            className="font-display font-bold uppercase leading-[normal] max-w-[350px] lg:max-w-[810px]"
            style={{ fontSize: "clamp(45px, 5vw, 75px)" }}
            initial={prefersReduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.75, delay: 0.1, ease: EASE }}
          >
            <span
              className="text-white"
              style={{ textShadow: "0 0 50px rgba(0, 229, 255, 0.75)" }}
            >
              {FIT_HEADLINE_LINE1}
            </span>
            {" "}
            <span
              className="text-accent-cyan"
              style={{ textShadow: "0 0 50px rgba(0,229,255,0.5)" }}
            >
              {FIT_HEADLINE_ACCENT}
            </span>
          </motion.h2>

           {FIT_BODY.map((block, i) => (
            <motion.p
                 key={i}
              className="font-body text-body-sm lg:text-body text-left text-text-secondary leading-relaxed"
              initial={prefersReduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, delay: 0.2, ease: EASE }}
            >
               {renderEmphasis(block)}
            </motion.p>
                  ))}
        </div>
{/* Cart sizes diagram */}
<motion.div
  className="flex flex-col items-center"
  initial={prefersReduced ? false : { opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-60px" }}
  transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
>
  {CART_LINEUP_IMAGE_SRC ? (
    <Image
      src={CART_LINEUP_IMAGE_SRC}
      alt={CART_LINEUP_IMAGE_ALT}
      width={880}
      height={587}
      sizes="(min-width: 1024px) 880px, 100vw"
      className="w-full max-w-[880px] h-auto"
    />
  ) : (
    <div className="w-full max-w-[880px] aspect-[880/587] bg-surface-card flex items-center justify-center">
      <span className="font-label text-eyebrow text-text-muted tracking-widest uppercase">
        Cart Lineup Diagram
      </span>
    </div>
  )}
</motion.div>
      </div>
    </section>
  );
}