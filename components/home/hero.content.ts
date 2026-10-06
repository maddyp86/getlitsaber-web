import { mediaUrl, videoUrl } from "@/lib/media";
import { BASE_UNIT_PRICE, MSRP_UNIT_PRICE } from "@/lib/cart/pricing";

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

/** Rendered as "GET YOURS · ~~$49.99~~ $39.99" (MSRP struck through). */
export const CTA_PRIMARY = {
  label: "GET YOURS",
  price: BASE_UNIT_PRICE,
  msrp: MSRP_UNIT_PRICE,
  href: "/shop/litsaber-og",
};

export const CTA_SECONDARY = {
  label: "SEE IT IN MOTION",
  href: "#be-seen",
};

export const TAGLINE = "Glowsticks die by sunrise. This doesn't. This is Litsaber.";

/** Hero spec pills link to the engineering deep-dive they summarize. */
export const SPEC_PILLS_HREF = "/the-tech";

export { SPEC_PILLS } from "@/components/product/specs.content";
