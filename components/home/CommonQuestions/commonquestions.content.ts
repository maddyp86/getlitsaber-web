import { COMPATIBILITY_STATEMENT } from "@/components/product/specs.content";

export const EYEBROW = "BEFORE YOU BUY";
export const HEADLINE = "COMMON QUESTIONS";

export interface FaqItem {
  number: string;
  question: string;
  answer: string;
  /** Optional link rendered after the answer. */
  link?: { label: string; href: string };
}

// Vocabulary (2026-11-15, ad review): "aroma cartridge" and "cartridge", never
// "cart"; "draw" and "session", never "hit". The product is a 510 battery.
export const FAQ_ITEMS: FaqItem[] = [
  {
    number: "/ 01",
    question: "How is this different from other 510 batteries?",
    answer:
      "Most 510 batteries are designed to disappear in your pocket. Litsaber is built to be seen: 41 individually addressable LEDs across the body, three lighting modes, aluminum and brass construction, a polycarbonate diffuser. It's an interactive 510 battery, not a battery with a small indicator light.",
  },
  {
    number: "/ 02",
    question: "Will it work with my aroma cartridges?",
    answer:
      `${COMPATIBILITY_STATEMENT} Three temperature settings (2.4V, 2.8V, 3.2V) let you match the heat to the cartridge.`,
  },
  {
    number: "/ 03",
    question: "How do I use it?",
    answer:
      "Screw a standard 510-thread aroma cartridge onto the top, click the button 5 times to power on, and draw. The airflow sensor activates the device and the lights follow your breath. Click 3 times to cycle temperature, 2 times to pre-heat a thicker cartridge, and hold the button to switch between Litsaber, Glowstick and Stealth modes.",
    link: { label: "See the full setup guide.", href: "/activate" },
  },
  {
    number: "/ 04",
    question: "How long does the battery last?",
    answer:
      "The 800mAh cobalt cell handles a full festival night on one charge. USB-C tops it up in under 75 minutes. Rated for 300+ recharge cycles, which works out to 1.5 to 2 years of regular use.",
  },
  {
    number: "/ 05",
    question: "Can I use it without the lights?",
    answer:
      "Yes. Stealth Mode turns the LEDs off and keeps everything else working, so the device sits quietly in your hand during the day and saves battery. Hold the button to switch modes, and the lights come back when you want them.",
  },
  {
    number: "/ 06",
    question: "What if it breaks or stops working?",
    answer:
      "6-month limited warranty. The aluminum and brass top section handles the connection, while the polycarbonate body and reinforced foam diffuser absorb impact, designed to take a drop. If a manufacturing defect shows up within six months, we replace it. The warranty covers replacement, not refunds.",
    link: { label: "Read the warranty policy.", href: "/policies/warranty" },
  },
  {
    number: "/ 07",
    question: "What's in the box?",
    answer:
      "The Litsaber OG, a quick start guide and a QR code to the activation page. No charging cable, since any USB-C cable works and you already have one. Aroma cartridges are not included.",
  },
  {
    number: "/ 08",
    question: "Can I travel with it?",
    answer:
      "The device is TSA-compliant: a lithium battery rated for carry-on, not checked baggage. Aroma cartridges are subject to the laws where you are, so check before you fly. Orders ship within 2 business days anywhere in the US.",
  },
];
