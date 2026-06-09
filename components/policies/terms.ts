import type { Para } from "./shipping-returns";
import type { AddressBlockData } from "@/components/policies/AddressBlock";
import { WARRANTY_CONTACT_BLOCK } from "./warranty";

export type { Para };

export const SECTIONS: { number: string; title: string }[] = [
  { number: "01", title: "Overview" },
  { number: "02", title: "Eligibility & Age Requirement" },
  { number: "03", title: "Products & Use" },
  { number: "04", title: "Payment Terms" },
  { number: "05", title: "Order Acceptance & Cancellation" },
  { number: "06", title: "Pricing & Availability" },
  { number: "07", title: "Shipping & Delivery" },
  { number: "08", title: "Returns & Warranty" },
  { number: "09", title: "Chargebacks & Fraud" },
  { number: "10", title: "Prohibited Uses" },
  { number: "11", title: "Intellectual Property" },
  { number: "12", title: "Limitation of Liability" },
  { number: "13", title: "Disclaimer" },
  { number: "14", title: "Indemnification" },
  { number: "15", title: "Governing Law" },
  { number: "16", title: "Changes to Terms" },
  { number: "17", title: "Contact Information" },
];

// ─── Quick Summary ────────────────────────────────────────────────────────────

export const QUICK_SUMMARY: Para = [
  {
    t: "txt",
    v: "These Terms govern your use of ",
  },
  { t: "link", v: "getlitsaber.com", href: "/" },
  {
    t: "txt",
    v: " and your purchase of Litsaber products. By accessing the site or placing an order, you agree to all of the following terms.",
  },
];

// ─── Section 01: Overview ─────────────────────────────────────────────────────

export const S01_PARA1: Para = [
  {
    t: "txt",
    v: 'This website is operated by Innovape Concepts LLC ("Company," "we," "us," or "our"). Throughout the site, the terms "we," "us," and "our" refer to Innovape Concepts LLC.',
  },
];

export const S01_PARA2: Para = [
  {
    t: "txt",
    v: 'By visiting our site or purchasing our products, you engage in our "Service" and agree to be bound by these Terms of Service ("Terms"), including any additional policies referenced here or available by hyperlink.',
  },
];

export const S01_PARA3: Para = [
  {
    t: "txt",
    v: "These Terms apply to all users of the site, including browsers, customers, merchants, and contributors of content. If you do not agree to all the Terms, you may not access the website or use any services.",
  },
];

// ─── Section 02: Eligibility & Age Requirement ───────────────────────────────

export const S02_PARA1: Para = [
  {
    t: "txt",
    v: "Our products are intended for use only by individuals 21 years of age or older (or the legal age in your jurisdiction, whichever is higher).",
  },
];

export const S02_PARA2: Para = [
  { t: "txt", v: "By placing an order, you confirm that:" },
];

export const S02_BULLETS: string[] = [
  "You are at least 21 years old.",
  "You are legally permitted to purchase vape-related products in your jurisdiction.",
  "You are using our products in compliance with all applicable laws.",
];

export const S02_PARA3: Para = [
  {
    t: "txt",
    v: "We reserve the right to request age verification at any time.",
  },
];

// ─── Section 03: Products & Use ──────────────────────────────────────────────

export const S03_PARA1: Para = [
  {
    t: "txt",
    v: "Innovape Concepts LLC sells hardware products including, but not limited to, the Litsaber LED vape battery device, which is compatible with 510-thread cartridges.",
  },
];

export const S03_PARA2: Para = [
  {
    t: "b",
    v: "We do not sell THC, cannabis, or any controlled substances.",
  },
];

export const S03_PARA3: Para = [
  {
    t: "txt",
    v: "Our products are intended for lawful use only. You are responsible for understanding and complying with all local, state, and federal laws regarding vape devices and related products. Improper use may result in injury or damage. Use at your own risk.",
  },
];

// ─── Section 04: Payment Terms ───────────────────────────────────────────────

export const S04_PARA1: Para = [
  {
    t: "txt",
    v: "We accept major credit cards and other payment methods displayed at checkout. By submitting payment information, you represent and warrant that:",
  },
];

export const S04_BULLETS: string[] = [
  "You are authorized to use the payment method.",
  "The information provided is accurate and complete.",
  "You authorize us to charge the total amount displayed at checkout.",
];

export const S04_PARA2: Para = [
  {
    t: "txt",
    v: "All payments are processed securely through third-party payment processors. We do not store full credit card numbers on our servers. We reserve the right to refuse or cancel any order at our sole discretion.",
  },
];

// ─── Section 05: Order Acceptance & Cancellation ─────────────────────────────

export const S05_PARA1: Para = [
  {
    t: "txt",
    v: "All orders are subject to acceptance and availability. We reserve the right to:",
  },
];

export const S05_BULLETS: string[] = [
  "Refuse or cancel any order.",
  "Limit quantities purchased per person or per order.",
  "Cancel orders suspected of fraud, resale abuse, or violation of these Terms.",
];

export const S05_PARA2: Para = [
  {
    t: "txt",
    v: "If your order is canceled after payment has been processed, you will receive a refund to the original method of payment.",
  },
];

// ─── Section 06: Pricing & Availability ──────────────────────────────────────

export const S06_PARA1: Para = [
  {
    t: "txt",
    v: "Prices are subject to change without notice. We reserve the right to modify or discontinue products at any time without liability. In the event of pricing errors, we reserve the right to cancel or refuse orders placed at incorrect prices.",
  },
];

// ─── Section 07: Shipping & Delivery ─────────────────────────────────────────

export const S07_PARA1: Para = [
  {
    t: "txt",
    v: "Shipping timelines are estimates and are not guaranteed. Innovape Concepts LLC is not responsible for:",
  },
];

export const S07_BULLETS: string[] = [
  "Carrier delays",
  "Lost or stolen packages marked as delivered",
  "Customs delays (if applicable)",
];

export const S07_PARA2: Para = [
  {
    t: "txt",
    v: "Risk of loss transfers to the customer upon shipment. For the full shipping policy, see ",
  },
  {
    t: "link",
    v: "Shipping & Returns",
    href: "/policies/shipping-returns",
  },
  { t: "txt", v: "." },
];

// ─── Section 08: Returns & Warranty ──────────────────────────────────────────

export const S08_PARA1: Para = [
  {
    t: "txt",
    v: "Our detailed return procedures are described in the ",
  },
  {
    t: "link",
    v: "Shipping & Returns",
    href: "/policies/shipping-returns",
  },
  { t: "txt", v: " section. Our warranty terms are described in the " },
  { t: "link", v: "Warranty Policy", href: "/policies/warranty" },
  {
    t: "txt",
    v: " section. Both are incorporated into these Terms of Service by reference.",
  },
];

export const S08_SUBHEAD_1 = "Defective Products";

export const S08_PARA2: Para = [
  {
    t: "txt",
    v: "If a product arrives defective or damaged, you must contact us within the timeframe specified in our ",
  },
  { t: "link", v: "Warranty Policy", href: "/policies/warranty" },
  {
    t: "txt",
    v: ". We may request photo or video evidence before issuing a replacement, repair, or store credit as outlined in the applicable policy.",
  },
];

export const S08_SUBHEAD_2 = "General Returns";

export const S08_PARA3: Para = [
  { t: "txt", v: "Due to the nature of vape hardware products:" },
];

export const S08_BULLETS: string[] = [
  "Opened or used products are not eligible for return unless covered under the Warranty Policy.",
  "Unopened items may be eligible for return subject to the conditions in our Shipping & Return Policy.",
  "Shipping costs are non-refundable unless otherwise stated.",
];

// ─── Section 09: Chargebacks & Fraud ─────────────────────────────────────────

export const S09_PARA1: Para = [
  {
    t: "txt",
    v: "Unauthorized chargebacks or payment disputes made without first contacting us may be considered fraud. We reserve the right to:",
  },
];

export const S09_BULLETS: string[] = [
  "Contest illegitimate chargebacks.",
  "Provide order documentation to payment processors.",
  "Restrict future purchases from customers engaging in abusive disputes.",
];

export const S09_PARA2: Para = [
  { t: "txt", v: "If you have an issue with your order, contact us at " },
  { t: "email", v: "order@getlitsaber.com" },
  {
    t: "txt",
    v: " before initiating a dispute. We resolve most issues within 1 to 2 business days.",
  },
];

// ─── Section 10: Prohibited Uses ─────────────────────────────────────────────

export const S10_PARA1: Para = [
  { t: "txt", v: "You may not use the site or our products:" },
];

export const S10_BULLETS: string[] = [
  "For unlawful purposes.",
  "To violate any local, state, federal, or international law.",
  "To resell without authorization.",
  "To infringe upon intellectual property rights.",
  "To interfere with site security.",
];

export const S10_PARA2: Para = [
  { t: "txt", v: "We reserve the right to terminate access for violations." },
];

// ─── Section 11: Intellectual Property ───────────────────────────────────────

export const S11_PARA1: Para = [
  {
    t: "txt",
    v: 'All content on this website, including text, graphics, product designs, logos, and branding (including "Litsaber" and related marks), is the property of Innovape Concepts LLC. Unauthorized use, reproduction, or distribution is prohibited.',
  },
];

// ─── Section 12: Limitation of Liability ─────────────────────────────────────

export const S12_PARA1: Para = [
  {
    t: "txt",
    v: "To the maximum extent permitted by law, Innovape Concepts LLC shall not be liable for:",
  },
];

export const S12_BULLETS: string[] = [
  "Indirect, incidental, or consequential damages",
  "Personal injury resulting from misuse of our products",
  "Lost profits or business interruption",
  "Damage arising from third-party payment processors",
];

export const S12_PARA2: Para = [
  { t: "txt", v: "Use of our products is at your own risk." },
];

// ─── Section 13: Disclaimer ───────────────────────────────────────────────────

export const S13_PARA1: Para = [
  {
    t: "txt",
    v: 'Products are provided "as is" and "as available." We make no warranties, express or implied, including merchantability or fitness for a particular purpose, except as specifically stated in our ',
  },
  { t: "link", v: "Warranty Policy", href: "/policies/warranty" },
  { t: "txt", v: "." },
];

export const S13_PARA2: Para = [
  {
    t: "txt",
    v: "Battery-operated devices carry inherent risks. Follow all safety instructions carefully. See the ",
  },
  { t: "link", v: "Activate page", href: "/activate" },
  { t: "txt", v: " for usage and safety guidance." },
];

// ─── Section 14: Indemnification ─────────────────────────────────────────────

export const S14_PARA1: Para = [
  {
    t: "txt",
    v: "You agree to indemnify and hold harmless Innovape Concepts LLC, its owners, officers, employees, and affiliates from any claims arising from:",
  },
];

export const S14_BULLETS: string[] = [
  "Your misuse of our products",
  "Violation of these Terms",
  "Violation of any law or third-party rights",
];

// ─── Section 15: Governing Law ────────────────────────────────────────────────

export const S15_PARA1: Para = [
  {
    t: "txt",
    v: "These Terms shall be governed by and construed in accordance with the laws of the ",
  },
  { t: "b", v: "State of California, United States" },
  {
    t: "txt",
    v: ", without regard to conflict-of-law principles. Any disputes shall be resolved in the state or federal courts located in Orange County, California.",
  },
];

// ─── Section 16: Changes to Terms ────────────────────────────────────────────

export const S16_PARA1: Para = [
  {
    t: "txt",
    v: 'We reserve the right to update or modify these Terms at any time. Changes will be posted on this page with an updated "Effective" date. Continued use of the website constitutes acceptance of any changes.',
  },
];

// ─── Section 17: Contact Information ─────────────────────────────────────────

export const S17_PARA1: Para = [
  {
    t: "txt",
    v: "If you have any questions about these Terms of Service, please contact us using the information above.",
  },
];

export const TERMS_CONTACT_BLOCK: AddressBlockData = WARRANTY_CONTACT_BLOCK;
