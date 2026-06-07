import type { Para } from "@/content/policies/shipping-returns";
import type { AddressBlockData } from "@/components/policies/AddressBlock";

export type { Para };

// ─── Quick Summary ────────────────────────────────────────────────────────────

export const QUICK_SUMMARY: Para = [
  {
    t: "txt",
    v: "Every Litsaber is covered by a 6-month limited warranty against manufacturing defects under normal use. If your device has a defect, contact us and we'll repair or replace it at no cost.",
  },
];

// ─── Section 01: Six (6) Month Limited Warranty ───────────────────────────────

export const S01_PARA1: Para = [
  {
    t: "txt",
    v: 'Innovape Concepts LLC ("Innovape") warrants its Litsaber products against defects in materials and workmanship under normal use for six (6) months from the date of retail purchase by the original end-user purchaser.',
  },
];

export const S01_PARA2: Para = [
  {
    t: "txt",
    v: "If a valid claim is received within this period, Innovape will, at its discretion:",
  },
];

export const S01_BULLETS: string[] = [
  "Replace the product with a new unit of the same model, or",
  "If the model is discontinued or unavailable, replace it with a functionally similar product of equal value.",
];

export const S01_CALLOUT: Para = [
  { t: "b", v: "Refunds are not provided under the warranty policy." },
  { t: "txt", v: " For refund eligibility, see the " },
  { t: "link", v: "Shipping & Returns", href: "/policies/shipping-returns" },
  { t: "txt", v: " section." },
];

// ─── Section 02: How to Submit a Warranty Claim ───────────────────────────────

export const S02_PARA1: Para = [
  {
    t: "txt",
    v: "Warranty inspection and service are arranged through and approved solely by Innovape Support. If you believe your Litsaber may require warranty service, email us at ",
  },
  { t: "email", v: "order@getlitsaber.com" },
  { t: "txt", v: "." },
];

export const S02_PARA2: Para = [
  { t: "txt", v: "Please be prepared to provide:" },
];

export const S02_BULLETS: string[] = [
  "Proof of purchase (order number or receipt)",
  "A photo or video clearly showing the defect or issue",
];

export const S02_PARA3: Para = [
  { t: "txt", v: "If a return is required, we will provide a " },
  { t: "b", v: "prepaid shipping label" },
  {
    t: "txt",
    v: " for your convenience. Warranty claims are prioritized and typically processed within ",
  },
  { t: "b", v: "4 business days" },
  { t: "txt", v: " of receiving your device." },
];

export const S02_CALLOUT: Para = [
  { t: "mag-b", v: "Important:" },
  {
    t: "txt",
    v: " Innovape Concepts LLC is not responsible for lost packages if your return is not scanned or accepted by the shipping carrier when using our provided label. Always obtain a drop-off receipt when using a prepaid label.",
  },
];

// ─── Section 03: Limitations & Exclusions ────────────────────────────────────

export const S03_PARA1: Para = [
  { t: "txt", v: "This Limited Warranty does not cover:" },
];

export const S03_BULLETS: string[] = [
  "Normal performance degradation of batteries over time",
  "Damage caused by accident, abuse, misuse, drops, fire, flood, or external causes",
  "Operation outside intended use or care instructions",
  "Cosmetic damage (scratches, dents, chips, or discoloration)",
  "Devices that have been opened, disassembled, or modified",
  "Products purchased from unauthorized resellers or third-party marketplaces (e.g., eBay, Craigslist, unauthorized Amazon sellers)",
];

export const S03_PARA2: Para = [
  {
    t: "txt",
    v: "Warranty service is ",
  },
  {
    t: "b",
    v: "valid only for products purchased directly from Innovape Concepts or an authorized retailer/distributor.",
  },
  {
    t: "txt",
    v: " If you purchased your product internationally, you are responsible for any import duties or taxes required to receive a replacement.",
  },
];

export const S03_PARA3: Para = [
  {
    t: "txt",
    v: "This warranty applies only to the original end-user purchaser and is ",
  },
  { t: "b", v: "non-transferable." },
];

// ─── Section 04: Counterfeit Products ────────────────────────────────────────

export const S04_PARA1: Para = [
  {
    t: "txt",
    v: "Innovape Concepts takes the authenticity and safety of its products seriously. Counterfeit or imitation products pose potential safety risks and are ",
  },
  { t: "b", v: "not covered under this warranty." },
];

export const S04_PARA2: Para = [
  {
    t: "txt",
    v: "We strongly advise purchasing Litsaber products only through authorized channels. To verify an authorized retailer or distributor, contact us directly.",
  },
];

export const S04_PARA3: Para = [
  {
    t: "txt",
    v: "Innovape actively investigates and pursues unauthorized sellers and counterfeit operations to protect our customers and brand integrity. We cannot reimburse, replace, or assist with disputes related to counterfeit or unauthorized purchases.",
  },
];

// ─── Section 05: Warranty Contact ────────────────────────────────────────────

export const S05_PARA1: Para = [
  { t: "txt", v: "For all warranty inquiries, contact:" },
];

export const WARRANTY_CONTACT_BLOCK: AddressBlockData = {
  label: "INNOVAPE CONCEPTS LLC",
  contacts: [
    {
      rowLabel: "Email",
      display: "order@getlitsaber.com",
      href: "mailto:order@getlitsaber.com",
    },
    {
      rowLabel: "Website",
      display: "getlitsaber.com",
      href: "/",
    },
  ],
  addressLabel: "RETURNS ADDRESS",
  recipient: "Litsaber c/o Premier Fulfillment West",
  attn: "Attn: Rudy Tinoco",
  line1: "19050 Messenia Ln, Building 8",
  line2: "Perris, CA 92571, USA",
};
