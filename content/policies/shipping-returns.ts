// Typed segments for rich-text paragraphs.
// The page component assembles JSX from these; no markup lives here.
export type Seg =
  | { t: "txt"; v: string }
  | { t: "b"; v: string }
  | { t: "link"; v: string; href: string }
  | { t: "email"; v: string }
  | { t: "mag"; v: string };

export type Para = Seg[];

// ─── Quick Summary ────────────────────────────────────────────────────────────

export const QUICK_SUMMARY: Para = [
  { t: "b", v: "Quick summary:" },
  {
    t: "txt",
    v: " we ship Monday to Friday from our warehouse in California, typically within 1 business day of order placement. Returns are accepted for unopened products within 14 days of delivery. Defective devices are covered separately under our 6-month limited warranty.",
  },
];

// ─── Section 01: Shipping ─────────────────────────────────────────────────────

export const S01_PARA1: Para = [
  { t: "txt", v: "Due to high order volume, please allow up to " },
  { t: "b", v: "5 business days" },
  {
    t: "txt",
    v: " for order processing. We offer USPS shipping on all US orders. We ship Monday through Friday from our warehouse, typically within 1 business day of order placement.",
  },
];

export const S01_PARA2: Para = [
  { t: "txt", v: "Please allow up to " },
  { t: "b", v: "7 business days" },
  { t: "txt", v: " for delivery after shipment." },
];

export const S01_PARA3: Para = [
  {
    t: "txt",
    v: "Once your order ships, you'll receive a confirmation email with a tracking link. Allow 1 to 2 days for the carrier to scan the package and update tracking status. You can also view tracking by logging into your account at ",
  },
  { t: "link", v: "getlitsaber.com", href: "/" },
  { t: "txt", v: " and clicking the tracking link in your Order History." },
];

export const S01_PARA4: Para = [
  {
    t: "txt",
    v: "For requests to reroute a package, or if your order is being held at a carrier facility, please contact the courier directly.",
  },
];

// ─── Section 02: Returns & Refunds ───────────────────────────────────────────

export const S02_PARA1: Para = [
  { t: "txt", v: "We accept returns only for " },
  { t: "b", v: "unopened and unused products" },
  { t: "txt", v: " purchased directly through " },
  { t: "link", v: "getlitsaber.com", href: "/" },
  { t: "txt", v: "." },
];

export const S02_PARA2: Para = [
  { t: "txt", v: "You have " },
  { t: "b", v: "14 days from the date of delivery" },
  { t: "txt", v: " to request a full refund. To qualify:" },
];

export const S02_QUALIFICATIONS: string[] = [
  "The product must be unused and in its original packaging.",
  "You must contact our support team for a Return Authorization (RA) before shipping your return.",
  "You are responsible for the return shipping cost.",
];

export const S02_PARA3: Para = [
  { t: "txt", v: "To begin a return, email " },
  { t: "email", v: "order@getlitsaber.com" },
  { t: "txt", v: " with your order number." },
];

export const S02_CALLOUT_LEADIN =
  "Do not ship cannabis, cannabis concentrates or oils, or nicotine with any return.";

export const S02_CALLOUT_BODY =
  " We accept only the device. Unauthorized returns or those received without an approved RA may not be processed.";

// ─── Section 03: Return Address ───────────────────────────────────────────────

export const S03_PARA1: Para = [
  {
    t: "txt",
    v: "If you're returning an item valued over $75, we recommend using a trackable shipping service or purchasing shipping insurance. We cannot guarantee receipt of returned items shipped without tracking.",
  },
];

// ─── Section 04: Refund Processing ───────────────────────────────────────────

export const S04_PARA1: Para = [
  {
    t: "txt",
    v: "Once your return is received and inspected, you'll receive an email confirming receipt and notifying you of approval or rejection. If approved, your refund will be processed to your original payment method within ",
  },
  { t: "b", v: "7 to 10 business days" },
  { t: "txt", v: "." },
];

export const S04_PARA2: Para = [
  {
    t: "txt",
    v: "Shipping costs are non-refundable. If a refund is approved, the original shipping cost will be deducted from your total refund.",
  },
];

// ─── Section 05: Sale Items ───────────────────────────────────────────────────

export const S05_PARA1: Para = [
  {
    t: "txt",
    v: "All sale items are final and not eligible for refund. Price adjustments for full-priced purchases made within ",
  },
  { t: "b", v: "3 days of a sale" },
  { t: "txt", v: " will be processed upon inquiry. Contact " },
  { t: "email", v: "order@getlitsaber.com" },
  { t: "txt", v: " with your order number." },
];

// ─── Section 06: Defective Products ──────────────────────────────────────────

export const S06_PARA1: Para = [
  {
    t: "txt",
    v: "If your Litsaber arrives defective or stops working under normal use, you may be eligible for a free replacement under our 6-month limited warranty. See the ",
  },
  { t: "link", v: "Warranty", href: "/policies/warranty" },
  { t: "txt", v: " section for details." },
];

// ─── Section 07: Risk of Loss & Carrier Delays ────────────────────────────────

export const S07_PARA1: Para = [
  {
    t: "txt",
    v: "Risk of loss transfers to the customer upon shipment. We are not responsible for carrier delays, lost or stolen packages marked as delivered, or customs delays on international orders.",
  },
];

export const S07_PARA2: Para = [
  {
    t: "txt",
    v: "If a package is marked delivered but you have not received it, contact the carrier directly to file a claim. We can provide order documentation to support your claim.",
  },
];

// ─── Section 08: Questions ────────────────────────────────────────────────────

export const S08_PARA1: Para = [
  { t: "txt", v: "For any shipping or return question, contact us at " },
  { t: "email", v: "order@getlitsaber.com" },
  { t: "txt", v: " with your order number." },
];
