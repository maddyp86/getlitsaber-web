// ─── Hero ────────────────────────────────────────────────────────────────────

export const ACTIVATE_HERO = {
  badge: "SCANNED FROM BOX",
  headingLead: "YOUR LITSABER IS",
  headingAccent: "HERE.",
  sub: "Let's get you set up. Videos and step-by-step instructions for every function below. Most people are up and running in under a minute.",
  meta: ["3 MIN READ", "SELECT MODE", "FIRST DRAW"],
} as const;

// ─── Sub-nav ─────────────────────────────────────────────────────────────────

export const ACTIVATE_SUBNAV = [
  { id: "quick-start", label: "Quick Start" },
  { id: "functions",   label: "Functions" },
  { id: "modes",       label: "Modes" },
  { id: "preheat",     label: "Pre-Heat" },
  { id: "voltage",     label: "Voltage" },
  { id: "battery",     label: "Battery" },
  { id: "charging",    label: "Charging" },
  { id: "cart",        label: "Cart Tips" },
  { id: "safety",      label: "Safety" },
] as const;

// ─── Section IDs (single source of truth — import these in all components) ───

export const SECTION_IDS = {
  quickStart: "quick-start",
  functions:  "functions",
  modes:      "modes",
  preheat:    "preheat",
  voltage:    "voltage",
  battery:    "battery",
  charging:   "charging",
  cart:       "cart",
  safety:     "safety",
} as const;

export type SectionId = typeof SECTION_IDS[keyof typeof SECTION_IDS];

// ─── Quick Start section ─────────────────────────────────────────────────────

export const ACTIVATE_QUICKSTART = {
  eyebrow: "FIRST 30 SECONDS",
  title: "QUICK START",
  intro:
    "Three steps. You're hitting it before this page finishes scrolling. Litsaber arrives charged. You can start using it immediately.",
  stepsHeading: "3 steps to your first hit",
  steps: [
    {
      num: "/01",
      label: "POWER ON",
      body: "Click the button 5 times quickly to power on/off. Your device turns on in Glowstick Mode by default. The lights stay on while you use it.",
    },
    {
      num: "/02",
      label: "ADD CART",
      body: "Thread on your 510 cart. Hand-tight. If the cart doesn't hit well when fully tightened, back off a quarter to half turn (more on this below).",
    },
    {
      num: "/03",
      label: "INHALE",
      body: "Litsaber is auto-draw. No button required to hit. The lights animate with your pull.",
    },
  ],
  callout:
    "That's it. Everything below is optional: modes, voltage tuning, troubleshooting. Use what you need.",
  media: {
    src: null as string | null,
    poster: null as string | null,
    alt: "Litsaber power-on demo",
  },
} as const;

// ─── Functions section ────────────────────────────────────────────────────────

export const ACTIVATE_FUNCTIONS = {
  eyebrow: "QUICK REFERENCE",
  title: "PRODUCT FUNCTIONS",
  intro: "Every button action in one place. Save this page or take a screenshot.",
  tableHeading: "Everything the device does",
  columns: { action: "BUTTON ACTION", result: "RESULT" },
  rows: [
    { action: "5 clicks", result: "Power on / off. Always opens in Glowstick Mode." },
    { action: "4 clicks", result: "Check battery level." },
    { action: "3 clicks", result: "Cycle voltage: 2.4V \u2192 2.8V \u2192 3.2V." },
    { action: "2 clicks", result: "Pre-heat (9 seconds, any voltage)." },
    { action: "Single click (in Glowstick)", result: "Cycle through colors (10 options)." },
    { action: "Hold 2 sec", result: "Toggle between Glowstick and Litsaber Mode." },
    { action: "Hold 5 sec", result: "Enter Stealth Mode (lights off)." },
    { action: "Hold 4-5 sec (in Stealth)", result: "Exit Stealth. Returns to Glowstick." },
  ],
} as const;
