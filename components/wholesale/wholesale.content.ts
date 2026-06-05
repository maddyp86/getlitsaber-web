// ─── Images / Video ──────────────────────────────────────────────────────────
// Set SRC values to hosted URLs when assets land. Empty string triggers
// the styled placeholder in each component.

export const HERO_IMAGE_SRC = "";
export const HERO_IMAGE_ALT = "Litsaber OG glowing at a festival crowd";

export const SELLS_ITSELF_VIDEO_SRC = "";
export const SELLS_ITSELF_IMAGE_SRC = "";
export const SELLS_ITSELF_IMAGE_ALT = "Litsaber held at a show, LED lights cycling";

export const DEMAND_IMAGE_SRC = "/images/wholesale/jack-herer-demo-wholesale.jpg";
export const DEMAND_IMAGE_ALT = "Jack Herer Experience demo — Litsaber in action";

export const RETAIL_KIT_IMAGE_SRC = "/images/wholesale/retail-box-wholesale.png";
export const RETAIL_KIT_IMAGE_ALT = "Litsaber retail display case with demo unit";


// ─── HubSpot ─────────────────────────────────────────────────────────────────
export const HS_PORTAL_ID = "244547358";
// TODO: confirm wholesale form ID in HubSpot portal before going live
export const HS_WHOLESALE_FORM_ID = "f4b0a43c-c1e0-4452-a5ce-48d36ae56f57";

// ─── Section 1 — Hero ────────────────────────────────────────────────────────
export const HERO_HEADLINE_LINE1 = "THE 510 BATTERY";
export const HERO_HEADLINE_LINE2 = "YOU'VE BEEN";
export const HERO_HEADLINE_ACCENT = "LOOKING FOR.";
export const HERO_BODY =
  "Litsaber is an interactive LED vape battery built to stand out at festivals, behind the counter, and in customer hands. Give your customers something worth showing off.";
export const HERO_CTA_PRIMARY = "GET WHOLESALE PRICING";
export const HERO_CTA_SECONDARY = "SEE THE NUMBERS";

// ─── Section 2 — Stats Bar ───────────────────────────────────────────────────
export const STATS_BAR = [
  { value: "$24/unit", label: "STARTS AT" },
  { value: "$59.99", label: "MSRP" },
  { value: "5", label: "MOQ (UNITS)" },
  { value: "80", label: "CASE PACK" },
] as const;

// ─── Section 3 — Sells Itself ────────────────────────────────────────────────
export const SELLS_HEADLINE_PART1 = "It doesn't sit on shelves.";
export const SELLS_HEADLINE_PART2 = "It sells itself.";
export const SELLS_BODY = [
  "Litsaber is built to shine, spark curiosity, and start conversations. Where most 510 batteries prioritize discretion, Litsaber leans into culture — nightlife, sessions, festivals, conversation pieces.",
  "**Customers don't just buy it. They show it off.** Every use is a micro-advertisement for your store. The pen lights up at the bar, in the smoke session, at the festival and the next person in line asks where they got it.",
  "This isn't a commodity 510 battery competing on price. It's a category of one.",
];

// ─── Section 4 — Sell Through ────────────────────────────────────────────────
export const SELL_THROUGH_HEADLINE = "Built to";
export const SELL_THROUGH_ACCENT = "Sell Through";

export const SELL_THROUGH_CARDS = [
  {
    icon: "lifestyle" as const,
    title: "Lifestyle accessory positioning",
    body: "People buy Litsaber for festivals, parties, raves, and gifts. The vape function is the secondary purchase driver. The lights are the primary one.",
  },
  {
    icon: "engineered" as const,
    title: "Engineered hardware",
    body: "800mAh cobalt cell, 3-voltage tuning, universal 510 compatibility, USB-C, 30-day guarantee. Real product, not novelty.",
  },
  {
    icon: "gift" as const,
    title: "Natural gift item",
    body: "Premium packaging and standout design make it a natural impulse buy and gift purchase, driving sales beyond your core vape customer.",
  },
  {
    icon: "repeat" as const,
    title: "Repeat purchase from collectors",
    body: "Future drops (Gold Edition in June, more colorways planned) create reasons for customers to come back. This isn't a one-and-done category.",
  },
] as const;

// ─── Section 5 — Demand ──────────────────────────────────────────────────────
export const DEMAND_EYEBROW = "SOCIAL PROOF";
export const DEMAND_HEADLINE_LINE1 = "Demand is";
export const DEMAND_HEADLINE_ACCENT = "Already There.";
export const DEMAND_BODY = [
  "**2M+ organic TikTok views and growing.** Customers walk into shops asking for it, you just need to have it in stock.",
  "Litsaber ran activations with **Waferz**, one of California's top multi-location dispensary groups. **The Jack Herer Experience party-bus roadshow**is putting the device in front of thousands of qualified buyers across California.",
  "This isn't a brand betting on retail to create demand. The demand is here. You're meeting it on your shelves.",
];

// ─── Section 6 — Margins ─────────────────────────────────────────────────────
export const MARGINS_EYEBROW = "THE NUMBERS";
export const MARGINS_HEADLINE_LINE1 = "Premium margins.";
export const MARGINS_HEADLINE_ACCENT = "Real numbers.";
export const MARGINS_BODY = [
  "Wholesale starts at **$24/unit** at the entry tier (5 units). MSRP is $59.99 That's a **$36 margin per unit at the starting tier**, roughly **60% retail margin**, well above the category average for vape hardware.", 
  "No mystery pricing. No tier-locked surprises. Submit the form and we send the full 9-tier pricing sheet with case pack and freight estimates within 24 hours."
  ];

export const MARGINS_STATS = [
 { label: "WHOLESALE STARTING AT", value: "$24.00/unit", color: "#00E5FF" },
  { label: "MSRP",                  value: "$59.99/unit", color: "#FFFFFF" },
  { label: "YOUR MARGIN",           value: "25%",         color: "#EB3D7B" },
] as const;

export const MARGINS_BAND_HEADLINE =
  "Four pricing tiers. From 5 units to 10,000+.";
export const MARGINS_BAND_SUBLINE =
  "FULL PRICING SHEET INCLUDED WITH APPLICATION";
export const MARGINS_BAND_CTA = "GET FULL PRICING SHEET";

// ─── Section 7 — Retail Kit ──────────────────────────────────────────────────
export const KIT_HEADLINE_LINE1 = "YOU DON'T JUST GET A";
export const KIT_HEADLINE_LINE2 = "CASE OF";
export const KIT_HEADLINE_ACCENT = "PENS.";
export const KIT_BODY =
  "Orders of 10+ units come with a full retail kit designed to turn the box into the display from the moment it lands.";

export const KIT_ITEMS = [
  {
    num: "/01",
    title: "Premium Display Case",
    body: "A branded countertop display case that holds 10 to 24 units, fully assembled and ready to drop onto a shelf. Included free with orders of 80+ units.",
  },
  {
    num: "/02",
    title: "Demo Mode Unit",
    body: "A pre-configured device set to cycle through all twelve color modes on loop. Lets customers see the light show without opening inventory.",
  },
  {
    num: "/03",
    title: "Marketing Assets",
    body: "A download link to the full creative library: product shots, lifestyle photography, and short-form video clips formatted for Instagram, TikTok, and in-store display.",
  },
  {
    num: "/04",
    title: "Sticker + Swag Pack",
    body: "Branded stickers, hang tags, and a small swag assortment. Small stuff, but customers notice it — and it ends up on water bottles and laptops across the state.",
  },
  {
    num: "/05",
    title: "Dedicated Account Support",
    body: "A direct line to our wholesale team for reorders, restocks, and any fulfillment issues. Standard response time is same business day.",
  },
  {
    num: "/06",
    title: "Fast Fulfillment",
    body: "Standard orders ship within 24 to 48 hours from Los Angeles. Freight available for orders over 80 units. No minimum lead time, no seasonal holdups.",
  },
] as const;

// ─── Section 8 — FAQ ─────────────────────────────────────────────────────────
export const FAQ_EYEBROW = "FAQs";
export const FAQ_HEADLINE_PART1 = "What you need to";
export const FAQ_HEADLINE_ACCENT = "know";

export const FAQ_ITEMS = [
  {
    num: "/01",
    question: "What's the lead time after I order?",
    answer:
      "Orders ship within 48 hours of payment confirmation from our SoCal 3PL fulfillment center. Standard ground delivery reaches the East Coast in 3–5 business days. Expedited freight available for larger orders.",
  },
  {
    num: "/02",
    question: "How do I pay? Do you offer net terms?",
    answer:
      "We accept all major credit cards and ACH. Net-30 terms are available for established accounts with a 90-day purchase history. First orders are prepaid. Apply through the form below and we'll confirm your payment options when we follow up.",
  },
  {
    num: "/03",
    question: "Can I get a sample unit before committing to MOQ?",
    answer:
      "Yes. Request a sample through the application form and we'll send a single demo unit (at cost + shipping) so you can evaluate the product in person. Sample cost credits toward your first wholesale order.",
  },
  {
    num: "/04",
    question: "Do you support drop-ship?",
    answer:
      "Yes. We're a verified supplier on Crowdship for retailers who want to dropship without holding inventory. Supplier pricing and shipping rules are controlled per account. Application form has a dropship option.",
  },
  {
    num: "/05",
    question: "Is there an exclusivity arrangement?",
    answer:
      "Open distribution by default. Regional exclusivity is available case-by-case for accounts committing to Tier 5+ volume (500+ units) with mutually agreed performance benchmarks. Contact us to discuss.",
  },
  {
    num: "/06",
    question: "Are you California-compliant? Can I ship Litsaber in regulated states?",
    answer:
      "Litsaber is sold as a 510-thread battery accessory. It does not contain cannabis, nicotine, or e-liquid. The device itself is legal to ship and sell in all 50 states. Your local cart sales remain subject to your state's regulations.",
  },
] as const;

// ─── Section 9 — CTA / Form ──────────────────────────────────────────────────
export const CTA_EYEBROW = "BECOME A RETAILER";
export const CTA_HEADLINE_PART1 = "Get the full pricing sheet.";
export const CTA_HEADLINE_ACCENT = "Let's talk.";
export const CTA_BODY =
  "Submit your details. We'll get back to you within 24 hours with the complete tier pricing, sample options, and anything else you need to make the call.";

export const CTA_BULLETS = [
  "Full pricing sheet emailed within 24 hours of submission",
  "6 volume-based pricing tiers from 25 to 10,000+ units",
  "Free display case + demo unit with 100+ unit orders",
  "Dedicated account support and marketing assets included",
  "No commitment required! Exploring is fine, we'll send the deck anyway",
  "Sample units available at cost",
    "Net-30 terms for established accounts",
] as const;

export const FORM_CARD_TITLE = "Apply for wholesale access";
export const FORM_CARD_SUBTITLE = "WE'LL FOLLOW UP WITHIN 24 HOURS";

export const RETAIL_LOCATION_OPTIONS = [
  "1 location",
  "2 to 5 locations",
  "6 to 10 locations",
  "11 to 25 locations",
  "25+ locations",
] as const;

export const FIRST_ORDER_OPTIONS = [
  "5 to 10 units",
  "11 to 25 units",
  "26 to 80 units",
  "80+ units",
] as const;
