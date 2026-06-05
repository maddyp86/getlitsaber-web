"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  CTA_EYEBROW,
  CTA_HEADLINE_PART1,
  CTA_HEADLINE_ACCENT,
  CTA_BODY,
  CTA_BULLETS,
  FORM_CARD_TITLE,
  FORM_CARD_SUBTITLE,
  RETAIL_LOCATION_OPTIONS,
  FIRST_ORDER_OPTIONS,
} from "./wholesale.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface FormFields {
  firstname: string;
  lastname: string;
  email: string;
  company: string;
  phone: string;
  state: string;
  retailLocations: string;
  firstOrderSize: string;
  referralSource: string;
  botField: string;
}

interface FieldErrors {
  firstname?: string;
  lastname?: string;
  email?: string;
  company?: string;
  state?: string;
  retailLocations?: string;
  firstOrderSize?: string;
}

const EMPTY_FORM: FormFields = {
  firstname: "",
  lastname: "",
  email: "",
  company: "",
  phone: "",
  state: "",
  retailLocations: "",
  firstOrderSize: "",
  referralSource: "",
  botField: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]{2,}\.[^\s@]{2,}$/;

function validate(f: FormFields): FieldErrors {
  const errors: FieldErrors = {};
  if (!f.firstname.trim()) errors.firstname = "Required";
  if (!f.lastname.trim()) errors.lastname = "Required";
  if (!f.email.trim() || !EMAIL_RE.test(f.email)) errors.email = "Valid email required";
  if (!f.company.trim()) errors.company = "Required";
  if (!f.state.trim()) errors.state = "Required";
  if (!f.retailLocations) errors.retailLocations = "Required";
  if (!f.firstOrderSize) errors.firstOrderSize = "Required";
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
  placeholder,
}: {
  label: string;
  name: keyof FormFields;
  type?: string;
  value: string;
  onChange: (name: keyof FormFields, value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-label text-eyebrow text-text-muted tracking-[0.1em] uppercase text-xs">
        {label}
        {required && <span className="text-[#EC5793] ml-1">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        className={[
          "w-full px-4 py-3 rounded-[5px] border bg-[#0A0515] text-white font-body text-body-sm placeholder:text-text-muted focus:outline-none focus:ring-1 transition-colors",
          error
            ? "border-[#EC5793] focus:ring-[#EC5793]"
            : "border-[#32205A] focus:border-[#00E5FF] focus:ring-[#00E5FF]",
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

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required,
}: {
  label: string;
  name: keyof FormFields;
  value: string;
  onChange: (name: keyof FormFields, value: string) => void;
  options: readonly string[];
  error?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-label text-eyebrow text-text-muted tracking-[0.1em] uppercase text-xs">
        {label}
        {required && <span className="text-[#EC5793] ml-1">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className={[
          "w-full px-4 py-3 rounded-[5px] border bg-[#0A0515] text-white font-body text-body-sm focus:outline-none focus:ring-1 transition-colors appearance-none",
          error
            ? "border-[#EC5793] focus:ring-[#EC5793]"
            : "border-[#32205A] focus:border-[#00E5FF] focus:ring-[#00E5FF]",
          value === "" ? "text-text-muted" : "text-white",
        ].join(" ")}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      >
        <option value="" disabled>
          Select one
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-[#0A0515]">
            {opt}
          </option>
        ))}
      </select>
      {error && (
        <span id={`${name}-error`} className="font-body text-[12px] text-[#EC5793]">
          {error}
        </span>
      )}
    </div>
  );
}

export default function WholesaleCta() {
  const prefersReduced = useReducedMotion();
  const [fields, setFields] = useState<FormFields>(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

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

    setSubmitting(true);
    try {
      const res = await fetch("/api/wholesale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fields,
          source: "wholesale-page",
        }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (data.ok) {
        setSubmitted(true);
      } else {
        setServerError(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setServerError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="apply"
      className="relative isolate overflow-hidden w-full bg-background-primary"
      aria-label="Apply for wholesale access"
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[500px]"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(157,95,255,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="mx-auto w-full max-w-[1250px] px-[20px] lg:px-[60px] py-[100px]">
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-16">
          {/* Left panel */}
          <motion.div
            className="flex flex-col gap-6 min-w-[600px] lg:flex-1 lg:pt-2"
            initial={prefersReduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.75, ease: EASE }}
          >
            <p className="font-label text-eyebrow tracking-[0.2em] uppercase text-accent-cyan">
              {CTA_EYEBROW}
            </p>

            <h2
              className="font-display font-bold uppercase leading-[1.1]"
              style={{ fontSize: "clamp(45px, 5vw, 75px)" }}
            >
              <span
                className="block text-white"
                style={{ textShadow: "0 0 50px rgba(0,229,255,0.6)" }}
              >
                {CTA_HEADLINE_PART1}
              </span>
              <span
                className="block text-accent-cyan"
                style={{ textShadow: "0 0 50px rgba(0,229,255,0.4)" }}
              >
                {CTA_HEADLINE_ACCENT}
              </span>
            </h2>

            <p className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed max-w-[480px]">
              {CTA_BODY}
            </p>

            <ul className="flex flex-col gap-3 mt-2">
              {CTA_BULLETS.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    className="flex-shrink-0 mt-0.5"
                    aria-hidden="true"
                  >
                    <circle cx="9" cy="9" r="8.25" stroke="#00E5FF" strokeWidth="1.5" />
                    <path
                      d="M5.5 9l2.5 2.5 4.5-5"
                      stroke="#00E5FF"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="font-body text-body-sm text-text-secondary leading-relaxed">
                    {bullet}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right panel — form card */}
          <motion.div
            className="mt-12 lg:mt-0 w-full lg:w-[550px] lg:flex-shrink-0 rounded-xl border border-[#32205A] bg-[#0A0515] p-6 lg:p-8"
            initial={prefersReduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.75, delay: 0.15, ease: EASE }}
          >
            <div className="flex flex-col gap-1 mb-6">
              <h3
                className="font-label font-bold text-white"
                style={{ fontSize: "clamp(18px, 2vw, 24px)" }}
              >
                {FORM_CARD_TITLE}
              </h3>
              <p className="font-body text-eyebrow tracking-[0.15em] uppercase text-accent-cyan text-xs">
                {FORM_CARD_SUBTITLE}
              </p>
            </div>

            {submitted ? (
              <div className="flex flex-col items-center text-center gap-4 py-10">
                <div className="w-14 h-14 rounded-full border-2 border-[#00E5FF] flex items-center justify-center">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
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
                  Application received.
                </p>
                <p className="font-body text-body-sm text-text-secondary leading-relaxed max-w-[360px]">
                  We&apos;ll follow up within 24 hours with your pricing sheet and next steps.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                {/* Honeypot — hidden from real users, visible to bots */}
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
                  />
                  <InputField
                    label="Last Name"
                    name="lastname"
                    value={fields.lastname}
                    onChange={handleChange}
                    error={errors.lastname}
                    required
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
                />

                <InputField
                  label="Company Name"
                  name="company"
                  value={fields.company}
                  onChange={handleChange}
                  error={errors.company}
                  required
                />

                <InputField
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={fields.phone}
                  onChange={handleChange}
                />

                <InputField
                  label="State / Region"
                  name="state"
                  value={fields.state}
                  onChange={handleChange}
                  error={errors.state}
                  required
                  placeholder="e.g. California"
                />

                <SelectField
                  label="Number of Retail Locations"
                  name="retailLocations"
                  value={fields.retailLocations}
                  onChange={handleChange}
                  options={RETAIL_LOCATION_OPTIONS}
                  error={errors.retailLocations}
                  required
                />

                <SelectField
                  label="Estimated First Order Size"
                  name="firstOrderSize"
                  value={fields.firstOrderSize}
                  onChange={handleChange}
                  options={FIRST_ORDER_OPTIONS}
                  error={errors.firstOrderSize}
                  required
                />

                <div className="flex flex-col gap-1.5">
                  <label className="font-label text-eyebrow text-text-muted tracking-[0.1em] uppercase text-xs">
                    How did you hear about us?
                  </label>
                  <textarea
                    name="referralSource"
                    value={fields.referralSource}
                    onChange={(e) => handleChange("referralSource", e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-[5px] border border-[#32205A] bg-[#0A0515] text-white font-body text-body-sm placeholder:text-text-muted focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-colors resize-none"
                    placeholder="TikTok, a rep, a show..."
                  />
                </div>

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
                  {submitting ? "Submitting..." : "SUBMIT APPLICATION"}
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
      </div>
    </section>
  );
}
