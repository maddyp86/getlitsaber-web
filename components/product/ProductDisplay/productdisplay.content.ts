import { mediaUrl } from "@/lib/media";

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
  // Static price string for single/twopack; undefined for "more" (price is derived dynamically)
  price?: string;
  saveLabel?: string;
}

export const BUNDLE_OPTIONS: BundleOption[] = [
  {
    id: "single",
    title: "Single",
    descriptor: "One Litsaber",
    price: "$59.99",
  },
  {
    id: "twopack",
    title: "Two Pack",
    descriptor: "For the lightshow. For the partner. For the never-without.",
    price: "$99.99",
    saveLabel: "SAVE $20",
  },
  {
    id: "more",
    title: "More",
    descriptor: "",
  },
];

export const TRUST_LINE =
  "SHIPS IN 24 HOURS · FREE US SHIPPING · 30-DAY GUARANTEE";

export interface GalleryImage {
  src: string;
  alt: string;
}

export const GALLERY_IMAGES: GalleryImage[] = [
  {
    src: mediaUrl("product/litsaber-lights-off.jpg"),
    alt: "Litsaber OG packaging",
  },
  { src: mediaUrl("product/litsaber-green.jpg"), alt: "Litsaber in green" },
  { src: mediaUrl("product/litsaber-blue.jpg"), alt: "Litsaber in blue" },
  { src: mediaUrl("product/litsaber-white.jpg"), alt: "Litsaber in white" },
  { src: mediaUrl("product/litsaber-red.jpg"), alt: "Litsaber in red" },
];

export const DESCRIPTION_HEADING = "The vape battery that gets people talking.";
export const DESCRIPTION_BODY =
  "Designed for the night. Engineered for the show. Ignite your night with Litsaber, the world's first fully automated, interactive battery that turns every session into a light show. Inspired by iconic sci-fi weapons, it's built to stand out at nightlife spots, EDM festivals, concerts, and beyond. This isn't just a battery. It's your glow-up accessory.";
