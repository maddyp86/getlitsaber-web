"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { QUICK_LINKS } from "./contact.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const DIVIDER_GRADIENT =
  "linear-gradient(90deg, #150C2D 0%, #00E5FF 48.08%, #150C2D 100%)";

export default function ContactMethods() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      className="relative w-full bg-background-[#120C27]"
      aria-label="Quick links"
    >
      {/* Top divider line */}
      <div
        className="mx-auto w-full max-w-content h-px"
        style={{ background: DIVIDER_GRADIENT }}
        aria-hidden="true"
      />

      <div className="mx-auto w-full max-w-content px-content py-[60px]">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={prefersReduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <p className="font-subhead font-bold text-eyebrow uppercase text-white text-[20px]">
            QUICK LINKS
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {QUICK_LINKS.map((link, i) => (
              <span key={link.href} className="flex items-center gap-6">
                <Link
                  href={link.href}
                  className="font-label text-eyebrow uppercase text-text-secondary hover:text-accent-cyan transition-colors text-sm"
                >
                  {link.label}
                </Link>
                {i < QUICK_LINKS.length - 1 && (
                  <span className="text-text-muted text-xs hidden sm:inline" aria-hidden="true">
                    ·
                  </span>
                )}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom divider line */}
      <div
        className="mx-auto w-full max-w-content h-px"
        style={{ background: DIVIDER_GRADIENT }}
        aria-hidden="true"
      />
    </section>
  );
}