"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { QUICK_LINKS } from "./contact.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function ContactMethods() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      className="relative w-full bg-background-primary"
      aria-label="Quick links"
    >
      <div className="mx-auto w-full max-w-[1250px] px-[20px] lg:px-[60px] py-[48px]">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={prefersReduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <p className="font-label text-eyebrow tracking-[0.2em] uppercase text-text-muted text-xs">
            QUICK LINKS
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {QUICK_LINKS.map((link, i) => (
              <span key={link.href} className="flex items-center gap-6">
                <Link
                  href={link.href}
                  className="font-label text-eyebrow tracking-[0.1em] uppercase text-text-secondary hover:text-accent-cyan transition-colors text-xs"
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
    </section>
  );
}
