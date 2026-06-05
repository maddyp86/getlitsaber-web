"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useToastActions } from "@/lib/toast/store";
import { track, EVENTS } from "@/lib/analytics/events";
import {
  DROP_LIST_EYEBROW,
  DROP_LIST_HEADLINE,
  DROP_LIST_BODY,
  DROP_LIST_CTA,
} from "./contact.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EMAIL_RE = /^[^\s@]+@[^\s@]{2,}\.[^\s@]{2,}$/;

export default function FestivalDropList() {
  const prefersReduced = useReducedMotion();
  const { addToast } = useToastActions();
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const isValid = EMAIL_RE.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || submitting) return;
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          list: "general",
          source: "contact-droplist",
          company: honeypot,
        }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (data.ok) {
        track(EVENTS.festival_droplist_signup, { source: "contact-page" });
        addToast({ variant: "success", message: "You're in. Check your inbox." });
        setSubmitted(true);
      } else {
        const msg = data.error ?? "Something went wrong. Please try again.";
        setError(msg);
        addToast({ variant: "error", message: msg });
      }
    } catch {
      const msg = "Network error. Please check your connection and try again.";
      setError(msg);
      addToast({ variant: "error", message: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      className="relative isolate overflow-hidden w-full"
      style={{ background: "#08041A" }}
      aria-label="Festival drop list"
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(157,95,255,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="mx-auto w-full max-w-[1250px] px-[20px] lg:px-[60px] py-[100px]">
        <div className="flex flex-col items-center text-center gap-6 max-w-[680px] mx-auto">
          {/* Eyebrow pill */}
          <motion.span
            className="inline-flex items-center px-4 py-1.5 rounded-full border border-[rgba(0,229,255,0.3)] font-label text-[10px] tracking-[0.2em] uppercase text-accent-cyan"
            initial={prefersReduced ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            {DROP_LIST_EYEBROW}
          </motion.span>

          <motion.h2
            className="font-display font-bold uppercase leading-[1.1]"
            style={{ fontSize: "clamp(45px, 5vw, 75px)" }}
            initial={prefersReduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.75, delay: 0.05, ease: EASE }}
          >
            <span
              className="text-accent-cyan"
              style={{ textShadow: "0 0 50px rgba(0,229,255,0.5)" }}
            >
              {DROP_LIST_HEADLINE}
            </span>
          </motion.h2>

          <motion.p
            className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed"
            initial={prefersReduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          >
            {DROP_LIST_BODY}
          </motion.p>

          {submitted ? (
            <motion.div
              className="flex items-center gap-3 mt-2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <div className="w-8 h-8 rounded-full border-2 border-[#00E5FF] flex items-center justify-center flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M5 12l4.5 4.5 9.5-10"
                    stroke="#00E5FF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="font-label text-eyebrow uppercase tracking-[0.12em] text-accent-cyan text-xs">
                You&apos;re in. Check your inbox.
              </p>
            </motion.div>
          ) : (
            <motion.form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col sm:flex-row gap-3 w-full mt-2"
              initial={prefersReduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, delay: 0.2, ease: EASE }}
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
                style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px" }}
              />

              <div className="flex flex-col gap-1 flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="ENTER YOUR EMAIL"
                  disabled={submitting}
                  aria-label="Email address"
                  className="w-full px-5 py-4 rounded-[5px] border bg-[#0A0515] font-label text-[13px] tracking-widest placeholder:text-text-muted text-white focus:outline-none focus:ring-1 transition-colors disabled:opacity-50"
                  style={{
                    borderColor: error ? "#EC5793" : "#113757",
                  }}
                  onFocus={(e) => {
                    if (!error) e.currentTarget.style.borderColor = "#00E5FF";
                  }}
                  onBlur={(e) => {
                    if (!error) e.currentTarget.style.borderColor = "#113757";
                  }}
                />
                {error && (
                  <p className="font-body text-[12px] text-[#EC5793] text-left">{error}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={!isValid || submitting}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-[5px] border border-[#EC5793] bg-[#EB3D7B] text-white font-label font-bold text-eyebrow uppercase tracking-wider shadow-[0_0_50px_0_rgba(235,62,124,0.40)] transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex-shrink-0"
              >
                {submitting ? "SENDING..." : DROP_LIST_CTA}
              </button>
            </motion.form>
          )}
        </div>
      </div>
    </section>
  );
}
