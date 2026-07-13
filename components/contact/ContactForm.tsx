"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useToastActions } from "@/lib/toast/store";
import { track, EVENTS } from "@/lib/analytics/events";
import TurnstileWidget, {
  type TurnstileHandle,
} from "@/components/security/TurnstileWidget";
import {
  FORM_HEADLINE,
  FORM_SUBHEAD,
  FORM_REASON_OPTIONS,
} from "./contact.content";

const CAPTCHA_ENABLED = !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const FIELD_BASE =
  "w-full px-4 py-3 rounded-[5px] border bg-[#0A0515] text-white font-body text-body-sm focus:outline-none focus:ring-1 transition-colors";

interface FormFields {
  firstname: string;
  lastname: string;
  email: string;
  reason: string;
  company: string;
  phone: string;
  message: string;
  botField: string;
}

interface FieldErrors {
  firstname?: string;
  lastname?: string;
  email?: string;
}

const EMPTY_FORM: FormFields = {
  firstname: "",
  lastname: "",
  email: "",
  reason: "",
  company: "",
  phone: "",
  message: "",
  botField: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]{2,}\.[^\s@]{2,}$/;

function validate(f: FormFields): FieldErrors {
  const errors: FieldErrors = {};
  if (!f.firstname.trim()) errors.firstname = "Required";
  if (!f.lastname.trim()) errors.lastname = "Required";
  if (!f.email.trim() || !EMAIL_RE.test(f.email)) errors.email = "Valid email required";
  return errors;
}

function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  required,
  autoComplete,
}: {
  label: string;
  name: keyof FormFields;
  type?: string;
  value: string;
  onChange: (name: keyof FormFields, value: string) => void;
  error?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={name}
        className="font-label text-eyebrow text-text-muted uppercase text-xs"
      >
        {label}
        {required && <span className="text-[#EC5793] ml-1">*</span>}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        autoComplete={autoComplete}
        className={[
          FIELD_BASE,
          "placeholder:text-text-muted",
          error
            ? "border-[#EC5793] focus:ring-[#EC5793]"
            : "border-[#113757] focus:border-[#00E5FF] focus:ring-[#00E5FF]",
        ].join(" ")}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <span id={`${name}-error`} className="font-body text-[12px] text-[#EC5793]">
          {error}
        </span>
      )}
    </div>
  );
}

export default function ContactForm() {
  const prefersReduced = useReducedMotion();
  const { addToast } = useToastActions();
  const [fields, setFields] = useState<FormFields>(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const turnstileRef = useRef<TurnstileHandle>(null);

  const handleChange = (name: keyof FormFields, value: string) => {
    setFields((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FieldErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    const validationErrors = validate(fields);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (CAPTCHA_ENABLED && !captchaToken) {
      setServerError("Please complete the verification below before sending.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fields,
          source: "contact-page",
          turnstileToken: captchaToken,
        }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (data.ok) {
        addToast({
          variant: "success",
          message: "Message sent — we'll reply within 24 hours.",
        });
        track(EVENTS.contact_form_submitted, {
          reason: fields.reason || "not specified",
          source: "contact-page",
        });
        setSubmitted(true);
      } else {
        setServerError(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setServerError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
      // Turnstile tokens are single-use — clear and refresh for any retry.
      setCaptchaToken("");
      turnstileRef.current?.reset();
    }
  };

  return (
    <section
      id="contactForm"
      className="relative isolate overflow-hidden w-full"
      style={{ background: "#08041A" }}
      aria-label="Send us a message"
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[400px]"
        style={{
          background:
            "radial-gradient(ellipse 70% 100% at 50% 0%, rgba(0,229,255,0.05) 0%, transparent 70%)",
        }}
      />

    <div className="mx-auto w-full max-w-content px-content py-section-y-mobile lg:py-section-y">
        {/* Section header */}
        <div className="flex flex-col items-center text-center gap-4 mb-12">
          <motion.h2
            className="font-display font-bold uppercase leading-[1.1]"
            style={{ fontSize: "clamp(45px, 5vw, 75px)" }}
            initial={prefersReduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.75, ease: EASE }}
          >
            <span
              className="text-white"
              style={{ textShadow: "0 0 50px rgba(0, 229, 255, 0.75)" }}
            >
              {FORM_HEADLINE}
            </span>
          </motion.h2>

          <motion.p
            className="font-body text-body-sm text-text-secondary leading-relaxed"
            initial={prefersReduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          >
            {FORM_SUBHEAD}
          </motion.p>
        </div>

        {/* Form card */}
        <motion.div
          className="mx-auto w-full max-w-[1250px] rounded-xl border border-[#32205A] bg-[#0E1023] p-6 lg:p-10"
          initial={prefersReduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, delay: 0.15, ease: EASE }}
        >
          {submitted ? (
            <div className="flex flex-col items-center text-center gap-4 py-10">
              <div className="w-14 h-14 rounded-full border-2 border-[#00E5FF] flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M5 12l4.5 4.5 9.5-10"
                    stroke="#00E5FF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p
                className="font-display font-bold text-white uppercase"
                style={{ fontSize: "clamp(18px, 2vw, 24px)" }}
              >
                Message received.
              </p>
              <p className="font-body text-body-sm text-text-secondary leading-relaxed max-w-[360px]">
                We&apos;ll get back to you within 24 hours, usually faster.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              {/* Honeypot */}
              <input
                type="text"
                name="botField"
                value={fields.botField}
                onChange={(e) => handleChange("botField", e.target.value)}
                className="hidden"
                tabIndex={-1}
                aria-hidden="true"
                autoComplete="off"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="First Name"
                  name="firstname"
                  value={fields.firstname}
                  onChange={handleChange}
                  error={errors.firstname}
                  required
                  autoComplete="given-name"
                />
                <InputField
                  label="Last Name"
                  name="lastname"
                  value={fields.lastname}
                  onChange={handleChange}
                  error={errors.lastname}
                  required
                  autoComplete="family-name"
                />
              </div>

              <InputField
                label="Email"
                name="email"
                type="email"
                value={fields.email}
                onChange={handleChange}
                error={errors.email}
                required
                autoComplete="email"
              />

                          <InputField
                label="Mobile Phone Number"
                name="phone"
                type="tel"
                value={fields.phone}
                onChange={handleChange}
                autoComplete="tel"
              />

              {/* Reason select */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="reason"
                  className="font-label text-eyebrow text-text-muted tracking-[0.1em] uppercase text-xs"
                >
                  Reason for Contact
                </label>
                <select
                  id="reason"
                  name="reason"
                  value={fields.reason}
                  onChange={(e) => handleChange("reason", e.target.value)}
                  className={[
                    FIELD_BASE,
                    "appearance-none",
                    "border-[#113757] focus:border-[#00E5FF] focus:ring-[#00E5FF]",
                    fields.reason === "" ? "text-text-muted" : "text-white",
                  ].join(" ")}
                >
                  <option value="">Select one (optional)</option>
                  {FORM_REASON_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className="bg-[#0A0515]">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <InputField
                label="Company / Brand Name"
                name="company"
                value={fields.company}
                onChange={handleChange}
                autoComplete="organization"
              />

              {/* Message textarea */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="message"
                  className="font-label text-eyebrow text-text-muted tracking-[0.1em] uppercase text-xs"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={fields.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  rows={5}
                  className={[
                    FIELD_BASE,
                    "placeholder:text-text-muted resize-none",
                    "border-[#113757] focus:border-[#00E5FF] focus:ring-[#00E5FF]",
                  ].join(" ")}
                />
              </div>

              {CAPTCHA_ENABLED && (
                <TurnstileWidget
                  ref={turnstileRef}
                  onToken={setCaptchaToken}
                  onExpire={() => setCaptchaToken("")}
                  onError={() => setCaptchaToken("")}
                  className="mt-1"
                />
              )}

              {serverError && (
                <p className="font-body text-[13px] text-[#EC5793] leading-snug">
                  {serverError}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 flex items-center justify-center gap-[10px] w-full p-5 rounded-[5px] border border-[#EC5793] bg-[#EB3D7B] text-white font-label font-bold text-eyebrow uppercase tracking-wider shadow-[0_0_50px_0_rgba(235,62,124,0.50)] transition-all hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Sending..." : "SEND MESSAGE"}
                {!submitting && (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="shrink-0"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
