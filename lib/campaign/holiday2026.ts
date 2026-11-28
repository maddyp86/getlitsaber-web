// Holiday Sale 2026: the ONE file to edit for campaign copy, dates and offer.
// Source: litsaber-holiday-site-requirements.md (Matt, 2026-11-21).
//
// All timestamps are Pacific. The campaign runs in Pacific Standard Time
// throughout (UTC-8), so the offset is written out explicitly.

import { mediaUrl } from "@/lib/media";
import type { Campaign } from "./types";

export const HOLIDAY_2026: Campaign = {
  id: "holiday-2026",
  saleName: "Holiday Sale",
  // Wed Dec 16, 11:59pm Pacific is the last moment of the offer.
  end: "2026-12-17T00:00:00-08:00",
  href: "/shop/litsaber-og",
  pricing: {
    // Two Pack: 2 x $39.99 = $79.98, less $9.99 = $69.99. Mirrors the Shopify
    // automatic discount "Holiday Sale"; the two must change together.
    multiUnitDiscount: 9.99,
    // Shown saving. One cent over the charged discount, so the Two Pack is
    // struck from $79.99 and both offers read "Save $10" (Matt, 2026-11-22).
    // Shopify's checkout shows the true original, $79.98.
    multiUnitSaving: 10,
    freeShippingAll: true,
    shippingAttribute: "holiday-free",
  },
  bar: {
    phases: [
      {
        id: "A",
        start: "2026-11-18T00:00:00-08:00",
        end: "2026-12-01T00:00:00-08:00",
        messages: [
          {
            id: "A1",
            desktop: [
              { text: "Holiday sale: " },
              { text: "$10 off", accent: true },
              { text: " + free US shipping · ends " },
              { text: "Dec 16", accent: true },
            ],
            mobile: [
              { text: "Holiday sale: " },
              { text: "$10 off", accent: true },
              { text: " + free shipping" },
            ],
          },
          {
            id: "A2",
            desktop: [{ text: "Free US shipping on every order. Ships in 2 business days." }],
            mobile: [{ text: "Free US shipping on every order" }],
          },
        ],
      },
      {
        id: "C",
        start: "2026-12-01T00:00:00-08:00",
        end: "2026-12-13T00:00:00-08:00",
        messages: [
          {
            id: "C1",
            desktop: [
              { text: "Order by " },
              { text: "Dec 14", accent: true },
              { text: " for Christmas delivery. Free US shipping." },
            ],
            mobile: [
              { text: "Order by " },
              { text: "Dec 14", accent: true },
              { text: " for Christmas" },
            ],
          },
          {
            id: "C2",
            desktop: [
              { text: "Holiday sale: " },
              { text: "$10 off", accent: true },
              { text: " + free US shipping" },
            ],
            mobile: [{ text: "Holiday sale: " }, { text: "$10 off", accent: true }],
          },
        ],
      },
      {
        id: "D",
        start: "2026-12-13T00:00:00-08:00",
        end: "2026-12-15T00:00:00-08:00",
        messages: [
          {
            id: "D1",
            desktop: [
              { text: "Last call: order by " },
              { text: "Dec 14", accent: true },
              { text: " for Christmas delivery" },
            ],
            mobile: [{ text: "Last call for Christmas delivery" }],
          },
        ],
      },
      {
        id: "E",
        start: "2026-12-15T00:00:00-08:00",
        end: "2026-12-17T00:00:00-08:00",
        messages: [
          {
            id: "E1",
            desktop: [
              { text: "Holiday sale ends " },
              { text: "Dec 16", accent: true },
              { text: ": " },
              { text: "$10 off", accent: true },
              { text: " + free US shipping" },
            ],
            mobile: [
              { text: "Sale ends " },
              { text: "Dec 16", accent: true },
              { text: ": " },
              { text: "$10 off", accent: true },
            ],
          },
        ],
      },
    ],
  },
  copy: {
    freeShippingLabel: "Free US shipping on every order",
    endsLabel: "Ends Dec 16",
    offerLine: "$10 off every Litsaber, plus free US shipping",
    shippingLine: "Free US shipping · Ships within 2 business days",
    offerContents: { 1: "One Litsaber OG", 2: "Two Litsabers" },
    pdpDescription:
      "Litsaber OG, the interactive 510 battery. 41 addressable LEDs, 10 selectable colors, 3 interactive modes, 800 mAh battery, aluminum and brass build, 6-month limited warranty. $39.99, MSRP $49.99. Holiday Sale through Dec 16: Two Pack $69.99, free US shipping on every order.",
  },
  gallery: [
    {
      src: mediaUrl("product/litsaber-holiday-sale.jpg"),
      alt: "Holiday Sale: $10 off plus free US shipping. Litsaber gift box with a red bow between two Litsabers glowing red and green.",
    },
    {
      src: mediaUrl("product/litsaber-key-features-v2-2000x2000.jpg"),
      alt: "Litsaber key features: 510 thread, USB-C charging, dual activation, 41 addressable LEDs and an 800 mAh battery.",
    },
  ],
};

/** Hero copy. Fixed for the whole campaign (requirements section 2.3). */
export const HOLIDAY_HERO = {
  line1: "LIGHT UP",
  line2: "THE HOLIDAYS",
  // "sale" renders semibold cyan, "strong" semibold white, the rest light grey.
  body: [
    { text: "Holiday Sale:", style: "sale" },
    { text: " " },
    { text: "$10 off", style: "strong" },
    { text: " a single or a 2-pack, plus " },
    { text: "free US shipping", style: "strong" },
    { text: " on every order. Ends Dec 16." },
  ] as ReadonlyArray<{ text: string; style?: "sale" | "strong" }>,
  cta: { label: "SHOP NOW", href: "/shop/litsaber-og" },
  desktopImage: mediaUrl("home/holiday-hero-desktop-wide.jpg"),
  mobileImage: mediaUrl("home/holiday-hero-mobile.jpg"),
  alt: "Litsaber gift box with a red bow between two Litsabers glowing red and green, against a starry sky.",
} as const;
