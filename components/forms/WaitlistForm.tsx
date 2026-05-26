"use client";

import { useState } from "react";
import type { WaitlistSource } from "@/lib/forms/sources";

type WaitlistList = "gold" | "general";
type FormState = "idle" | "submitting" | "success" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]{2,}\.[^\s@]{2,}$/;

// Common fat-finger domains → suggested correction
const TYPO_DOMAINS: Record<string, string> = {
  "gmai.com":   "gmail.com",
  "gmial.com":  "gmail.com",
  "gamil.com":  "gmail.com",
  "gmail.co":   "gmail.com",
  "gnail.com":  "gmail.com",
  "yaho.com":   "yahoo.com",
  "yahooo.com": "yahoo.com",
  "hotmal.com": "hotmail.com",
  "hotmial.com":"hotmail.com",
  "outlok.com": "outlook.com",
  "outook.com": "outlook.com",
  "iclod.com":  "icloud.com",
};

function getTypoSuggestion(email: string): string | null {
  const at = email.lastIndexOf("@");
  if (at === -1) return null;
  const domain = email.slice(at + 1).toLowerCase();
  return TYPO_DOMAINS[domain] ? `Did you mean ${email.slice(0, at + 1)}${TYPO_DOMAINS[domain]}?` : null;
}

const DEFAULT_SOURCE: Record<WaitlistList, string> = {
  gold: "gold-waitlist",
  general: "general-signup",
};

interface WaitlistFormProps {
  list: WaitlistList;
  headline: string;
  copy: string;
  buttonLabel: string;
  /** HubSpot pageName/source — defaults to "gold-waitlist" or "general-signup" */
  source?: WaitlistSource;
  /** Optional slash-prefixed eyebrow label above the headline (e.g. "/ GOLD EDITION") */
  eyebrow?: string;
  /** Called after a successful submission */
  onSuccess?: () => void;
  /** Strip the card border/background/padding — use when the parent is already a card */
  cardless?: boolean;
}

export default function WaitlistForm({
  list,
  headline,
  copy,
  buttonLabel,
  source,
  eyebrow,
  onSuccess,
  cardless = false,
}: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const isValid = EMAIL_RE.test(email);
  const typoHint = isValid ? getTypoSuggestion(email) : null;
  const canSubmit = isValid && !typoHint;

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
    if (state === "error") {
      setState("idle");
      setErrorMsg("");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || state === "submitting") return;

    setState("submitting");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          list,
          source: source ?? DEFAULT_SOURCE[list],
          company: honeypot,
        }),
      });

      const data = (await res.json()) as { ok: boolean; error?: string };

      if (data.ok) {
        setState("success");
        onSuccess?.();
      } else {
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
        setState("error");
      }
    } catch {
      setErrorMsg("Network error. Please check your connection and try again.");
      setState("error");
    }
  }

  return (
    <div
      className={cardless ? "flex flex-col gap-5" : "flex flex-col gap-5 p-6 pt-8"}
      style={cardless ? undefined : {
        borderRadius: "20px",
        border: "1px solid rgba(0, 229, 255, 0.20)",
        background: "#0F0F1F",
      }}
    >
      {/* Header */}
      <div className="flex flex-col gap-2">
        {eyebrow && (
          <p className="font-label text-eyebrow text-text-accent tracking-widest uppercase">
            {eyebrow}
          </p>
        )}
        <h3
          className="font-subhead font-bold text-text-primary uppercase leading-tight"
          style={{ fontSize: "20px" }}
        >
          {headline}
        </h3>
        <p className="font-body text-text-secondary leading-snug" style={{ fontSize: "14px" }}>
          {copy}
        </p>
      </div>

      {/* Success state — replaces input+button in place */}
      {state === "success" ? (
        <div className="flex flex-col gap-2 py-2">
          <p
            className="font-label font-bold text-accent-cyan uppercase tracking-widest"
            style={{ fontSize: "14px" }}
          >
            You&apos;re on the list.
          </p>
          <p className="font-body text-text-muted" style={{ fontSize: "13px" }}>
            We&apos;ll reach out when it&apos;s time.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
          {/* Honeypot: visible to bots, invisible to humans */}
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
          <div className="flex flex-col gap-1">
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Your email address"
              disabled={state === "submitting"}
              aria-label="Email address"
              aria-describedby={state === "error" ? "waitlist-error" : undefined}
              className="w-full rounded-md px-4 py-3 font-body text-text-primary placeholder:text-text-muted outline-none transition-colors disabled:opacity-50"
              style={{
                fontSize: "14px",
                background: "rgba(255, 255, 255, 0.06)",
                border: `1px solid ${state === "error" ? "#F56565" : "#373767"}`,
              }}
              onFocus={(e) => {
                if (state !== "error") {
                  e.currentTarget.style.borderColor = "#00E5FF";
                }
              }}
              onBlur={(e) => {
                if (state !== "error") {
                  e.currentTarget.style.borderColor = "#373767";
                }
              }}
            />
            {state === "error" && (
              <p
                id="waitlist-error"
                role="alert"
                className="font-label"
                style={{ fontSize: "12px", color: "#F56565" }}
              >
                {errorMsg}
              </p>
            )}
            {typoHint && state !== "error" && (
              <p
                role="alert"
                className="font-label"
                style={{ fontSize: "12px", color: "#F59E0B" }}
              >
                {typoHint}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!canSubmit || state === "submitting"}
            className="w-full rounded-md py-4 px-4 font-label font-bold uppercase tracking-widest transition-opacity hover:opacity-90 active:opacity-75 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              fontSize: "16px",
              background: "#270513",
              border: "1px solid #EC5793",
              color: state === "submitting" ? "rgba(236, 87, 147, 0.5)" : "#EC5793",
            }}
          >
            {state === "submitting" ? "SUBMITTING..." : buttonLabel}
          </button>
        </form>
      )}
    </div>
  );
}
