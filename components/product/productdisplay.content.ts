import { mediaUrl, videoUrl } from "@/lib/media";

// mediaUrl still used for swatch SVGs below

export const PRODUCT_TITLE = "LITSABER OG";
export const PRODUCT_SUBTITLE = "The Interactive 510 Battery";

export const SPEC_PILLS = [
  "USB-C charging",
  "3 modes",
  "800 mAh",
  "10 colors",
  "3 voltage",
  "Pre-heat",
] as const;

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

export type BundleId = "single" | "twopack" | "more";

export interface BundleOption {
  id: BundleId;
  title: string;
  descriptor: string;
}

export const BUNDLE_OPTIONS: BundleOption[] = [
  {
    id: "single",
    title: "Single",
    descriptor: "One Litsaber",
  },
  {
    id: "twopack",
    title: "Two Pack",
    descriptor: "For the lightshow. For the partner. For the never-without.",
  },
  {
    id: "more",
    title: "More",
    descriptor: "",
  },
];

export const TRUST_LINE =
  "SHIPS IN 24 HOURS · FREE US SHIPPING · 6 MONTH GUARANTEE";

export interface GalleryImage {
  /** Defaults to "image" when omitted. */
  type?: "image" | "video";
  src: string;
  alt: string;
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

export const DESCRIPTION_HEADING = "The vape battery that gets people talking.";
export const DESCRIPTION_BODY =
  "Designed for the night. Engineered for the show. Ignite your night with Litsaber, the world's first fully automated, interactive battery that turns every session into a light show. Inspired by iconic sci-fi weapons, it's built to stand out at nightlife spots, EDM festivals, concerts, and beyond. This isn't just a battery. It's your glow-up accessory.";
