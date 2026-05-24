export const PRODUCT_TITLE = "LITSABER OG - Silver";
export const PRODUCT_SUBTITLE = "The Interactive 510 Battery";
export const PRODUCT_PRICE = "$59.99";

export const SPEC_PILLS = [
  "USB-C charging",
  "3 modes",
  "800 mAh",
  "10 colors",
  "3 voltage",
  "Pre-heat",
] as const;

export interface StyleOption {
  id: string;
  label: string;
  status: string;
  swatchSrc: string;
  swatchAlt: string;
  active: boolean;
}

export const STYLE_OPTIONS: StyleOption[] = [
  {
    id: "silver",
    label: "SILVER",
    status: "In Stock. Ships in 24 hrs",
    swatchSrc: "/images/product/litsaber-silver.svg",
    swatchAlt: "Silver Litsaber",
    active: true,
  },
  {
    id: "gold",
    label: "GOLD",
    status: "Coming Soon",
    swatchSrc: "/images/product/litsaber-gold.svg",
    swatchAlt: "Gold Litsaber",
    active: false,
  },
];

export interface BundleOption {
  id: string;
  title: string;
  descriptor: string;
  price: string;
  saveLabel?: string;
  active: boolean;
}

export const BUNDLE_OPTIONS: BundleOption[] = [
  {
    id: "single",
    title: "Single",
    descriptor: "One Litsaber",
    price: "$59.99",
    active: true,
  },
  {
    id: "two-pack",
    title: "Two Pack",
    descriptor: "For the lightshow. For the partner. For the never-without",
    price: "$99.99",
    saveLabel: "SAVE $20",
    active: false,
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
  { src: "/images/product/litsaber-green.JPG", alt: "Litsaber in green" },
  { src: "/images/product/litsaber-blue.JPG", alt: "Litsaber in blue" },
  { src: "/images/product/litsaber-white.JPG", alt: "Litsaber in white" },
  { src: "/images/product/litsaber-red.JPG", alt: "Litsaber in red" },
];
