import { mediaUrl } from "@/lib/media";

// ─── Hero image ──────────────────────────────────────────────────────────────
// Figma layer "raves_where_it_lives" — reuses the home rave lifestyle asset.
export const HERO_IMAGE_SRC = mediaUrl("home/rave.jpg");
export const HERO_IMAGE_ALT = "Litsaber lit up in the crowd at a rave";

// ─── HubSpot ─────────────────────────────────────────────────────────────────
// Rebate form (portal 244547358, region na2). Created 2026-07-17.
export const HS_PORTAL_ID = "244547358";
export const HS_REBATE_FORM_ID = "44b281f3-f679-4531-967b-9d9a70062d08";

// ─── Section 1 — Hero ────────────────────────────────────────────────────────
export const HERO_EYEBROW = "REBATE OFFER";
export const HERO_HEADLINE_PART1 = "Show it off.";
export const HERO_HEADLINE_ACCENT = "Get $5 off.";
export const HERO_BODY =
  "Your Litsaber already turns heads in person. Catch it lit on camera, put it up, and we'll send $5 back to you. One quick form, that's it.";
export const HERO_CTA = "SUBMIT YOUR POST";

// ─── Section 2a — How it works ───────────────────────────────────────────────
export const STEPS_HEADLINE = "How it works";

// Body copy uses **markers** for bold emphasis (rendered in HowItWorks).
export const STEPS = [
  {
    num: "/01",
    title: "CREATE CONTENT",
    body: "**Post yourself with your Litsaber** lit up on TikTok or Instagram. Video of the glow hits hardest, but a photo works. **Keep it public.**",
    highlight: false,
  },
  {
    num: "/02",
    title: "MAKE A POST",
    body: "Add **#Litsaber** to your caption and tag us so we can find it. Use **@getlitsaber** on TikTok, **@get.litsaber** on Instagram.",
    highlight: false,
  },
  {
    num: "/03",
    title: "SUBMIT FORM",
    body: "**Fill out the form** with your **order number** (so we know it's you) and your post link (so we can find it). Takes about a minute.",
    highlight: false,
  },
  {
    num: "/04",
    title: "$ GET REBATE",
    body: "Once we confirm the post, we'll **refund $5** to your original payment method, usually **within 3 to 5 business days**. That's all there is to it.",
    highlight: true,
  },
] as const;

// ─── Section 2b — Claim form ─────────────────────────────────────────────────
export const FORM_CARD_TITLE = "CLAIM YOUR $5";

export const PLATFORM_OPTIONS = ["TikTok", "Instagram"] as const;

// ─── Section 3 — Quick Answers (FAQ) ─────────────────────────────────────────
export const FAQ_HEADLINE_PART1 = "Quick";
export const FAQ_HEADLINE_ACCENT = "Answers";

export const FAQ_ITEMS = [
  {
    question: "When do I get my $5?",
    answer:
      "After we confirm your post, we refund $5 to your original payment method, usually within 3 to 5 business days.",
  },
  {
    question: "What kind of post counts?",
    answer:
      "Any public photo or video with your Litsaber in it, tagged @getlitsaber and #Litsaber. Video of it lit performs best, but it's not required.",
  },
  {
    question: "Where's my order number?",
    answer:
      "It's in your order confirmation email, next to the #. If you can't find it, reply to that email and we'll help.",
  },
  {
    question: "Can I submit more than once?",
    answer:
      "The $5 rebate is one per customer. But keep posting anyway, we'll reshare our favorites.",
  },
] as const;
