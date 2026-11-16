import type { Para } from "./shipping-returns";

export type { Para };

// Website and product disclaimer. Written 2026-11-15 alongside the Age Policy
// so the storefront states its limits in one place: information is provided
// as is, the device is for adults, paid and affiliate content is disclosed,
// the MSRP anchor is explained, and lithium battery handling is spelled out.

export const QUICK_SUMMARY: Para = [
  { t: "b", v: "Quick summary:" },
  {
    t: "txt",
    v: " Read this before you buy or use a Litsaber. The information on this site is provided as is and can change without notice. Litsaber is for adults 18 and over. Some of the content you see about Litsaber comes from people we have a relationship with, and we say so here. Struck-through prices are the manufacturer's suggested retail price, not a former sale price. The device contains a lithium battery, so handle it as described below. Our liability is limited as set out in our Terms of Service.",
  },
];

export const S01_PARA1: Para = [
  {
    t: "txt",
    v: "Information on this website is provided \"as is\" without warranty of any kind, express or implied, including implied warranties of merchantability, fitness for a particular purpose, and non-infringement. Pages may contain technical inaccuracies or typographical errors, and we may change or update content at any time without notice.",
  },
];

export const S01_PARA2: Para = [
  {
    t: "txt",
    v: "Innovape Concepts LLC is not responsible for misuse of its products or for decisions made in reliance on information published here. Battery life, charge times, compatibility and lighting behavior are described for typical use; individual results vary with the cartridge, the environment and how the device is used.",
  },
];

export const S02_PARA1: Para = [
  { t: "b", v: "Litsaber is for adults 18 and over." },
  {
    t: "txt",
    v: " Our products are not intended for, marketed to, or sold to anyone under 18. The full rule, including how we handle age verification, is in our ",
  },
  { t: "link", v: "Age Policy", href: "/policies/age-policy" },
  {
    t: "txt",
    v: ".",
  },
];

export const S03_PARA1: Para = [
  {
    t: "txt",
    v: "Content about Litsaber, including reviews, testimonials, recommendations, photos and videos, appears on this website, on our social accounts, in our emails and texts, and on third-party sites. Some of it is created by people we have a material connection with, as the Federal Trade Commission defines that term: affiliates, creators, promoters, customers we have given free product or a discount, and people we pay.",
  },
];

export const S03_PARA2: Para = [
  {
    t: "txt",
    v: "We ask everyone with a material connection to disclose it clearly, for example with #ad or #sponsored, and to be honest about their experience. When you see content about Litsaber, assume the creator may have a material connection with us even if the disclosure is missing. That assumption will help you make a better purchase decision.",
  },
];

export const S03_PARA3: Para = [
  {
    t: "txt",
    v: "Affiliates earn a commission on qualifying purchases made through their links or codes. The price you pay is the same either way.",
  },
];

export const S04_PARA1: Para = [
  {
    t: "txt",
    v: "Reviews reflect one person's experience and may not represent the typical result. A review may refer to the device, a bundle, our shipping, our support or the brand as a whole. Reviews from verified buyers are collected through our reviews provider. We do not pay for reviews, but a reviewer may have received a discount or free product, and the rule in the previous section applies.",
  },
];

export const S05_PARA1: Para = [
  {
    t: "txt",
    v: "Litsaber sells for $39.99 a unit. Where you see a higher struck-through price next to it, that figure is the manufacturer's suggested retail price (MSRP) of $49.99. It is a reference price, not a price we previously charged for any particular period, and the difference is not a sale, a discount or a limited-time offer.",
  },
];

export const S05_PARA2: Para = [
  {
    t: "txt",
    v: "Shipping is charged on single-unit orders and is free on orders of two or more units, as stated at checkout and in our ",
  },
  { t: "link", v: "Shipping & Returns policy", href: "/policies/shipping-returns" },
  {
    t: "txt",
    v: ". Wholesale pricing is separate and is not shown on this site.",
  },
];

export const S06_PARA1: Para = [
  {
    t: "txt",
    v: "Litsaber contains a rechargeable lithium-ion cell. Like any lithium battery, it can overheat or fail if it is damaged, short-circuited, charged with the wrong equipment or exposed to extreme heat. Follow these rules:",
  },
];

export const S06_BULLETS: string[] = [
  "Charge only with the included USB-C cable or a standard USB-C charger. Do not leave it charging unattended overnight.",
  "Do not use the device if the body is cracked, the battery is swollen, or it becomes unusually hot.",
  "Keep it away from water, open flame, and temperatures above 113°F (45°C), including a parked car in summer.",
  "Do not disassemble, puncture or modify the device. Use it only with standard 510-thread cartridges.",
  "Keep it and its small parts away from children and pets.",
  "Travel with it in carry-on baggage only, as airlines require for lithium batteries.",
  "Dispose of it at a battery recycling point, not in household trash.",
];

export const S06_PARA2: Para = [
  {
    t: "txt",
    v: "Innovape Concepts LLC is not liable for injury or damage that results from misuse, modification, improper charging or storage, or use with anything other than a standard 510-thread cartridge.",
  },
];

export const S07_PARA1: Para = [
  {
    t: "txt",
    v: "To the fullest extent permitted by law, Innovape Concepts LLC's total liability to you for any claim arising from this website or our products is limited to the amount you paid for the product in question, and excludes indirect, incidental, consequential and punitive damages and lost profits.",
  },
];

export const S07_PARA2: Para = [
  {
    t: "txt",
    v: "You agree not to bring claims personally against our officers, employees, agents or contractors in connection with this website or our products. The limitations in this disclaimer protect them, our affiliates, successors and assigns as well as the company.",
  },
];

export const S07_PARA3: Para = [
  {
    t: "txt",
    v: "This disclaimer is governed by the laws of the State of California. Any dispute is subject to the dispute resolution terms in our ",
  },
  { t: "link", v: "Terms of Service", href: "/policies/terms" },
  {
    t: "txt",
    v: ", which take precedence where they differ from this page.",
  },
];

export const S08_PARA1: Para = [
  {
    t: "txt",
    v: "Questions about anything on this page: email ",
  },
  { t: "email", v: "info@getlitsaber.com" },
  {
    t: "txt",
    v: " or use the ",
  },
  { t: "link", v: "contact page", href: "/contact" },
  {
    t: "txt",
    v: ".",
  },
];

export const IMPORTANT_NOTICE: Para = [
  { t: "b", v: "Before you buy or use a Litsaber, read and agree to our " },
  { t: "link", v: "Terms of Service", href: "/policies/terms" },
  { t: "b", v: ", this Disclaimer, our " },
  { t: "link", v: "Age Policy", href: "/policies/age-policy" },
  { t: "b", v: " and our " },
  { t: "link", v: "Privacy Policy", href: "/policies/privacy" },
  { t: "b", v: ". Buying or using the product means you have." },
];

