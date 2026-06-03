export const EYEBROW = "UNDER THE HOOD";

export const HEADLINE = "ENGINEERED TO STAND OUT";

export const SUBHEADLINE =
  "A one of a kind interactive battery product packed with state of the art. Six components. Zero compromises. Every choice made so it earns the price.";

export const EXPLODED_IMAGE = {
  src: "/images/home/exploded-transparent.png",
  alt: "Litsaber device exploded view showing all six components",
};

export interface FeatureCard {
  title: string;
  body: string;
  accent: "cyan" | "magenta";
}

export const FEATURE_CARDS: FeatureCard[] = [
  {
    title: "UNIVERSAL 510 THREADING",
    body: "Fits any standard cart from 10.5mm to 14.5mm which is either 0.5g, 1g or 2gm carts. Works with up to 95% of carts on the market giving you greater coverage for the products you consume.",
    accent: "cyan",
  },
  {
    title: "EXTRA BATTERY POWER",
    body: "Packed with a 800mAh cobalt cell that runs the headliner, the afters, and the ride home. Full charge in under 75 minutes via USB-C. 300+ recharge cycles is a full year of experiences",
    accent: "magenta",
  },
  {
    title: "VISUAL CUES",
    body: "41-LED immersive array doubles as a feedback system. The lights tell you which mode you're in, when it's pre-heating, what voltage you've picked, and how much battery is left.",
    accent: "cyan",
  },
  {
    title: "3-VOLTAGE SYSTEM",
    body: "Comes with 3 standard optimized voltage settings from 2.4V, 2.8V, 3.2V. These are all tuned for either rosin, resin, and distillate. We even have pre-heat for thicker products.",
    accent: "magenta",
  },
  {
    title: "DUAL ACTIVATION",
    body: "Pull to hit with our auto-inhalation system then press our button to switch modes and cycle through color. No messy menus or complicated apps.",
    accent: "cyan",
  },
  {
    title: "TWO-PART BUILD",
    body: "Aluminum and brass at the connection. Polycarbonate and reinforced diffuser foam that surrounds the LEDs. The end that takes the drop is the end that's built to absorb it.",
    accent: "magenta",
  },
];

export const HERO_STATS = [
  { preLabel: "Up To", value: "4", label: "hours of\ncharge time" },
  { preLabel: "Up To", value: "300", label: "draws per\nsession" },
];

export interface SpecTile {
  icon: string;
  iconAlt: string;
  value: string;
  label: string;
}

export const SPEC_TILES: SpecTile[] = [
  {
    icon: "/images/icons/heart-like-svgrepo-com 1.png",
    iconAlt: "",
    value: "1.5yr",
    label: "Lifespan",
  },
  {
    icon: "/images/icons/battery-full-svgrepo-com 1.png",
    iconAlt: "",
    value: "800mAh",
    label: "Battery capacity",
  },
  {
    icon: "/images/icons/bolt-svgrepo-com 1.png",
    iconAlt: "",
    value: "2.4v - 3.2v",
    label: "Output range",
  },
  {
    icon: "/images/icons/power-off-svgrepo-com 1.png",
    iconAlt: "",
    value: "3x",
    label: "Product Modes",
  },
  {
    icon: "/images/icons/clock-circle-svgrepo-com 1.png",
    iconAlt: "",
    value: "75 mins",
    label: "Time to full charge",
  },
  {
    icon: "/images/icons/local-selection-inactive-svgrepo-com 1.png",
    iconAlt: "",
    value: "510",
    label: "Cartridge style",
  },
  {
    icon: "/images/icons/weight-svgrepo-com 1.png",
    iconAlt: "",
    value: "1.9 oz",
    label: "Weight",
  },
  {
    icon: "/images/icons/lightbulb-svgrepo-com 1.png",
    iconAlt: "",
    value: "41x",
    label: "Total LEDs",
  },
  {
    icon: "/images/icons/ruler-2-svgrepo-com 1.png",
    iconAlt: "",
    value: '5.78"L X 0.83"W',
    label: "Dimensions",
  },
];
