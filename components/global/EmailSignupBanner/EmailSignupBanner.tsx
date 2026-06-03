"use client";

import { useState } from "react";
import { useToastActions } from "@/lib/toast/store";
import { WAITLIST_SOURCES } from "@/lib/forms/sources";

const EMAIL_RE = /^[^\s@]+@[^\s@]{2,}\.[^\s@]{2,}$/;

const TYPO_DOMAINS: Record<string, string> = {
  "gmai.com":    "gmail.com",
  "gmial.com":   "gmail.com",
  "gamil.com":   "gmail.com",
  "gmail.co":    "gmail.com",
  "gnail.com":   "gmail.com",
  "yaho.com":    "yahoo.com",
  "yahooo.com":  "yahoo.com",
  "hotmal.com":  "hotmail.com",
  "hotmial.com": "hotmail.com",
  "outlok.com":  "outlook.com",
  "outook.com":  "outlook.com",
  "iclod.com":   "icloud.com",
};

function getTypoSuggestion(email: string): string | null {
  const at = email.lastIndexOf("@");
  if (at === -1) return null;
  const domain = email.slice(at + 1).toLowerCase();
  return TYPO_DOMAINS[domain] ? `Did you mean ${email.slice(0, at + 1)}${TYPO_DOMAINS[domain]}?` : null;
}

type FormState = "idle" | "submitting" | "error";

export default function EmailSignupBanner() {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const { addToast } = useToastActions();

  const isValid = EMAIL_RE.test(email);
  const typoHint = isValid ? getTypoSuggestion(email) : null;
  const canSubmit = isValid && !typoHint && state !== "submitting";

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
    if (state === "error") {
      setState("idle");
      setErrorMsg("");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setState("submitting");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          list: "general",
          source: WAITLIST_SOURCES.footerSignup,
          company: honeypot,
        }),
      });

      const data = (await res.json()) as { ok: boolean; error?: string };

      if (data.ok) {
        setState("idle");
        setEmail("");
        addToast({ variant: "success", message: "You're in. Check your inbox." });
      } else {
        const msg = data.error ?? "Something went wrong. Please try again.";
        setErrorMsg(msg);
        setState("error");
        addToast({ variant: "error", message: msg });
      }
    } catch {
      const msg = "Network error. Please check your connection and try again.";
      setErrorMsg(msg);
      setState("error");
      addToast({ variant: "error", message: msg });
    }
  }

  return (
    <section
      className="relative overflow-hidden"
      style={{ minHeight: 340 }}
    >
      {/* Background image + gradient overlay */}
      {/* Desktop */}
      <div
        className="absolute inset-0 hidden lg:block"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.00) 0%, rgba(0,0,0,0.50) 47.5%), url(images/global/litsaber-footer-background.webp) lightgray 50% / cover no-repeat",
        }}
        aria-hidden="true"
      />
      {/* Mobile */}
      <div
        className="absolute inset-0 block lg:hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.00) 0%, rgba(0,0,0,0.50) 47.5%), url(images/global/litsaber-footer-background.webp) lightgray 50% / cover no-repeat",
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-container-mobile lg:px-container py-20 lg:py-24 gap-6">
        <h2
          className="font-display font-black uppercase text-white leading-none"
         style={{ fontSize: "clamp(36px, 6vw, 80px)", lineHeight: "1.05" }}
        >
          DON&rsquo;T LEAVE
          <br />
          EMPTY-HANDED.
        </h2>

        <p
          className="font-body text-secondary max-w-2xl leading-relaxed"
          style={{
            fontSize: "clamp(15px, 1.8vw, 18px)",
          }}
        >
          Get $10 off your first Litsaber and early access to the Gold Edition drop. Festival giveaways. No spam. Just the good stuff.
        </p>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col sm:flex-row gap-3 w-full max-w-xl mt-2"
        >
          {/* Honeypot */}
          <input
            type="text"
            name="company"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            style={{ position: "absolute", left: "-9999px", top: "-9999px", width: "1px", height: "1px" }}
          />

          <div className="flex flex-col gap-1 flex-1">
         <input
  type="email"
  value={email}
  onChange={handleEmailChange}
  placeholder="ENTER YOUR EMAIL"
  disabled={state === "submitting"}
  aria-label="Email address"
  aria-describedby={state === "error" ? "email-banner-error" : undefined}
  className="w-full px-5 py-4 font-label tracking-widest placeholder:text-white/50 text-white outline-none transition-colors disabled:opacity-50"
  style={{
    fontSize: "13px",
    background: "rgba(0,0,0,0.45)",
    border: `1px solid ${state === "error" ? "#F56565" : "#00E5FF"}`,
    backdropFilter: "blur(8px)",
    borderRadius: 4,
  }}
  onFocus={(e) => {
    if (state !== "error") e.currentTarget.style.borderColor = "rgba(255,255,255,0.6)";
  }}
  onBlur={(e) => {
    if (state !== "error") e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
  }}
  onMouseEnter={(e) => {
    if (state !== "error") {
      e.currentTarget.style.borderColor = "#00E5FF";
    }
  }}
  onMouseLeave={(e) => {
    if (state !== "error") {
      const isFocused = e.currentTarget === document.activeElement;
      e.currentTarget.style.borderColor = isFocused ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.25)";
    }
  }}
/>
            {state === "error" && (
              <p
                id="email-banner-error"
                role="alert"
                className="font-label text-left"
                style={{ fontSize: "12px", color: "#F56565" }}
              >
                {errorMsg}
              </p>
            )}
            {typoHint && state !== "error" && (
              <p
                role="alert"
                className="font-label text-left"
                style={{ fontSize: "12px", color: "#F59E0B" }}
              >
                {typoHint}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="px-8 py-4 font-label font-bold uppercase tracking-widest text-white transition-opacity hover:opacity-90 active:opacity-75 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
            style={{
              fontSize: "14px",
              background: "#EC5793",
              borderRadius: 4,
              flexShrink: 0,
            }}
          >
            {state === "submitting" ? "SENDING..." : "SEND IT"}
          </button>
        </form>
      </div>
    </section>
  );
}
