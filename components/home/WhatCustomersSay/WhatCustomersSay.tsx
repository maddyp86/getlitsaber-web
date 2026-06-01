"use client";

import { useEffect } from "react";

export default function WhatCustomersSay() {
  useEffect(() => {
    if (document.getElementById("ElfsightPlatformScript")) return;
    const js = document.createElement("script");
    js.id = "ElfsightPlatformScript";
    js.src = "https://elfsightcdn.com/platform.js";
    js.async = true;
    document.getElementsByTagName("head")[0].appendChild(js);
  }, []);

  return (
    <section
      className="relative py-section-y-mobile lg:py-section-y px-container-mobile lg:px-container"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(0,60,60,0.45) 0%, transparent 70%), #0A0518",
      }}
    >
      <div className="mx-auto flex w-full max-w-container flex-col gap-10">
        {/* Section header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <span
            className="font-label text-eyebrow uppercase tracking-widest text-accent-cyan"
            style={{ textShadow: "0 0 12px #00E5FF" }}
          >
            REVIEWS
          </span>
          <h2
            className="font-display text-h1 uppercase text-text-primary leading-tight"
            style={{ fontWeight: 700, lineHeight: "1.1" }}
          >
            AS SEEN ON TIKTOK
          </h2>
          <p className="font-body text-body text-text-secondary">
            The internet is talking.
          </p>
        </div>

        {/* Elfsight TikTok Feed widget */}
        <div
          className="elfsight-app-524981f9-9c22-458f-bd55-f4584917156e"
          data-elfsight-app-lazy
        />
      </div>
    </section>
  );
}
