export const WAITLIST_SOURCES = {
  pdpGold:           "pdp-gold-waitlist",
  pdpSoldOut:        "pdp-sold-out",
  editionsGold:      "editions-gold-modal",
  editionsFuture:    "editions-futuredrops-modal",
  cartSignup:        "cart-signup",
  footerSignup:      "footer-signup",
  activateDroplist:  "activate-festival-droplist",
} as const;

export type WaitlistSource = typeof WAITLIST_SOURCES[keyof typeof WAITLIST_SOURCES];
