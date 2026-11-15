// The one place a Shopify checkout URL is turned into the href the shopper is
// sent to. Every checkout button (drawer, cart page, Buy Now) goes through
// here, so the affiliate discount code and the landing page's utm_* / fbclid
// parameters both travel across the domain change.

import { appendDiscountToCheckoutUrl } from "@/lib/hooks/useDiscount";
import { appendParamsToUrl, readLandingParams } from "@/lib/analytics/landingParams";

export function buildCheckoutHref(checkoutUrl: string): string {
  return appendParamsToUrl(appendDiscountToCheckoutUrl(checkoutUrl), readLandingParams());
}
