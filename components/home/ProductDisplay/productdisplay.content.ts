export const PRODUCT_TITLE = "LITSABER OG - Silver";
export const PRODUCT_SUBTITLE = "The Interactive 510 Battery";

export const BUNDLE_PRICES: Record<"single" | "twopack", string> = {
  single: "$59.99",
  twopack: "$99.99",
};

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
    swatchSrc: "/images/product/litsaber-silver.svg",
    swatchAlt: "Silver Litsaber",
  },
  {
    id: "gold",
    label: "GOLD",
    status: "Coming Soon",
    swatchSrc: "/images/product/litsaber-gold.svg",
    swatchAlt: "Gold Litsaber",
  },
];

export interface BundleOption {
  id: "single" | "twopack";
  title: string;
  descriptor: string;
  price: string;
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
    descriptor: "For the lightshow. For the partner. For the never-without",
    price: "$99.99",
    saveLabel: "SAVE $20",
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
    src: "/images/product/litsaber-lights-off.jpg",
    alt: "Litsaber OG packaging",
  },
  { src: "/images/product/litsaber-green.jpg", alt: "Litsaber in green" },
  { src: "/images/product/litsaber-blue.jpg", alt: "Litsaber in blue" },
  { src: "/images/product/litsaber-white.jpg", alt: "Litsaber in white" },
  { src: "/images/product/litsaber-red.jpg", alt: "Litsaber in red" },
];
