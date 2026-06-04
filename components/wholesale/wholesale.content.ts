// ─── Images / Video ──────────────────────────────────────────────────────────
// Set SRC values to hosted URLs when assets land. Empty string triggers
// the styled placeholder in each component.

export const HERO_IMAGE_SRC = "";
export const HERO_IMAGE_ALT = "Litsaber OG glowing at a festival crowd";

export const SELLS_ITSELF_VIDEO_SRC = "";
export const SELLS_ITSELF_IMAGE_SRC = "";
export const SELLS_ITSELF_IMAGE_ALT = "Litsaber held at a show, LED lights cycling";

export const DEMAND_IMAGE_SRC = "";
export const DEMAND_IMAGE_ALT = "Jack Herer Experience demo — Litsaber in action";

export const RETAIL_KIT_IMAGE_SRC = "";
export const RETAIL_KIT_IMAGE_ALT = "Litsaber retail display case with demo unit";

export const GEOMETRIC_SHAPE_SRC = "/images/home/litsaber-geometric-shape.png";

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
export const SELL_THROUGH_ACCENT = "**Sell Through.**";

export const SELL_THROUGH_CARDS = [
  {
    icon: "lifestyle" as const,
    title: "Lifestyle accessory positioning",
    body: "Priced for festivals, raves, and shows — and worn as proudly as jewelry. The customer who buys Litsaber is exactly the customer you want more of.",
  },
  {
    icon: "engineered" as const,
    title: "Engineered hardware",
    body: "Built-in 510 thread, supports 10.5mm to 14.5mm diameter carts. Half-gram, full-gram, two-gram. Roughly 95% of the market screws in without an adapter.",
  },
  {
    icon: "gift" as const,
    title: "Natural gift item",
    body: "The packaging, the device, and the light show all photograph well. Strong gift candidate from holiday to 4/20 to birthdays, without needing a separate gifting push.",
  },
  {
    icon: "repeat" as const,
    title: "Repeat purchase from collectors",
    body: "The Gold Edition waitlist is already hundreds deep. Customers who buy Silver come back for Gold. They collect colorways. The first sale is rarely the last.",
  },
] as const;

// ─── Section 5 — Demand ──────────────────────────────────────────────────────
export const DEMAND_EYEBROW = "SOCIAL PROOF";
export const DEMAND_HEADLINE_LINE1 = "Demand is";
export const DEMAND_HEADLINE_ACCENT = "**Already There.**";
export const DEMAND_BODY = [
  "2M+ organic TikTok views and growing. Customers walk into your shop already asking for it by name. The social presence does the pre-sell — you just need to have it in stock.",
  "Litsaber ran activations with **Waferz**, one of California's top multi-location dispensary groups. The Jack Herer Experience party-bus roadshow (April through June 2026) is putting the device in front of thousands of qualified buyers across California.",
  "You're not building demand from scratch. You're stepping into something that's already moving.",
];

// ─── Section 6 — Margins ─────────────────────────────────────────────────────
export const MARGINS_EYEBROW = "THE NUMBERS";
export const MARGINS_HEADLINE_LINE1 = "Premium margins.";
export const MARGINS_HEADLINE_ACCENT = "**Real numbers.**";
export const MARGINS_BODY =
  "No mystery pricing. No lockbox tiers. Submit the form and we send you the full sheet within 24 hours.";

export const MARGINS_STATS = [
  { label: "WHOLESALE STARTING AT", value: "$24.00/unit" },
  { label: "MSRP", value: "$59.99/unit" },
  { label: "YOUR MARGIN", value: "25%" },
] as const;

export const MARGINS_BAND_HEADLINE =
  "Four pricing tiers. From 5 units to 10,000+.";
export const MARGINS_BAND_SUBLINE =
  "FULL PRICING SHEET INCLUDED WITH APPLICATION";
export const MARGINS_BAND_CTA = "GET FULL PRICING SHEET";

// ─── Section 7 — Retail Kit ──────────────────────────────────────────────────
export const KIT_HEADLINE_PART1 = "You don't just get a case of";
export const KIT_HEADLINE_ACCENT = "**pens.**";
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
export const FAQ_HEADLINE_ACCENT = "**know.**";

export const FAQ_ITEMS = [
  {
    num: "/01",
    question: "What's the lead time after I order?",
    answer:
      "Standard ground ships within 24 to 48 hours from our Los Angeles fulfillment center. Standard freight is available for larger orders. International freight lead times vary by destination — contact us for a quote.",
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
      "Yes. Single sample units are available at wholesale cost plus shipping. Apply through the form and note that you'd like a sample. We'll route your request accordingly and credit the sample cost toward your first full order.",
  },
  {
    num: "/04",
    question: "Do you support drop-ship?",
    answer:
      "Not at this time. All orders ship to the retailer. Drop-ship capabilities are on the product roadmap for a later phase. If that's a priority for your operation, note it in your application and we'll keep you informed.",
  },
  {
    num: "/05",
    question: "Is there an exclusivity arrangement?",
    answer:
      "Regional exclusivity is available for accounts at the Archon tier (26+ units per order) and above. Territory exclusivity is evaluated case by case based on geography and volume commitment. Include a note in your application if this is relevant.",
  },
  {
    num: "/06",
    question: "Are you California-compliant? Can I ship Litsaber in regulated states?",
    answer:
      "Litsaber is the device only — a 510-thread battery accessory. It contains no cannabis, no oil, and no cartridge. Regulations governing cannabis hardware vary by state; verify your local requirements before stocking. We're happy to provide product specs and compliance documentation to support your review.",
  },
] as const;

// ─── Section 9 — CTA / Form ──────────────────────────────────────────────────
export const CTA_EYEBROW = "BECOME A RETAILER";
export const CTA_HEADLINE_PART1 = "Get the full pricing sheet.";
export const CTA_HEADLINE_ACCENT = "**Let's talk.**";
export const CTA_BODY =
  "Submit your details. We'll get back to you within 24 hours with the complete tier pricing, sample options, and anything else you need to make the call.";

export const CTA_BULLETS = [
  "Full 4-tier pricing sheet sent immediately",
  "Sample unit available at wholesale cost",
  "Net-30 terms for established accounts",
  "Display case included at 80+ units",
  "No minimums beyond the 5-unit MOQ",
  "Dedicated account support from day one",
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
