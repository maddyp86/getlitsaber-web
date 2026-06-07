export const POLICIES_EFFECTIVE_DATE = "May 15, 2026";

export const POLICIES_HERO = {
  eyebrow: "POLICIES & TERMS",
  headlineWhite: "THE",
  headlineCyan: "FINE PRINT",
  subline:
    "Everything you need to know about ordering, returns, warranty, and how we handle your data. Plain language, no hidden surprises.",
  effectiveLabel: "EFFECTIVE: MAY 15, 2026",
} as const;

// TODO: Confirm full return address with Premier Fulfillment West before populating
export const RETURN_ADDRESS = {
  label: "RETURN SHIPMENTS",
  recipient: "Premier Fulfillment West",
  attn: "ATTN: Litsaber Returns",
  line1: "[TODO: Street Address]",
  line2: "[TODO: City, State ZIP]",
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
