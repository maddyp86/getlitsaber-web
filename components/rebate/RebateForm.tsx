"use client";

import { useRef, useState } from "react";
import { useToastActions } from "@/lib/toast/store";
import TurnstileWidget, {
  type TurnstileHandle,
} from "@/components/security/TurnstileWidget";
import { EVENTS, track } from "@/lib/analytics/events";
import { identifyByEmail } from "@/lib/analytics/identify";
import { FORM_CARD_TITLE, PLATFORM_OPTIONS } from "./rebate.content";

const SOURCE = "rebate-page";

const FIELD_BASE =
  "w-full px-4 py-3 rounded-[5px] border bg-[#0A0515] text-white font-body text-body-sm focus:outline-none focus:ring-1 transition-colors";

const CAPTCHA_ENABLED = !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const EMAIL_RE = /^[^\s@]+@[^\s@]{2,}\.[^\s@]{2,}$/;

interface FormFields {
  lastname: string;
  firstname: string;
  orderNumber: string;
  email: string;
  platform: string;
  postUrl: string;
  botField: string;
}

interface FieldErrors {
  lastname?: string;
  firstname?: string;
  orderNumber?: string;
  email?: string;
  platform?: string;
  postUrl?: string;
}

const EMPTY_FORM: FormFields = {
  lastname: "",
  firstname: "",
  orderNumber: "",
  email: "",
  platform: "",
  postUrl: "",
  botField: "",
};

function validate(f: FormFields): FieldErrors {
  const errors: FieldErrors = {};
  if (!f.lastname.trim()) errors.lastname = "Required";
  if (!f.firstname.trim()) errors.firstname = "Required";
  if (!f.orderNumber.trim()) errors.orderNumber = "Required";
  if (!f.email.trim() || !EMAIL_RE.test(f.email))
    errors.email = "Valid email required";
  if (!f.platform) errors.platform = "Required";
  if (!f.postUrl.trim() || !/^https?:\/\//i.test(f.postUrl.trim()))
    errors.postUrl = "Enter the full link to your post";
  return errors;
}

function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  autoComplete,
}: {
  label: string;
  name: keyof FormFields;
  type?: string;
  value: string;
  onChange: (name: keyof FormFields, value: string) => void;
  error?: string;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={name}
        className="font-label text-eyebrow text-text-muted tracking-[0.1em] uppercase text-xs"
      >
        {label}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
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

export default function RebateForm() {
  const { addToast } = useToastActions();
  const [fields, setFields] = useState<FormFields>(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const turnstileRef = useRef<TurnstileHandle>(null);
  const startedRef = useRef(false);

  const handleChange = (name: keyof FormFields, value: string) => {
    // Fire once, on the first real field interaction.
    if (!startedRef.current) {
      startedRef.current = true;
      track(EVENTS.rebate_form_started, {});
    }
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
      setServerError("Please complete the verification below before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/rebate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fields,
          source: SOURCE,
          turnstileToken: captchaToken,
        }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (data.ok) {
        identifyByEmail(fields.email);
        track(EVENTS.rebate_form_submitted, {
          first_name: fields.firstname,
          last_name: fields.lastname,
          email: fields.email,
          order_number: fields.orderNumber,
          platform: fields.platform,
          post_url: fields.postUrl,
          source: SOURCE,
        });
        addToast({
          variant: "success",
          message:
            "Got it. We'll confirm your post and send your $5 back within 3 to 5 business days.",
        });
        setSubmitted(true);
      } else {
        track(EVENTS.rebate_submit_error, {
          reason: data.error ?? "unknown",
          source: SOURCE,
        });
        setServerError(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      track(EVENTS.rebate_submit_error, { reason: "network_error", source: SOURCE });
      setServerError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
      // Turnstile tokens are single-use — clear and refresh for any retry.
      setCaptchaToken("");
      turnstileRef.current?.reset();
    }
  };

  return (
    <div
      id="claim"
      className="w-full rounded-xl border border-[#32205A] bg-[#0E1023] p-6 lg:p-8 scroll-mt-28"
    >
      <h2
        className="font-display font-bold text-white uppercase mb-6"
        style={{ fontSize: "clamp(24px, 3vw, 34px)" }}
      >
        {FORM_CARD_TITLE}
      </h2>

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
            Submission received.
          </p>
          <p className="font-body text-body-sm text-text-secondary leading-relaxed max-w-[360px]">
            {"We'll confirm your post and refund $5 to your original payment method, usually within 3 to 5 business days."}
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
              autoComplete="given-name"
            />
            <InputField
              label="Last Name"
              name="lastname"
              value={fields.lastname}
              onChange={handleChange}
              error={errors.lastname}
              autoComplete="family-name"
            />
          </div>

          <InputField
            label="Order #"
            name="orderNumber"
            value={fields.orderNumber}
            onChange={handleChange}
            error={errors.orderNumber}
            placeholder="#1382 · from your confirmation email"
          />

          <InputField
            label="Email Address"
            name="email"
            type="email"
            value={fields.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="Email address used on your order"
            autoComplete="email"
          />

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="platform"
              className="font-label text-eyebrow text-text-muted tracking-[0.1em] uppercase text-xs"
            >
              Platform
            </label>
            <select
              id="platform"
              name="platform"
              value={fields.platform}
              onChange={(e) => handleChange("platform", e.target.value)}
              className={[
                FIELD_BASE,
                "appearance-none",
                errors.platform
                  ? "border-[#EC5793] focus:ring-[#EC5793]"
                  : "border-[#113757] focus:border-[#00E5FF] focus:ring-[#00E5FF]",
                fields.platform === "" ? "text-text-muted" : "text-white",
              ].join(" ")}
              aria-invalid={!!errors.platform}
              aria-describedby={errors.platform ? "platform-error" : undefined}
            >
              <option value="" disabled>
                Select social platform
              </option>
              {PLATFORM_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="bg-[#0A0515]">
                  {opt}
                </option>
              ))}
            </select>
            {errors.platform && (
              <span id="platform-error" className="font-body text-[12px] text-[#EC5793]">
                {errors.platform}
              </span>
            )}
          </div>

          <InputField
            label="Link to your post"
            name="postUrl"
            type="url"
            value={fields.postUrl}
            onChange={handleChange}
            error={errors.postUrl}
            placeholder="https://"
          />

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
            {submitting ? "Submitting..." : "SUBMIT REBATE FORM"}
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
    </div>
  );
}
