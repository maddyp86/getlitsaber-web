import type { Para } from "./shipping-returns";
import type { AddressBlockData } from "@/components/policies/AddressBlock";

export type { Para };

export const SECTIONS: { number: string; title: string }[] = [
  { number: "01", title: "Information We Collect" },
  { number: "02", title: "Cookies & Tracking" },
  { number: "03", title: "How We Use Your Information" },
  { number: "04", title: "Sharing & Disclosure" },
  { number: "05", title: "Your Choices" },
  { number: "06", title: "California Residents" },
  { number: "07", title: "Age of Consent" },
  { number: "08", title: "Data Security" },
  { number: "09", title: "Changes to This Policy" },
  { number: "10", title: "Contact Information" },
];

// ─── Quick Summary ────────────────────────────────────────────────────────────

export const QUICK_SUMMARY: Para = [
  {
    t: "txt",
    v: "We collect information you provide (orders, account details, support requests) and information automatically captured (device data, browsing behavior, cookies). We use it to fulfill orders, support you, improve our products, and comply with the law. We never sell your personal information.",
  },
];

// ─── Section 01: Information We Collect ──────────────────────────────────────

export const S01_PARA1: Para = [
  { t: "txt", v: "We collect personal information you provide to us when you:" },
];

export const S01_BULLETS_A: string[] = [
  "Place an order or create an account",
  "Contact us for customer support or returns",
  "Subscribe to our newsletter or marketing communications",
  "Participate in a contest, promotion, or survey",
  "Apply for a job or otherwise communicate with us",
];

export const S01_PARA2: Para = [
  { t: "txt", v: "The personal information we may collect includes:" },
];

export const S01_BULLETS_B: string[] = [
  "Name, mailing address, and billing address",
  "Email address and phone number",
  "Date of birth (for age verification)",
  "Payment information (processed by our payment provider, we do not store full card numbers)",
  "Order history and product preferences",
  "Records of your correspondence with us",
  "Information related to contests, surveys, or job applications",
];

export const S01_SUBHEAD_AUTO = "Information Automatically Collected";

export const S01_PARA3: Para = [
  { t: "txt", v: "When you visit our site, we (or our service providers) may automatically collect:" },
];

export const S01_BULLETS_C: string[] = [
  "Device information: IP address, hardware model, operating system, mobile network information, and unique device identifiers.",
  "Site interaction: Browsing history, pages visited, items added to your cart (including abandoned cart data for reminder messages).",
  "Geolocation data: General location based on IP address or billing address. We do not collect precise GPS location unless you grant permission.",
];

// ─── Section 02: Cookies & Tracking ──────────────────────────────────────────

export const S02_PARA1: Para = [
  {
    t: "txt",
    v: "Like most websites, we use cookies and similar tracking technologies (web beacons, pixels) to improve your experience, analyze site usage, and personalize content. Cookies are small files stored by your browser that help us remember your preferences and shopping cart contents.",
  },
];

export const S02_SUBHEAD_THIRD = "Third-party tracking";

export const S02_PARA2: Para = [
  {
    t: "txt",
    v: "The following third parties may collect information about you when you use our site:",
  },
];

// Third-party entries rendered inline in the page (need external links)
export const S02_THIRD_PARTIES: { label: string; policyUrl: string }[] = [
  { label: "Google (analytics & advertising)", policyUrl: "https://policies.google.com/privacy" },
  { label: "Meta / Facebook (advertising)", policyUrl: "https://www.facebook.com/privacy/policy" },
  { label: "TikTok (advertising)", policyUrl: "https://www.tiktok.com/legal/page/row/privacy-policy/en" },
  { label: "Pinterest (advertising)", policyUrl: "https://policy.pinterest.com/en/privacy-policy" },
  { label: "Twitter / X (advertising)", policyUrl: "https://twitter.com/en/privacy" },
];

export const S02_GAOPTOUT_URL = "https://tools.google.com/dlpage/gaoptout";

// ─── Section 03: How We Use Your Information ─────────────────────────────────

export const S03_PARA1: Para = [
  { t: "txt", v: "We use your personal information to:" },
];

export const S03_BULLETS: string[] = [
  "Process orders, send shipping notifications, and handle returns and exchanges",
  "Respond to your questions and provide customer support",
  "Send transactional and administrative messages",
  "Send marketing communications about products, offers, and events (only if you've opted in)",
  "Analyze trends, usage, and activities to improve our products and services",
  "Detect and prevent fraud and unauthorized transactions",
  "Personalize your shopping experience and advertising based on your preferences",
  "Comply with applicable laws and respond to legal requests",
  "Maintain the security and integrity of our site and services",
];

export const S03_CALLOUT: Para = [
  { t: "b", v: "We do not sell your personal information." },
  {
    t: "txt",
    v: " We may share it with service providers, advertising partners, and as required by law, as described in the next section.",
  },
];

// ─── Section 04: Sharing & Disclosure ────────────────────────────────────────

export const S04_PARA1: Para = [
  { t: "txt", v: "We may share your personal information in the following circumstances:" },
];

export const S04_SUBHEAD_SVC = "Service providers";

export const S04_PARA2: Para = [
  {
    t: "txt",
    v: "We share information with third-party service providers who help us operate our business, including:",
  },
];

export const S04_BULLETS: string[] = [
  "Payment processors (Authorize.net)",
  "Shipping and fulfillment partners",
  "Cloud hosting and data storage providers",
  "Email and SMS service providers",
  "Analytics providers (Google Analytics)",
  "Customer support and CRM platforms",
];

export const S04_PARA3: Para = [
  {
    t: "txt",
    v: "These providers only access information needed to perform their services and are obligated to protect it.",
  },
];

export const S04_SUBHEAD_ADS = "Advertising partners";

export const S04_DAA_URL = "https://optout.aboutads.info";

export const S04_SUBHEAD_LEGAL = "Legal requirements";

export const S04_PARA5: Para = [
  {
    t: "txt",
    v: "We may disclose your information when required by law, in response to a subpoena, court order, or government request, or to protect our rights, property, or safety, or that of our users or others.",
  },
];

export const S04_SUBHEAD_BIZ = "Business transfers";

export const S04_PARA6: Para = [
  {
    t: "txt",
    v: "If Innovape Concepts is acquired, merges with another company, or sells its assets, your information may be transferred as part of that transaction. The use of your personal information following such an event will be governed by this Privacy Policy or its successor.",
  },
];

export const S04_SUBHEAD_CONSENT = "With your consent";

export const S04_PARA7: Para = [
  {
    t: "txt",
    v: "We may share your information with your permission in other circumstances not described above.",
  },
];

// ─── Section 05: Your Choices ─────────────────────────────────────────────────

export const S05_SUBHEAD_COMM = "Communication preferences";

export const S05_PARA1: Para = [
  {
    t: "txt",
    v: "We may send you transactional, security, or administrative messages related to your account or orders. These are required to provide our services and cannot be opted out of.",
  },
];

export const S05_PARA2: Para = [
  { t: "txt", v: "For marketing communications, you can opt out at any time by:" },
];

export const S05_BULLETS: Array<Para> = [
  [{ t: "txt", v: 'Clicking the "unsubscribe" link in any marketing email' }],
  [{ t: "txt", v: "Replying STOP to any marketing SMS" }],
  [
    { t: "txt", v: "Emailing " },
    { t: "email", v: "hello@innovapeconcepts.com" },
    { t: "txt", v: " with your request" },
  ],
];

export const S05_PARA3: Para = [
  {
    t: "txt",
    v: "Opt-out requests may take a reasonable amount of time to process.",
  },
];

export const S05_SUBHEAD_CORRECTION = "Correction";

export const S05_PARA4: Para = [
  {
    t: "txt",
    v: "You can review and update your account information at any time by logging into your account. To correct other personal information we hold about you, contact ",
  },
  { t: "email", v: "hello@innovapeconcepts.com" },
  { t: "txt", v: "." },
];

// ─── Section 06: California Residents ────────────────────────────────────────

export const S06_PARA1: Para = [
  {
    t: "txt",
    v: "If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA):",
  },
];

export const S06_BULLETS: Array<Para> = [
  [
    { t: "b", v: "Right to know:" },
    { t: "txt", v: " Request the categories and specific pieces of personal information we have collected about you." },
  ],
  [
    { t: "b", v: "Right to delete:" },
    { t: "txt", v: " Request that we delete your personal information, subject to certain exceptions." },
  ],
  [
    { t: "b", v: "Right to correct:" },
    { t: "txt", v: " Request that we correct inaccurate personal information." },
  ],
  [
    { t: "b", v: "Right to opt out of sale or sharing:" },
    { t: "txt", v: " We do not sell your personal information. To opt out of cross-context behavioral advertising, contact " },
    { t: "email", v: "hello@innovapeconcepts.com" },
    { t: "txt", v: "." },
  ],
  [
    { t: "b", v: "Right to non-discrimination:" },
    { t: "txt", v: " We will not discriminate against you for exercising your privacy rights." },
  ],
];

export const S06_SUBHEAD_DNT = "Do Not Track";

export const S06_PARA2: Para = [
  {
    t: "txt",
    v: 'Some browsers include the ability to transmit "Do Not Track" (DNT) signals. Since uniform standards for DNT have not been adopted, our site does not currently respond to DNT signals.',
  },
];

// ─── Section 07: Age of Consent ───────────────────────────────────────────────

export const S07_PARA1: Para = [
  {
    t: "txt",
    v: "By using this site, you represent that you are at least 21 years old (or the age of majority in your jurisdiction, whichever is higher). Our products are not intended for minors. We do not knowingly collect personal information from anyone under 18. If we learn we have collected personal information from a minor, we will delete it promptly.",
  },
];

// ─── Section 08: Data Security ────────────────────────────────────────────────

export const S08_PARA1: Para = [
  {
    t: "txt",
    v: "We take reasonable precautions to protect your personal information using industry-standard security practices, including:",
  },
];

export const S08_BULLETS: string[] = [
  "SSL encryption for all data transmitted to and from our site",
  "AES-256 encryption for stored sensitive data",
  "PCI-DSS compliance for credit card information (managed by our payment processor, Authorize.net)",
  "Access controls limiting who within our organization can view personal information",
];

export const S08_PARA2: Para = [
  {
    t: "txt",
    v: "While we follow industry best practices, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security but commit to promptly notifying affected users in the event of a data breach involving their information.",
  },
];

// ─── Section 09: Changes to This Policy ──────────────────────────────────────

export const S09_PARA1: Para = [
  {
    t: "txt",
    v: 'We may update this Privacy Policy from time to time. When we make material changes, we will post the updated policy on this page with a revised "Effective" date. We encourage you to review this page periodically.',
  },
];

export const S09_PARA2: Para = [
  {
    t: "txt",
    v: "If our company is acquired or merged with another company, your information may be transferred to the new owner subject to this Privacy Policy or its successor.",
  },
];

// ─── Section 10: Contact Information ─────────────────────────────────────────

export const S10_PARA1: Para = [
  {
    t: "txt",
    v: "If you have any questions about these Terms of Service, please contact us using the information above.",
  },
];

export const PRIVACY_CONTACT_BLOCK: AddressBlockData = {
  label: "INNOVAPE CONCEPTS LLC",
  contacts: [
    { rowLabel: "Email", display: "order@getlitsaber.com", href: "mailto:order@getlitsaber.com" },
    { rowLabel: "Website", display: "getlitsaber.com", href: "/" },
  ],
  addressLabel: "Returns Address",
  recipient: "Litsaber c/o Premier Fulfillment West",
  attn: "Attn: Rudy Tinoco",
  line1: "19050 Messenia Ln, Building 8",
  line2: "Perris, CA 92571, USA",
};
