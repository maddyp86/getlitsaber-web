// The two merchandised PDP offers plus the plain quantity path, as data the
// offer UI renders and the analytics layer names. Pure: no React, no browser
// globals, so the orders webhook can derive the same offer id server-side.

import { getLinePrice, getMsrpLinePrice, clampQty, BASE_UNIT_PRICE } from "./pricing";
import { getDisplayShipping } from "@/lib/shipping";

/** Analytics name for what the shopper picked. Derived from quantity alone. */
export type OfferId = "single" | "two_pack" | "custom_qty";

/** 1 unit is the single, 2 is the two-pack, anything else came from the stepper. */
export function offerForQty(qty: number): OfferId {
  if (qty === 1) return "single";
  if (qty === 2) return "two_pack";
  return "custom_qty";
}

export interface OfferQuote {
  id: OfferId;
  qty: number;
  /** What the shopper pays for the units, before shipping. */
  price: number;
  /** MSRP x qty, rendered struck through and labeled "MSRP". */
  msrp: number;
  /** 0 means free. */
  shipping: number;
}

export function quoteOffer(qty: number, base: number = BASE_UNIT_PRICE): OfferQuote {
  const q = clampQty(qty);
  return {
    id: offerForQty(q),
    qty: q,
    price: getLinePrice(q, base),
    msrp: getMsrpLinePrice(q),
    // q is always >= 1 here, so this is never null.
    shipping: getDisplayShipping(q) ?? 0,
  };
}

/** Show the MSRP anchor only when it is actually higher than the price. */
export function showsMsrpAnchor(quote: OfferQuote): boolean {
  return quote.msrp > quote.price;
}
