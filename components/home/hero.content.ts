import { mediaUrl, videoUrl } from "@/lib/media";
import { BASE_UNIT_PRICE } from "@/lib/cart/pricing";

export const HERO_VIDEO_SRC = videoUrl("home/litsaber-hero.mp4");
export const HERO_POSTER_SRC = mediaUrl("home/litsaber-hero-image.png");

export const HEADLINE_DESKTOP = {
  white: "HIGHLIGHT",
  cyan: "THE NIGHT",
};

export const HEADLINE_MOBILE = {
  white: "HIGHLIGHT",
  cyan: "THE NIGHT",
};

export const SUBHEADLINE =
  "An interactive 510 battery engineered for festivals, nightlife, and the moments worth showing off. Built to last long after the lights come up.";

/** Rendered as "GET YOURS · $39.99". The MSRP anchor lives on the PDP. */
export const CTA_PRIMARY = {
  label: "GET YOURS",
  price: BASE_UNIT_PRICE,
  href: "/shop/litsaber-og",
};

// The modes section shows the device working (roadmap phase 8, owner
// 2026-10-13). The anchor is on its LazyMount wrapper (app/page.tsx).
export const CTA_SECONDARY = {
  label: "SEE IT IN MOTION",
  href: "#three-modes",
};

export const TAGLINE = "Glowsticks die by sunrise. This doesn't. This is Litsaber.";

/** Hero spec pills link to the engineering deep-dive they summarize. */
export const SPEC_PILLS_HREF = "/the-tech";

export { SPEC_PILLS } from "@/components/product/specs.content";
