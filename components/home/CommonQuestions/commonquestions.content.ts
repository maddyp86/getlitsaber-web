import { COMPATIBILITY_STATEMENT } from "@/components/product/specs.content";

export const EYEBROW = "BEFORE YOUR BUY";
export const HEADLINE = "COMMON QUESTIONS";

export interface FaqItem {
  number: string;
  question: string;
  answer: string;
  /** Optional link rendered after the answer. */
  link?: { label: string; href: string };
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    number: "/ 01",
    question: "How is this different from other 510 batteries?",
    answer:
      "Most 510 batteries are designed to disappear in your pocket. Litsaber is built to be seen with 41 individually-addressable LEDs across the body, three lighting modes, aluminum and brass construction, polycarbonate diffuser. It's a glowstick that hits 510 carts, not a battery with a small indicator light.",
  },
  {
    number: "/ 02",
    question: "Will it work with my carts?",
    answer:
      `Most likely. ${COMPATIBILITY_STATEMENT} Three-voltage tuning (2.4V, 2.8V, 3.2V) lets you match the voltage to your oil.`,
  },
  {
    number: "/ 03",
    question: "How long does the battery last?",
    answer:
      "800mAh cobalt cell handles a full festival night on one charge. USB-C tops up in under 75 minutes. Rated for 300+ recharge cycles for lifespan of up to 1.5-2 years of regular use.",
  },
  {
    number: "/ 04",
    question: "How visible are the lights at a festival?",
    answer:
      "Bright enough to spot across a dance floor. The 41-LED array runs the full length of the device, diffused through a polycarbonate body where the whole device glows, not just an indicator. You'll see them. Your friends will see them.",
  },
  {
    number: "/ 05",
    question: "What if it breaks or stops working?",
    answer:
      "6-month limited warranty. The aluminum and brass top section handles the connection, while the polycarbonate body and reinforced foam diffuser absorb impact, designed to take a drop. If a manufacturing defect shows up within six months, we replace it. The warranty covers replacement, not refunds.",
    link: { label: "Read the warranty policy.", href: "/policies/warranty" },
  },
  {
    number: "/ 06",
    question: "Can I travel with it?",
    answer:
      "The device itself is TSA-compliant.  Lithium battery rated for carry-on (not checked baggage). Cannabis carts are subject to your local laws. Check your state's rules before flying. Orders ship within 2 business days anywhere in the US.",
  },
];
