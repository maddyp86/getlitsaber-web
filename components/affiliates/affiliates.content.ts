import { mediaUrl } from "@/lib/media";

// ─── GoAffPro portal ─────────────────────────────────────────────────────────
// The affiliate program runs on GoAffPro. This page is marketing only; every
// CTA hands off to the portal, which owns accounts, links, codes and payouts.
export const SIGNUP_URL = "https://affiliate-litsaber.goaffpro.com/create-account";
export const LOGIN_URL = "https://affiliate-litsaber.goaffpro.com/login";

// ─── Imagery ─────────────────────────────────────────────────────────────────
export const HERO_IMAGE_SRC = mediaUrl("affiliate/hero-shot-blue.jpg");
export const HERO_IMAGE_ALT =
  "A Litsaber glowing cyan, held out toward the camera in a dark room";

export const CONVERSATION_IMAGE_SRC = mediaUrl("affiliate/conversation-starter.jpg");
export const CONVERSATION_IMAGE_ALT =
  "A crowd at night with Litsabers raised and lit above the dance floor";

// Blob filename is spelled "fushcia" — matched verbatim, do not correct here.
export const TERMS_IMAGE_SRC = mediaUrl("affiliate/litsaber-hand-fushcia.jpg");
export const TERMS_IMAGE_ALT =
  "A Litsaber glowing fuchsia, held in one hand against a dark background";

// ─── Section 1 — Hero ────────────────────────────────────────────────────────
export const HERO_EYEBROW = "AFFILIATE";
export const HERO_HEADLINE_LINE1 = "Get paid to";
export const HERO_HEADLINE_ACCENT = "share the glow";
export const HERO_BODY =
  "Earn 20% on every sale you send. Grab your link in two minutes, post the way you already post, and watch commissions land in your dashboard.";
export const HERO_CTA_PRIMARY = "GET YOUR LINK";
export const HERO_CTA_SECONDARY = "ALREADY AN AFFILIATE? LOG IN";

export const HERO_TRUST_MARKERS = [
  "20% per sale",
  "30-day tracking",
  "Paid monthly",
  "No follower minimum",
] as const;

// ─── Section 2 — What you earn ───────────────────────────────────────────────
export const EARN_CARDS = [
  {
    value: "20%",
    unit: "/ sale",
    label: "COMMISSION",
    body: "On every order through your link or your personal code. No cap, no tiers to climb.",
  },
  {
    value: "30",
    unit: "days",
    label: "TRACKING WINDOW",
    body: "They click today, buy three weeks later, you still get paid.",
  },
  {
    value: "$50",
    unit: "bonus",
    label: "FAST START",
    body: "Make your first sale within 14 days and hit 5 sales in 30.",
  },
] as const;

// ─── Section 3 — Selling the Litsaber ────────────────────────────────────────
export const CONVERSATION_EYEBROW = "SELLING THE LITSABER";
export const CONVERSATION_HEADLINE = "A conversation starter piece";
export const CONVERSATION_BODY =
  "You don't have to sell anything. Pull it out at a show, a session, a back yard at 2am, and the questions start on their own. That's the post.";

// ─── Section 4 — Getting started ─────────────────────────────────────────────
export const KIT_EYEBROW = "GETTING STARTED";
export const KIT_HEADLINE = "Your sample pays for itself.";
export const KIT_BODY =
  "Order a Litsaber for $20 instead of $59.99 so you have one in hand to shoot with. The moment you make your first sale, that $20 comes back as credit on your first payout. Make a sale in your first 30 days and the kit is free.";
export const KIT_LINK_LABEL = "Get your link";

export const KIT_LADDER = [
  { num: "01", title: "Sign up", detail: "Sample ships for $20" },
  {
    num: "02",
    title: "First sale",
    detail: "$20 credited back · $50 bonus unlocked",
  },
  { num: "03", title: "5 sales in 30 days", detail: "$50 bonus pays out" },
  { num: "04", title: "Every sale after", detail: "Earn 20% commission forever" },
] as const;

// ─── Section 5 — Who this is for ─────────────────────────────────────────────
export const FIT_LABEL = "THIS IS YOU";
export const FIT_ITEMS = [
  "You post about nightlife, festivals, raves, or gear",
  "Your people trust what you recommend",
  "You'd rather earn on what you already post than chase brand deals",
  "You're 21 or older",
] as const;

export const NOFIT_LABEL = "WHAT THIS ISN'T";
// `link` renders inline after `text`. Null keeps the line as plain copy.
export const NOFIT_ITEMS = [
  {
    text: "You want to work events in person. That's a separate program, so ",
    link: { label: "get in touch", href: "/contact" },
  },
  { text: "You're looking for a salary or hourly work", link: null },
  {
    text: "You want to buy inventory and resell it. That's our ",
    link: { label: "wholesale program", href: "/wholesale" },
  },
] as const;

// ─── Section 6 — The terms ───────────────────────────────────────────────────
export const TERMS_EYEBROW = "THE TERMS";
export const TERMS_ROWS = [
  { key: "COMMISSION", value: "20% of every sale" },
  { key: "TRACKING WINDOW", value: "30 days from click" },
  { key: "PAYOUT SCHEDULE", value: "Monthly, by the 5th" },
  { key: "MINIMUM PAYOUT", value: "$25 · rolls forward if you're under" },
  { key: "WHEN IT CLEARS", value: "14 days after the order ships" },
  {
    key: "FAST START BONUS",
    value: "$50 · first sale in 14 days, 5 sales in 30",
  },
  { key: "SAMPLE KIT", value: "$20, refunded as credit on your first payout" },
  { key: "PAYMENT METHOD", value: "PayPal" },
] as const;

export const TERMS_FINE_PRINT =
  "Self-purchases and orders shipped to your own address don't count toward bonus milestones. All content must be directed at 21+ audiences and disclose the partnership per FTC guidelines. Full terms at signup.";

// ─── Section 7 — Quick answers ───────────────────────────────────────────────
export const FAQ_HEADLINE = "Quick Answers";
export const FAQ_ITEMS = [
  {
    question: "Do I need a certain number of followers?",
    answer:
      "No. We've had better results from creators with a few thousand engaged followers than from accounts ten times the size. If your people listen to you, you're a fit.",
  },
  {
    question: "What do I actually post?",
    answer:
      "Whatever fits your channel. The product does the work on camera, since it's a glowing accessory that people ask about. We send you b-roll, product shots, and hooks that have worked, but the best content is usually yours.",
  },
  {
    question: "Do you send free samples?",
    answer:
      "Not free, but close. You can order one at $20 instead of $59.99, plus shipping, so you've got one in hand to shoot with. Then the moment you make your first sale, that $20 comes back as credit on your first payout. Make a sale in your first 30 days and the sample effectively costs you nothing.",
  },
  {
    question: "How do I know I'll get credited?",
    answer:
      "Two ways. Your link sets a 30-day cookie, and your personal code works even if someone buys on a different device weeks later. Codes catch what cookies miss.",
  },
  {
    question: "When do I get paid?",
    answer:
      "Monthly, by the 5th, for everything that cleared the 14-day return window. $25 minimum, and anything under that rolls into the next month.",
  },
  {
    question: "Can I run paid ads to my link?",
    answer:
      "Not on our brand name, and not on coupon or deal sites. Organic posts, stories, and your own audience are all fair game.",
  },
  {
    question: "Is there a contract?",
    answer:
      "You agree to the program terms at signup. No exclusivity, no minimums, no commitment. Stop whenever you want.",
  },
] as const;

// ─── Section 8 — Final CTA ───────────────────────────────────────────────────
export const CTA_HEADLINE = "Two minutes to your link.";
export const CTA_BODY = "No application, no waiting. Sign up and start posting today.";
