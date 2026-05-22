"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

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
      style={{ backgroundColor: "rgba(10, 5, 24, 0.85)" }}
    >
      {/* Modal panel */}
      <div
        className="relative w-full flex flex-col items-center text-center rounded-card"
        style={{
          maxWidth: "448px",
          background: "rgba(5, 5, 16, 0.60)",
          border: "1px solid rgba(0, 229, 255, 0.20)",
          boxShadow: "0 0 20px 0 rgba(0, 229, 255, 0.05) inset",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          paddingTop: "50px",
          paddingBottom: "40px",
          paddingLeft: "33px",
          paddingRight: "33px",
        }}
      >
        {/* Logo */}
        <div className="mb-md">
          <Image
            src="/images/global/litsaber-blue.png"
            alt="Litsaber"
            width={125}
            height={40}
            style={{ width: "125px", height: "auto" }}
          />
        </div>

        {/* Headline */}
        <h1
          id="age-gate-title"
          className="font-display font-bold text-text-primary uppercase mb-md"
          style={{ fontSize: "35px", lineHeight: "36px" }}
        >
          You must be 21+<br />to enter
        </h1>

        {/* Body */}
        <p
          id="age-gate-body"
          className="font-body mb-lg"
          style={{
            color: "rgba(240, 240, 245, 0.70)",
            fontSize: "14px",
            lineHeight: "20px",
          }}
        >
          This website contains products intended for adults only.<br />
          By entering, you confirm you are of legal age.
        </p>

        {/* Confirm button */}
        <button
          onClick={handleConfirm}
          className="font-label tracking-widest uppercase text-accent-cyan transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan mb-md"
          style={{
            width: "382px",
            height: "58px",
            background: "#050510",
            border: "1px solid #00E5FF",
            borderRadius: "4px",
            fontSize: "14px",
          }}
          autoFocus
        >
          I AM 21+
        </button>

        {/* Exit button */}
        <button
          onClick={handleExit}
          className="font-label tracking-widest uppercase text-text-primary transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-text-muted"
          style={{
            width: "382px",
            height: "58px",
            background: "transparent",
            border: "1px solid rgba(240, 240, 245, 0.20)",
            borderRadius: "4px",
            fontSize: "14px",
          }}
        >
          EXIT
        </button>
      </div>
    </div>
  );
}
