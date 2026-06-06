"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useToastActions } from "@/lib/toast/store";
import {
  HERO_HEADLINE_LINE1,
  HERO_HEADLINE_ACCENT,
  HERO_BODY,
  CONTACT_METHODS,
  type ContactMethod,
} from "./contact.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const ICON_SRC: Record<ContactMethod["icon"], string> = {
  email: "/images/icons/mail-svgrepo-com 1.svg",
  phone: "/images/icons/iphone-style-smartphone-material-svgrepo-com 1.svg",
  chat: "/images/icons/radio-button-svgrepo-com 1.svg",
};

function ContactCard({
  method,
  index,
  onChatClick,
}: {
  method: ContactMethod;
  index: number;
  onChatClick: () => void;
}) {
  const prefersReduced = useReducedMotion();
  const isChat = method.icon === "chat";
  const isEmail = method.icon === "email";

  return (
    <motion.div
      className="flex flex-col gap-4 rounded-xl border border-[#1A1035] bg-[#0A0515]/80 p-6 lg:p-8"
      initial={prefersReduced ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: EASE }}
    >
      {/* Icon circle */}
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(0,229,255,0.3)] bg-[rgba(0,229,255,0.05)]">
        <Image
          src={ICON_SRC[method.icon]}
          alt=""
          width={28}
          height={28}
          className="brightness-0 invert [filter:invert(1)_sepia(1)_saturate(3)_hue-rotate(155deg)_brightness(1.2)]"
        />
      </div>

      <div className="flex flex-col gap-1">
        {/* Eyebrow + badge inline */}
        <div className="flex items-center gap-2">
          <p className="font-label text-eyebrow tracking-[0.2em] uppercase text-text-muted text-xs">
            {method.label}
          </p>
          {method.badge && (
            <span className="px-2 py-0.5 rounded-full font-label text-[9px] tracking-[0.12em] uppercase border border-[rgba(255,0,229,0.4)] bg-[rgba(255,0,229,0.1)] text-[#FF00E5]">
              {method.badge}
            </span>
          )}
        </div>

        {/* Value / CTA */}
        {isChat ? (
          <button
            onClick={onChatClick}
            className="font-subhead font-bold text-white text-left transition-colors hover:text-accent-cyan"
            style={{ fontSize: "clamp(16px, 1.8vw, 20px)" }}
          >
            Chat With Us
          </button>
        ) : isEmail ? (
          <Link
            href={`mailto:${method.value}`}
            className="font-subhead font-bold text-white transition-colors hover:text-accent-cyan"
            style={{ fontSize: "clamp(16px, 1.8vw, 20px)" }}
          >
            {method.value}
          </Link>
        ) : (
          <Link
            href={`tel:${method.value.replace(/\D/g, "")}`}
            className="font-subhead font-bold text-white transition-colors hover:text-accent-cyan"
            style={{ fontSize: "clamp(16px, 1.8vw, 20px)" }}
          >
            {method.value}
          </Link>
        )}

        <p className="font-body text-body-sm text-text-secondary leading-relaxed mt-1">
          {method.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function ContactHero() {
  const prefersReduced = useReducedMotion();
  const { addToast } = useToastActions();

  const handleChatClick = () => {
    addToast({ variant: "success", message: "Coming soon. Drop us an email in the meantime." });
  };

  return (
    <section
      className="relative isolate overflow-hidden w-full"
      aria-label="Contact us"
      style={{ background: "#050510" }}
    >
      {/* Purple radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 80%, rgba(75,47,129,0.55) 0%, transparent 70%)",
        }}
      />
      {/* Ambient cyan top */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[300px]"
        style={{
          background:
            "radial-gradient(ellipse 60% 100% at 50% 0%, rgba(0,229,255,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="mx-auto w-full max-w-[1250px] px-[20px] lg:px-[60px] pt-[100px] lg:pt-[140px] pb-[80px] lg:pb-[100px]">
        {/* Headline + body */}
        <div className="flex flex-col items-center text-center gap-6 max-w-[860px] mx-auto mb-[64px] lg:mb-[80px]">
          <motion.h1
            className="font-display font-bold uppercase leading-[1.1]"
            initial={prefersReduced ? false : { opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <span
              className="block text-white"
              style={{
                fontSize: "clamp(55px, 7vw, 100px)",
                textShadow: "0 0 50px rgba(255,255,255,0.75)",
                WebkitTextStrokeWidth: "1px",
                WebkitTextStrokeColor: "#000",
              }}
            >
              {HERO_HEADLINE_LINE1}
            </span>
            <span
              className="block text-white"
              style={{
                fontSize: "clamp(80px, 10vw, 150px)",
                lineHeight: "1",
                textShadow: "0 0 50px rgba(255,255,255,0.75)",
                WebkitTextStrokeWidth: "1px",
                WebkitTextStrokeColor: "#000",
              }}
            >
              {HERO_HEADLINE_ACCENT}
            </span>
          </motion.h1>

          <motion.p
            className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed max-w-[580px]"
            initial={prefersReduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          >
            {HERO_BODY}
          </motion.p>
        </div>

        {/* Contact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CONTACT_METHODS.map((method, i) => (
            <ContactCard
              key={method.label}
              method={method}
              index={i}
              onChatClick={handleChatClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
