export const POLICIES_EFFECTIVE_DATE = "May 15, 2026";

export const POLICIES_HERO = {
  eyebrow: "POLICIES & TERMS",
  headlineWhite: "THE",
  headlineCyan: "FINE PRINT",
  subline:
    "Everything you need to know about ordering, returns, warranty, and how we handle your data. Plain language, no hidden surprises.",
  effectiveLabel: "EFFECTIVE: MAY 15, 2026",
} as const;

// Return address confirmed with Premier Fulfillment West
export const RETURN_ADDRESS = {
  label: "RETURN SHIPMENTS",
  recipient: "Litsaber c/o Premier Fulfillment West",
  attn: "Attn: Rudy Tinoco",
  line1: "19050 Messenia Ln, Building 8",
  line2: "Perris, CA 92571, USA",
} as const;

export const RELATED_RESOURCES = [
  {
    label: "Contact Us",
    description:
      "Reach our support team directly. We respond within 24 hours.",
    href: "/contact",
    icon: "mail" as const,
  },
  {
    // FAQ section lives at id="faq" on the Contact page (/contact#faq)
    label: "View FAQs",
    description:
      "Answers to common questions about ordering, returns, and the device.",
    href: "/contact#faq",
    icon: "faq" as const,
  },
  {
    label: "Activate & Setup",
    description: "Step-by-step setup guide for your new Litsaber.",
    href: "/activate",
    icon: "activate" as const,
  },
] as const;

export type RelatedResource = (typeof RELATED_RESOURCES)[number];
