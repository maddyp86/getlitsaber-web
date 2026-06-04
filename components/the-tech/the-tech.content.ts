// ─── Video ───────────────────────────────────────────────────────────────────
// Set VIDEO_SRC to the hosted video URL when available.
// When empty, the InhaleVideo section renders a styled placeholder.
export const VIDEO_SRC = "";

// ─── Images ──────────────────────────────────────────────────────────────────
// All images are remote URLs (GitHub-hosted). next.config.mjs must have
// raw.githubusercontent.com whitelisted in images.remotePatterns.

export const HERO_IMAGE_SRC_DESKTOP = "/images/tech/be-seen-desktop.jpg";
export const HERO_IMAGE_SRC_MOBILE = "/images/tech/be-seen-mobile.jpg";
export const HERO_IMAGE_ALT = "Litsaber OG glowing in a dark environment";

export const BREATH_RESPONSE_IMAGE_SRC = "/images/tech/litsaber-multi-tech.jpg";
export const BREATH_RESPONSE_IMAGE_ALT = "Litsaber glowing in rainbow spectrum of colors";

export const POWER_IMAGE_SRC = "/images/tech/litsaber-usbc-tech.jpg";
export const POWER_IMAGE_ALT = "Litsaber device showing USB-C charging port";

export const EXPLODED_RENDER_IMAGE_SRC = "/images/tech/exploded-view-tech.png";
export const EXPLODED_RENDER_IMAGE_ALT = "Litsaber OG exploded 3D view showing all six internal components";

export const VOLTAGE_DEVICE_IMAGE_SRC = "/images/tech/oil-desktop.jpg";
export const VOLTAGE_DEVICE_IMAGE_ALT = "Litsaber held in hand, LED lit to indicate voltage setting";

export const CART_LINEUP_IMAGE_SRC = "/images/tech/cart-sizes.jpg";
export const CART_LINEUP_IMAGE_ALT = "510 cart size comparison from 10.5mm to 14.5mm — half-gram, full-gram, two-gram";

// ─── Section 1 — Hero ────────────────────────────────────────────────────────
export const HERO_EYEBROW = "THE ENGINEERING";
export const HERO_HEADLINE_LINE1 = "BUILT TO";
export const HERO_HEADLINE_ACCENT = "BE SEEN.";
export const HERO_BODY =
  "Most 510 batteries are engineered to disappear. Litsaber was engineered to be the opposite. Built to be held, built to be raised, built to outlast the night.";
export const HERO_CTA = "CHECK IT OUT";

// ─── Section 2 — Inhale ──────────────────────────────────────────────────────
export const INHALE_HEADLINE_LINE1 = "Inhale.";
export const INHALE_HEADLINE_LINE2 = "Watch what happens.";
export const INHALE_BODY =
  "The auto-inhalation sensor doesn't just fire the heater. It triggers a 41-LED light sequence that animates in time with your draw. The device starts a light show the moment your hand the second you draw on it.";

// ─── Section 3 — Breath Response ─────────────────────────────────────────────
export const BREATH_EYEBROW = "RESPONSIVE BY DESIGN";
export const BREATH_HEADLINE = "Your breath controls the light.";
export const BREATH_BODY_BLOCKS = [
  "**Most 510 batteries give you smoke. Litsaber gives you a light show that you make.** The airflow sensor and the LED array are wired as one system,  when you pull, the lights respond in real time. Pull harder, the response intensifies. Stop pulling, the animation settles. ",
  "This isn't a fixed pattern on a timer. It's the device **responding to your breath**, the same input that creates the cloud creates the light. Same draw, two outputs, one moment.",
  "**In Litsaber Mode,** the response curves with you. The lights start dim and intensify the longer you hold the pull, dim, brighter, brighter, until the device peaks in a rainbow strobe that cycles through all twelve colors. Every hit is a build. The longest pulls earn the biggest payoff.",
  "It's also how the device tells you what's happening. Pre-heat shows a different animation than a hit. The LED color tracks your voltage setting. **The whole device speaks back to you as you use it.**",
];

// ─── Section 4 — Power ───────────────────────────────────────────────────────
export const POWER_EYEBROW = "BUILT FOR THE LONG NIGHT";
export const POWER_HEADLINE1 = "Power That";
export const POWER_HEADLINE2 = "Keeps Up!";
export const POWER_BODY = [
  "Most vape pens are running out of battery at 9PM. Litsaber's **800mAh cobalt cell** is built for the headliner, the afters, and the ride home.",
  "Full charge in under **75 minutes via USB-C.** Three hundred recharge cycles about a year of experiences. No drop in performance. Breathing LED feedback while charging so you always know where you stand.",
  "No proprietary connectors. No hunting for a charger that fits.",
];

// ─── Section 5 — Voltage ─────────────────────────────────────────────────────
export const VOLTAGE_EYEBROW = "DIALED IN";
export const VOLTAGE_HEADLINE_LINE1 = "Tuned for";
export const VOLTAGE_HEADLINE_ACCENT = "the Oil";
export const VOLTAGE_BODY = [
  "Three voltage settings, mapped to what's actually in your cart.",
  "**2.4V for rosin and live resin.** Lower power preserves terpenes and delivers smoother flavor. **2.8V for cured resin and hybrids.** Balanced vapor production and oil efficiency. **3.2V for distillate and liquid diamonds.** Dense clouds, stronger pull.",
  "Plus a pre-heat cycle for thicker products that need a moment to warm up. The setting you choose changes the experience and the LED color tells you exactly which voltage you're on.",
  ];

export interface VoltageRow {
  voltage: string;
  color: string;
  label?: string;
  oilType1: string;
  oilType2: string;
  ledColor: string;
}

export const VOLTAGE_ROWS: VoltageRow[] = [
  {
    voltage: "2.4V",
    color: "#22c55e",
    oilType1: "ROSIN",
    oilType2: "LIVE ROSIN",
    ledColor: "Green",
  },
  {
    voltage: "2.8V",
    color: "#3b82f6",
     oilType1: "CURED RESIN",
    oilType2: "HYBRIDS",
    ledColor: "Blue",
  },
  {
    voltage: "3.2V",
    color: "#ef4444",
    oilType1: "DISTILLATE",
    oilType2: "LIQUID DIAMONDS",
    ledColor: "Red",
  },
];

// ─── Section 6 — Universal Fit ───────────────────────────────────────────────
export const FIT_EYEBROW = "WORKS WITH WHAT YOU ALREADY BUY";
export const FIT_HEADLINE_LINE1 = "Universal";
export const FIT_HEADLINE_ACCENT = "Fit.";
export const FIT_BODY = [
  "510 thread, 10.5mm to 14.5mm diameter. Half-gram, full-gram, two-gram. **Roughly ninety-five percent of carts on the market screw into the Litsaber** including distillate, rosin, live resin, cured resin, liquid diamonds, hybrids.",
  "Whatever you're already buying, the device is built to accept it. No proprietary pods. No locked ecosystem. The cart you're holding right now probably fits.",
  "The connection sits behind the aluminum and brass top  protected, threaded, made to take repeat insertions without wearing down."
];

// ─── Section 7 — CTA ─────────────────────────────────────────────────────────
export const CTA_HEADLINE = "Ready to see it in person?";
export const CTA_SUBHEADLINE = "The OG Silver ships in 24 hours from Los Angeles. Backed by a 30-day guarantee.";
export const CTA_PRIMARY_LABEL = "GET YOURS";
export const CTA_PRIMARY_HREF = "/shop/litsaber-og";
export const CTA_SECONDARY_LABEL = "VIEW WHOLESALE";
export const CTA_SECONDARY_HREF = "/wholesale";
