"use client";

import { useEffect } from "react";

export default function WhatCustomersSay() {
  useEffect(() => {
    if (document.getElementById("TaggboxWidgetScript")) return;
    const js = document.createElement("script");
    js.id = "TaggboxWidgetScript";
    js.src = "https://widget.taggbox.com/embed.min.js";
    js.type = "text/javascript";
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

        {/* Taggbox TikTok feed widget */}
        <div
          className="taggbox"
          style={{ width: "90%", height: "100%", overflow: "auto" }}
          data-widget-id="326981"
          data-website="1"
        />
      </div>
    </section>
  );
}
