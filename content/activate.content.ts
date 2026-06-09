// ─── Hero ────────────────────────────────────────────────────────────────────

export const ACTIVATE_HERO = {
  badge: "SCANNED FROM BOX",
  headingLead: "YOUR LITSABER IS",
  headingAccent: "HERE.",
  sub: "Let's get you set up. Videos and step-by-step instructions for every function below. Most people are up and running in under a minute.",
  meta: ["POWER ON", "SELECT MODE", "FIRST DRAW"],
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

// ─── Modes section ────────────────────────────────────────────────────────────

export const MODE_ORDER = ["glowstick", "litsaber", "stealth"] as const;
export type ModeId = typeof MODE_ORDER[number];

export const ACTIVATE_MODES = {
  eyebrow: "LED LIGHT MODES",
  title: "THREE MODES",
  intro:
    "Litsaber has three lighting behaviors. The screen cycles between them. Pick what fits the moment.",
  tabs: [
    { id: "glowstick" as ModeId, label: "GLOWSTICK" },
    { id: "litsaber"  as ModeId, label: "LITSABER" },
    { id: "stealth"   as ModeId, label: "STEALTH" },
  ],
  modes: {
    glowstick: {
      name: "Glowstick Mode",
      badge: "DEFAULT MODE",
      badgeColor: "magenta" as const,
      tagline: "Continuous glow with breathing effect while you inhale.",
      points: [
        "This is the default mode every time the device turns on.",
        "LEDs stay lit. They gently \u201cbreathe\u201d when you take a hit.",
        "Lights stay on for up to 300 seconds after the last interaction.",
        "Single-click the button to cycle through colors: green \u2192 red \u2192 blue \u2192 yellow \u2192 orange \u2192 light blue \u2192 pink \u2192 white \u2192 rainbow \u2192 red/white/blue.",
      ],
      callout: null as string | null,
      media: { src: null as string | null, poster: null as string | null, alt: "Glowstick Mode demo" },
    },
    litsaber: {
      name: "Litsaber Mode",
      badge: "SIGNATURE MODE",
      badgeColor: "cyan" as const,
      tagline: "Cascading lightsaber effect that responds to your breath.",
      points: [
        "To enter: press and hold the button for 2 seconds while in Glowstick Mode.",
        "When you inhale, LEDs cascade for 5 seconds from top to bottom.",
        "The longer you hold the pull, the brighter the lights become. Extended inhales ramp up to a special animated effect, that\u2019s THE BUILD \u2192 BLINKER MODE.",
        "Change color: single-click the button. LEDs flash to confirm.",
      ],
      callout:
        "If your device strobes through the rainbow at max hold, that\u2019s not a malfunction. It\u2019s Blinker Mode, the safety floor turned into a hidden light show. Stop pulling and the device resets after a few seconds.",
      media: { src: null as string | null, poster: null as string | null, alt: "Litsaber Mode demo" },
    },
    stealth: {
      name: "Stealth Mode",
      badge: "LIGHTS OFF",
      badgeColor: "cyan" as const,
      tagline: "No LEDs. The device still works normally, auto-draw still fires the heater.",
      points: [
        "To enter: press and hold the button for 5 seconds. LEDs briefly illuminate, then fade off.",
        "The device functions normally via auto-draw. No lights during use.",
        "To exit: press and hold the button for 4-5 seconds. Device returns to Glowstick Mode in your last-used color.",
      ],
      callout:
        "Stealth always exits to Glowstick Mode. If you want Litsaber Mode after exiting, hold the button for 2 more seconds.",
      media: { src: null as string | null, poster: null as string | null, alt: "Stealth Mode demo" },
    },
  },
} as const;

// ─── Pre-Heat section ─────────────────────────────────────────────────────────

export const ACTIVATE_PREHEAT = {
  eyebrow: "PRE-HEAT",
  title: "WARM THE OIL",
  intro: "For thicker oils that need a moment to flow.",
  cardLabel: "Pre-heat cycle",
  cardBadge: "9 SECONDS",
  bestFor: "Best for distillate, liquid diamonds, or any cart that pulls cold.",
  points: [
    "Press the button 2 times quickly to start the pre-heat cycle.",
    "The device pre-heats for 9 seconds at low voltage, gentle enough not to scorch the oil.",
    "Pre-heat stops automatically when you inhale or when the 9 seconds complete.",
  ],
  callout:
    "You don\u2019t always need this. Pre-heat is most useful in cold weather, with high-viscosity oils, or with carts that haven\u2019t been used in a while.",
  media: {
    src: null as string | null,
    poster: null as string | null,
    alt: "Pre-heat cycle demo",
  },
} as const;

// ─── Voltage section ──────────────────────────────────────────────────────────

export const ACTIVATE_VOLTAGE = {
  eyebrow: "VOLTAGE",
  title: "TUNE FOR THE OIL",
  intro:
    "Three voltage settings. The LED color tells you which one you\u2019re on. Press the button 3 times quickly to cycle.",
  rows: [
    {
      voltage: "2.4V",
      hex: "#22C55E",
      colorName: "GREEN",
      oils: "Resin / Live Resin",
      body: "Preserves terpenes. Smooth flavor. Cool burn.",
    },
    {
      voltage: "2.8V",
      hex: "#3B82F6",
      colorName: "BLUE",
      oils: "Cured Resin / Hybrid Oils",
      body: "Balanced vapor and oil efficiency. Medium burn.",
    },
    {
      voltage: "3.2V",
      hex: "#EF4444",
      colorName: "RED",
      oils: "Distillate / Liquid Diamonds",
      body: "Dense clouds. Stronger pull. Warm burn.",
    },
  ],
  media: {
    src: null as string | null,
    poster: null as string | null,
    alt: "Voltage cycling demo",
  },
} as const;

// ─── Shared LED Colors (physical device LEDs — not brand palette) ─────────────

export const LED_COLORS = {
  red:    "#FF4444",
  orange: "#FF9933",
  yellow: "#FFEE44",
  blue:   "#4FB0FF",
  green:  "#5FFFA0",
} as const;

// ─── Battery section ──────────────────────────────────────────────────────────

export const ACTIVATE_BATTERY = {
  eyebrow: "BATTERY",
  title: "CHECK YOUR CHARGE",
  intro: "Litsaber is an 800mAh cell built for a full festival night.",
  cardLabel: "Check battery level",
  cardBadge: "4 CLICKS",
  points: [
    "Press the button 4 times quickly.",
    "LED segments light up to indicate remaining battery: full to empty.",
    "After 5 seconds, the device returns to your current mode automatically.",
  ],
  legend: [
    { color: "red"    as const, range: "0-20%",   status: "Critical" },
    { color: "orange" as const, range: "20-40%",  status: "Low" },
    { color: "yellow" as const, range: "40-60%",  status: "Medium" },
    { color: "blue"   as const, range: "60-80%",  status: "High" },
    { color: "green"  as const, range: "80-100%", status: "Full" },
  ],
  legendAxis: { left: "BUTTON", right: "TIP" },
  caption:
    "Five segments, 20% each. When you check the battery, the segments light up to show your current level. Red is on the button side, green is at the tip.",
  media: {
    src: null as string | null,
    poster: null as string | null,
    alt: "Check battery level demo",
  },
} as const;

// ─── Charging section ─────────────────────────────────────────────────────────

export const ACTIVATE_CHARGING = {
  eyebrow: "CHARGING",
  title: "FULL CHARGE IN 75 MIN.",
  intro: "USB-C. Any cable, any adapter. No proprietary connectors.",
  barLabel: "BUTTON          CHARGING BEHAVIOR          TIP",
  bullet:
    "The bar fills as the battery climbs. One segment red, two orange, three yellow, four blue, all five green.",
  caption:
    "Watch the bar fill up. When all five segments are green and stop breathing, you\u2019re fully charged.",
  media: {
    src: null as string | null,
    poster: null as string | null,
    alt: "Charging the device demo",
  },
} as const;

// ─── Cart Troubleshooting section ─────────────────────────────────────────────

export const ACTIVATE_CART = {
  eyebrow: "CART TIPS",
  title: "CART TROUBLESHOOTING",
  intro:
    "Litsaber is built for broad 510 compatibility. If your cart isn\u2019t hitting well, here\u2019s what to try, in order.",
  cards: [
    {
      num: "/01",
      title: "Try the half-turn trick",
      body: "The 510 connection has a fixed center pin at 4.0mm depth, set for broad cart compatibility. Some carts seat best a little loose. If the cart doesn\u2019t hit when fully tightened, back off a quarter to half turn. This is normal, not a defect. Always try this first.",
    },
    {
      num: "/02",
      title: "Try a different voltage",
      body: "A voltage mismatch is the next most common cause of a weak hit. Thicker oils want more voltage, thinner oils want less. Click 3 times to cycle, and match the oil to the voltage guide above.",
    },
    {
      num: "/03",
      title: "Re-seat the cart",
      body: "Sometimes a cart isn\u2019t making clean contact. Unscrew it, clear any debris off the threads and pin, then re-thread hand-tight. Don\u2019t over-tighten.",
    },
    {
      num: "/04",
      title: "Try a different cart",
      body: "Most weak-hit issues are cart-related, not device-related. If a known-good cart hits fine but another one doesn\u2019t, the issue is that specific cart, not your Litsaber.",
    },
  ],
} as const;

// ─── Safe Use section ─────────────────────────────────────────────────────────

export const ACTIVATE_SAFETY = {
  eyebrow: "SAFETY",
  title: "SAFE USE",
  intro: "A few things worth knowing.",
  points: [
    { lead: "Mind the temps.", body: "Charge and use at normal room temperature. Don\u2019t leave it in a hot car or in direct sun." },
    { lead: "510 carts only.", body: "Built for standard 510 cartridges, 0.5g to 2g. Don\u2019t modify the device or use it with anything else." },
    { lead: "Keep it dry.", body: "Don\u2019t submerge it or expose it to liquid. Wipe the threads and contacts clean if they get gunked up." },
    { lead: "Built-in protection.", body: "Overcharge, over-discharge, short-circuit, vibration, and drop protection are all on board." },
    { lead: "Auto shut-off.", body: "The LEDs power down after 300 seconds of inactivity to save battery. A quick draw or click wakes it." },
    { lead: "Keep away from children.", body: "There is no child lock. Store it out of reach." },
  ],
} as const;

// ─── Closing CTA section ──────────────────────────────────────────────────────

export const ACTIVATE_CTA = {
  heading: "STILL STUCK?",
  body: "We\u2019re a small team in L.A. We read every message and reply within 24 hours.",
  primary:   { label: "CONTACT SUPPORT", href: "/contact" },
  secondary: { label: "VIEW FAQ", href: "/contact#faq" },
} as const;
