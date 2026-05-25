"use client";

import { useState } from "react";

export default function WaitlistCard() {
  const [email, setEmail] = useState("");

  function handleNotify() {
    // TODO 3c: submit to HubSpot Gold waitlist form
  }

  return (
    <div
      className="flex flex-col gap-5 rounded-selector p-6 border"
      style={{
        background: "#120F2C",
        borderColor: "#0E3A56",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="flex-shrink-0"
        >
          <path
            d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
            stroke="#EC5793"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.73 21a2 2 0 0 1-3.46 0"
            stroke="#EC5793"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h3
          className="font-display uppercase text-text-primary leading-tight"
          style={{ fontWeight: 700, fontSize: "25px" }}
        >
          Gold Edition Drops Soon
        </h3>
      </div>

      {/* Descriptor */}
      <p className="font-body text-[14px] text-text-secondary leading-snug">
        Be the first to know. Get 24hr early access and first pick before it opens to the public.
      </p>

      {/* Email input */}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        className="w-full rounded-md px-4 py-3 font-body text-[14px] text-text-primary placeholder:text-text-muted outline-none border border-transparent focus:border-accent-cyan transition-colors"
        style={{ background: "rgba(255,255,255,0.06)" }}
      />

      {/* CTA */}
      <button
        type="button"
        onClick={handleNotify}
        className="w-full rounded-md py-4 px-4 font-label font-bold text-[16px] transition-opacity hover:opacity-90 active:opacity-75"
        style={{
          background: "#270513",
          border: "1px solid #EC5793",
          color: "#EC5793",
        }}
      >
        GET NOTIFIED
      </button>
    </div>
  );
}
