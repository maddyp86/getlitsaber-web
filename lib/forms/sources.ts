export const WAITLIST_SOURCES = {
  pdpGold:        "pdp-gold-waitlist",
  pdpSoldOut:     "pdp-sold-out",
  editionsGold:   "editions-gold-modal",
  editionsFuture: "editions-futuredrops-modal",
  promoPopup:     "floating-promo-$10",
  cartSignup:     "cart-signup",
  footerSignup:   "footer-signup",
} as const;

export type WaitlistSource = typeof WAITLIST_SOURCES[keyof typeof WAITLIST_SOURCES];
