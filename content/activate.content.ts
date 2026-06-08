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
