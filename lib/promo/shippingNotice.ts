// TEMP — warehouse transition (week of 2026-07-20).
//
// Inventory is moving from the old warehouse to the new one. Orders placed this
// week still process; they ship once fulfillment resumes on Monday 2026-07-27.
// This module is the single source of truth for that messaging so the date lives
// in one place.
//
// ROLLBACK: once the backlog has shipped, delete this file and its imports in
// ShippingBanner, BundleAndCTA, CartDrawer, and CartPageBody, plus the
// `--promo-h` default in globals.css and the `<ShippingBanner />` mount +
// `--promo-h` bindings in SiteChrome/Navbar. Grep "warehouse" / "promo-h".

/** When fulfillment resumes. Update this one constant if the date moves. */
export const SHIP_RESUME_LABEL = "Monday, July 27";

/** Lead clause for the site-wide banner (always shown). */
export const SHIPPING_NOTICE_LEAD = `Orders placed this week ship ${SHIP_RESUME_LABEL}.`;

/** Context clause for the banner, hidden on very small screens. */
export const SHIPPING_NOTICE_CONTEXT =
  "Thanks for your patience while we move to our new warehouse.";

/** Compact one-line notice for PDP and cart surfaces. */
export const SHIPPING_NOTICE_COMPACT = `Orders placed this week ship ${SHIP_RESUME_LABEL} while we move to our new warehouse.`;
