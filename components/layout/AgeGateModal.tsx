"use client";

import { useEffect, useState } from "react";

const COOKIE_NAME =
  process.env.NEXT_PUBLIC_AGE_GATE_COOKIE_NAME ?? "litsaber_age_verified";
const COOKIE_MAX_AGE_DAYS = Number(
  process.env.NEXT_PUBLIC_AGE_GATE_COOKIE_MAX_AGE_DAYS ?? "30"
);
const EXIT_URL =
  process.env.NEXT_PUBLIC_AGE_GATE_EXIT_URL ?? "https://www.google.com";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") + "=([^;]*)")
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, maxAgeDays: number) {
  const maxAgeSeconds = maxAgeDays * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAgeSeconds}; path=/; SameSite=Lax`;
}

export default function AgeGateModal() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const verified = getCookie(COOKIE_NAME);
    if (!verified) {
      setVisible(true);
      document.body.classList.add("scroll-locked");
    }
  }, []);

  function handleConfirm() {
    setCookie(COOKIE_NAME, "true", COOKIE_MAX_AGE_DAYS);
    setVisible(false);
    document.body.classList.remove("scroll-locked");
  }

  function handleExit() {
    window.location.href = EXIT_URL;
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      aria-describedby="age-gate-body"
      className="fixed inset-0 z-age-gate flex items-center justify-center p-container-mobile"
      style={{ backgroundColor: "rgba(0,0,0,0.9)" }}
    >
      {/* Modal panel */}
      <div
        className="relative w-full bg-background-elevated rounded-card shadow-modal flex flex-col items-center text-center px-xl py-2xl"
        style={{ maxWidth: "448px" }}
      >
        {/* Logo mark */}
        <div className="mb-lg">
          <span
            className="font-subhead font-bold text-text-primary tracking-widest text-xl"
            aria-hidden="true"
          >
            LITSABER
          </span>
        </div>

        {/* Headline */}
        <h1
          id="age-gate-title"
          className="font-subhead font-bold text-h3 text-text-primary tracking-wider uppercase mb-md"
        >
          You must be 21+ to enter
        </h1>

        {/* Body */}
        <p
          id="age-gate-body"
          className="font-body text-body text-text-secondary leading-relaxed mb-2xl"
        >
          This website contains products intended for adults only. By entering,
          you confirm you are of legal age.
        </p>

        {/* Confirm button */}
        <button
          onClick={handleConfirm}
          className="w-full py-sm mb-md font-label text-label tracking-widest uppercase border border-accent-cyan text-accent-cyan bg-accent-cyan-alpha-10 rounded-md hover:bg-accent-cyan hover:text-background-primary transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
          autoFocus
        >
          I AM 21+
        </button>

        {/* Exit link */}
        <button
          onClick={handleExit}
          className="font-label text-eyebrow text-text-muted hover:text-text-secondary transition-colors duration-200 tracking-widest uppercase underline underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-text-muted rounded"
        >
          EXIT
        </button>
      </div>
    </div>
  );
}
