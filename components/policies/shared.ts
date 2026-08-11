export const POLICIES_EFFECTIVE_DATE = "May 15, 2026";

export const POLICIES_HERO = {
  eyebrow: "POLICIES & TERMS",
  headlineWhite: "THE",
  headlineCyan: "FINE PRINT",
  subline:
    "Everything you need to know about ordering, returns, warranty, and how we handle your data. Plain language, no hidden surprises.",
  effectiveLabel: "EFFECTIVE: MAY 15, 2026",
} as const;

// The one place the return address is written down. The refunds, warranty and
// privacy pages all render these same four lines, so they spread this rather
// than restating it — a mailing address that disagrees with itself across
// three policy pages is a support ticket waiting to happen.
export const RETURN_ADDRESS_LINES = {
  recipient: "Innovape Concepts",
  attn: "Attn: Brendan Friedrich",
  line1: "801 E Chapman Ave, Suite #105",
  line2: "Fullerton, CA 92831, USA",
} as const;

export const RETURN_ADDRESS = {
  label: "RETURN SHIPMENTS",
  ...RETURN_ADDRESS_LINES,
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
