import { mediaUrl, videoUrl } from "@/lib/media";

// mediaUrl still used for swatch SVGs below

export const PRODUCT_TITLE = "LITSABER OG";
export const PRODUCT_SUBTITLE = "The Interactive 510 Battery";

export { SPEC_PILLS } from "./specs.content";

export interface StyleOption {
  id: "silver" | "gold";
  label: string;
  status: string;
  swatchSrc: string;
  swatchAlt: string;
}

export const STYLE_OPTIONS: StyleOption[] = [
  {
    id: "silver",
    label: "SILVER",
    status: "In Stock. Ships in 24 hrs",
    swatchSrc: mediaUrl("product/litsaber-silver.svg"),
    swatchAlt: "Silver Litsaber",
  },
  {
    id: "gold",
    label: "GOLD",
    status: "Coming Soon",
    swatchSrc: mediaUrl("product/litsaber-gold.svg"),
    swatchAlt: "Gold Litsaber",
  },
];

// ─── Offers ──────────────────────────────────────────────────────────────────
// Two offers, and they are the whole quantity choice (ADR-009). Prices are
// computed from the live unit price in lib/cart/offers.ts; only copy lives here.
// No savings or percentage badges: the 2-pack's only perk is free shipping.

export interface OfferCopy {
  qty: 1 | 2;
  title: string;
  badge?: string;
}

export const OFFERS: OfferCopy[] = [
  {
    qty: 1,
    title: "Single",
  },
  {
    qty: 2,
    title: "Two Pack",
    badge: "Most popular",
  },
];

export const MSRP_LABEL = "MSRP";
export const FREE_SHIPPING_LABEL = "Free shipping";

export const TRUST_LINE =
  "SHIPS IN 24 HOURS · FREE US SHIPPING ON 2+ · 6-MONTH WARRANTY";

// ─── Comparison table ────────────────────────────────────────────────────────
// Against "a typical light-up 510 battery". Never name a competitor here.

export const COMPARISON = {
  heading: "Litsaber vs. a typical light-up 510",
  columns: ["Litsaber", "Typical light-up 510"] as const,
  rows: [
    { label: "Illumination", litsaber: "Full body, end to end", typical: "Single light ring" },
    { label: "Addressable LEDs", litsaber: "41", typical: "1 ring" },
    { label: "Selectable colors", litsaber: "10", typical: "1" },
    { label: "Interactive modes", litsaber: "3", typical: "On/off" },
    { label: "Build", litsaber: "Aluminum + steel", typical: "Plastic" },
    { label: "Battery", litsaber: "800 mAh", typical: "Often unlisted" },
    { label: "Warranty", litsaber: "Included", typical: "Varies" },
  ],
  warrantyLink: { label: "See the warranty policy", href: "/policies/warranty" },
} as const;

export interface GalleryImage {
  /** Defaults to "image" when omitted. */
  type?: "image" | "video";
  src: string;
  alt: string;
  /** Video only: still frame shown before playback. Falls back to the clip's own first frame. */
  poster?: string;
}

export const GALLERY_IMAGES: GalleryImage[] = [
    { src: "https://0ku6zb3bovdlowuq.public.blob.vercel-storage.com/images/product/litsaber-packaging-2.jpg", alt: "Litsaber OG packaging detail" },
  { src: "https://0ku6zb3bovdlowuq.public.blob.vercel-storage.com/images/product/litsaber-packaging-1.jpg", alt: "Litsaber OG packaging" },
  { type: "video", src: videoUrl("pdp/unbox-pdp.mp4"), alt: "Litsaber unboxing" },
  { type: "video", src: videoUrl("pdp/litsaber-pdp.mp4"), alt: "Litsaber in action" },
  { type: "video", src: videoUrl("pdp/glowstick-pdp.mp4"), alt: "Litsaber glowstick mode" },
  { type: "video", src: videoUrl("pdp/lightshow-pdp.mp4"), alt: "Litsaber light show" },
  { src: "https://0ku6zb3bovdlowuq.public.blob.vercel-storage.com/images/product/litsaber-multi-handheld.jpg", alt: "Multiple Litsabers handheld" },
  { src: "https://0ku6zb3bovdlowuq.public.blob.vercel-storage.com/images/product/litsaber-hand-turqoise.jpg", alt: "Litsaber in turquoise handheld" },
  { src: "https://0ku6zb3bovdlowuq.public.blob.vercel-storage.com/images/product/litsaber-rwb-handheld.jpg", alt: "Litsaber in red, white and blue handheld" },
  { src: "https://0ku6zb3bovdlowuq.public.blob.vercel-storage.com/images/product/litsaber-yellow-handheld.jpg", alt: "Litsaber in yellow handheld" },
  { src: "https://0ku6zb3bovdlowuq.public.blob.vercel-storage.com/images/product/litsaber-fuschia-handheld.jpg", alt: "Litsaber in fuchsia handheld" },
  { src: "https://0ku6zb3bovdlowuq.public.blob.vercel-storage.com/images/product/litsaber_blue_packaging.jpg", alt: "Litsaber blue packaging" },
  { src: "https://0ku6zb3bovdlowuq.public.blob.vercel-storage.com/images/product/litsaber-red.jpg", alt: "Litsaber in red" },
  { src: "https://0ku6zb3bovdlowuq.public.blob.vercel-storage.com/images/product/litsaber-green.jpg", alt: "Litsaber in green" },
  { src: "https://0ku6zb3bovdlowuq.public.blob.vercel-storage.com/images/product/litsaber-blue.jpg", alt: "Litsaber in blue" },
  { src: "https://0ku6zb3bovdlowuq.public.blob.vercel-storage.com/images/product/litsaber-fuschia.jpg", alt: "Litsaber in fuchsia" },
  { src: "https://0ku6zb3bovdlowuq.public.blob.vercel-storage.com/images/product/litsaber-orange.jpg", alt: "Litsaber in orange" },
  { src: "https://0ku6zb3bovdlowuq.public.blob.vercel-storage.com/images/product/litsaber-rwb.jpg", alt: "Litsaber in red, white and blue" },
  { src: "https://0ku6zb3bovdlowuq.public.blob.vercel-storage.com/images/product/litsaber-turqoise.jpg", alt: "Litsaber in turquoise" },
  { src: "https://0ku6zb3bovdlowuq.public.blob.vercel-storage.com/images/product/litsaber-white.jpg", alt: "Litsaber in white" },
  { src: "https://0ku6zb3bovdlowuq.public.blob.vercel-storage.com/images/product/litsaber-yellow.jpg", alt: "Litsaber in yellow" },
  { src: "https://0ku6zb3bovdlowuq.public.blob.vercel-storage.com/images/product/litsaber_multi.jpg", alt: "Multiple Litsabers" },
  { src: "https://0ku6zb3bovdlowuq.public.blob.vercel-storage.com/images/product/litsaber-usbc.jpg", alt: "Litsaber USB-C charging port" },
  { src: "https://0ku6zb3bovdlowuq.public.blob.vercel-storage.com/images/product/litsaber-ubsc-2.jpg", alt: "Litsaber USB-C charging detail" },
  { src: "https://0ku6zb3bovdlowuq.public.blob.vercel-storage.com/images/product/litsaber-thread.jpg", alt: "Litsaber 510-thread connection" },
  { src: "https://0ku6zb3bovdlowuq.public.blob.vercel-storage.com/images/product/litsaber-button.jpg", alt: "Litsaber button detail" },
  { src: "https://0ku6zb3bovdlowuq.public.blob.vercel-storage.com/images/product/litsaber-button-3.jpg", alt: "Litsaber button close-up" },
  { src: "https://0ku6zb3bovdlowuq.public.blob.vercel-storage.com/images/product/litsaber-button-2.jpg", alt: "Litsaber button side view" },
];

export const DESCRIPTION_HEADING = "The 510 battery people walk over to ask about.";
// TODO(copy review): rewrite pending approval. Replaces the Figma copy, which
// used banned words and an off-brand weapon reference.
export const DESCRIPTION_BODY =
  "Designed for the night and built to outlast it. Litsaber is an interactive 510 battery with 41 LEDs that run the full length of the body and respond to every draw. Three modes, ten colors, and an 800 mAh cell that keeps the show going long after the set ends. Made for festivals, nightlife, concerts, and every moment worth showing off. A glowstick dies by sunrise. This doesn't.";
