export const EYEBROW = "BEFORE YOUR BUY";
export const HEADLINE = "COMMON QUESTIONS";

export interface FaqItem {
  number: string;
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    number: "/ 01",
    question: "How is this different from other 510 batteries?",
    answer:
      "Most 510 batteries are designed to disappear in your pocket. Litsaber is built to be seen with 41 individually-addressable LEDs across the body, three lighting modes, aluminum and brass construction, polycarbonate diffuser. It's a glowstick that hits 510 carts, not a vape pen with a small indicator light.",
  },
  {
    number: "/ 02",
    question: "Will it work with my carts?",
    answer:
      "Yes. Universal 510 thread fits any standard cart from 10.5mm to 14.5mm optimized for distillate, live resin, rosin, cured resin carts. Three-voltage tuning (2.4V, 2.8V, 3.2V) lets you match the voltage to your oil.",
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
      "30-day guarantee. The aluminum and brass top section handles the connection, while the polycarbonate body and reinforced foam diffuser absorb impact, designed to take a drop. If something goes wrong within 30 days, we replace it.",
  },
  {
    number: "/ 06",
    question: "Can I travel with it?",
    answer:
      "The device itself is TSA-compliant.  Lithium battery rated for carry-on (not checked baggage). Cannabis carts are subject to your local laws. We ship anywhere in the US in 24 hours; check your state's rules before flying.",
  },
];
