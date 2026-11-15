import type { Para } from "./shipping-returns";

export type { Para };

// Age policy. Written 2026-11-15 when the hard-wall age gate came down for the
// ad launch: the 21+ rule now lives here, in the Terms, and in the footer
// disclaimer, and a purchase certifies age.

export const QUICK_SUMMARY: Para = [
  { t: "b", v: "Quick summary:" },
  {
    t: "txt",
    v: " You must be 21 or older to buy or use a Litsaber, or older if the law where you live sets a higher age. By ordering, you certify that you meet that age. We do not sell to minors, we may ask for proof of age at any time, and an order from a minor is a breach of our terms and will be cancelled.",
  },
];

export const S01_PARA1: Para = [
  {
    t: "txt",
    v: "Litsaber products are sold only to adults. To buy from this website, or to use a Litsaber, you must be the greater of: 21 years of age, the age of majority where you live, or the minimum legal age in your jurisdiction to purchase or use a 510-thread battery device.",
  },
];

export const S01_PARA2: Para = [
  {
    t: "txt",
    v: "Any sale to a minor is a violation of our Terms of Service. Orders we believe were placed by or for a minor will be cancelled and refunded.",
  },
];

export const S02_PARA1: Para = [
  {
    t: "txt",
    v: "By placing an order, you certify that you meet the age requirement above and that the product is for your own use or for another adult who does. The age requirement is also stated in our Terms of Service, which you accept at checkout.",
  },
];

export const S02_PARA2: Para = [
  {
    t: "txt",
    v: "We reserve the right to request proof of age at any time, before or after a sale, by asking for a government-issued photo ID. If proof is not provided when requested, we may cancel the order or decline future orders.",
  },
];

export const S03_PARA1: Para = [
  {
    t: "txt",
    v: "Litsaber is a 510-thread battery accessory. It does not contain nicotine, tobacco, cannabis or any other substance, and it is not intended for use with nicotine or e-liquid. Even so, it is a product for adults, and we have chosen to sell it only to adults 21 and over everywhere we ship.",
  },
];

export const S03_PARA2: Para = [
  {
    t: "txt",
    v: "What you use with the device is subject to the laws where you live. Check your local rules; they may set a higher minimum age than ours.",
  },
];

export const S04_PARA1: Para = [
  {
    t: "txt",
    v: "Retailers that stock Litsaber agree to sell it only to adults who meet the legal age in their jurisdiction and to verify age at the point of sale where the law requires it.",
  },
];

export const S05_PARA1: Para = [
  {
    t: "txt",
    v: "Questions about this policy: email ",
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
  { t: "b", v: ", our " },
  { t: "link", v: "Disclaimer", href: "/policies/disclaimer" },
  { t: "b", v: ", this Age Policy and our " },
  { t: "link", v: "Privacy Policy", href: "/policies/privacy" },
  { t: "b", v: ". Buying or using the product means you have." },
];

