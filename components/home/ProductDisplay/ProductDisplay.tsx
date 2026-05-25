"use client";

import { useState } from "react";
import { PRODUCT_TITLE, PRODUCT_SUBTITLE, BUNDLE_PRICES, SPEC_PILLS } from "./productdisplay.content";
import GalleryBlock from "./GalleryBlock";
import StyleSelector from "./StyleSelector";
import BundleAndCTA from "./BundleAndCTA";

export default function ProductDisplay() {
  const [activeThumb, setActiveThumb] = useState(0);
  const [activeStyle, setActiveStyle] = useState<"silver" | "gold">("silver");
  const [activeBundle, setActiveBundle] = useState<"single" | "twopack">("single");

  const displayPrice = BUNDLE_PRICES[activeBundle];

  return (
    <div className="max-w-container mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
        {/* Left: image gallery */}
        <GalleryBlock activeThumb={activeThumb} onThumbClick={setActiveThumb} />

        {/* Right: product info */}
        <div className="flex flex-col gap-6">
          {/* Title + subtitle + price */}
          <div className="flex flex-col gap-2">
            <h1
              className="font-display text-h2 text-text-primary uppercase leading-tight"
              style={{ fontWeight: 700, lineHeight: "1.1" }}
            >
              {PRODUCT_TITLE}
            </h1>
            <p className="font-body text-subhead text-text-secondary">
              {PRODUCT_SUBTITLE}
            </p>
            <p
              className="font-label font-bold text-h2 text-text-primary"
              style={{ textShadow: "0 0 10px #EC5793" }}
            >
              {displayPrice}
            </p>
          </div>

          {/* Spec pills — 2 rows × 3, rectangular (no border radius) */}
          <div className="grid grid-cols-3 gap-2">
            {SPEC_PILLS.map((pill) => (
              <div
                key={pill}
                className="font-label text-label text-accent-cyan border border-accent-cyan/20 text-center px-3 flex items-center justify-center"
                style={{ minHeight: "35px", fontSize: "12px" }}
              >
                {pill}
              </div>
            ))}
          </div>

          {/* Available Styles */}
          <StyleSelector activeStyle={activeStyle} onStyleChange={setActiveStyle} />

          {/* 2c seam: when Gold is selected, replace BundleAndCTA with WaitlistCard */}
          {activeStyle === "gold" ? (
            // TODO 2c: swap to <WaitlistCard /> when gold is selected
            <BundleAndCTA activeBundle={activeBundle} onBundleChange={setActiveBundle} />
          ) : (
            <BundleAndCTA activeBundle={activeBundle} onBundleChange={setActiveBundle} />
          )}
        </div>
      </div>
    </div>
  );
}
