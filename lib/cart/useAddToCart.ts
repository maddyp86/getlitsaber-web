"use client";

import { getTierPrice, getTierUnitPrice, BASE_UNIT_PRICE } from "@/lib/cart/pricing";
import { useCartActions } from "@/lib/cart/store";
import { useCartUIActions } from "@/lib/ui/store";
import { track, EVENTS, type AddSource } from "@/lib/analytics/events";
import { mediaUrl } from "@/lib/media";

interface UseAddToCartOptions {
  variantId: string;
  basePrice?: number;
  source: AddSource;
}

/**
 * Shared Silver add-to-cart used by every buy surface (PDP selector, homepage
 * strip, PDP sticky bar), so they all open the drawer and track identically.
 */
export function useAddToCart({ variantId, basePrice, source }: UseAddToCartOptions) {
  const { addItem } = useCartActions();
  const { openCart } = useCartUIActions();

  return function addToCart(qty: number) {
    // Open the drawer synchronously so the tap has an instant, visible response.
    // addItem applies its optimistic update synchronously (before it awaits the
    // Shopify mutation), so the drawer shows the added line immediately. Awaiting
    // the network before opening left the primary CTA visually frozen for the
    // length of the round-trip — poor feedback, and on a slow connection long
    // enough that the working click was flagged as a dead click.
    const done = addItem({
      variantId,
      qty,
      title: "Litsaber OG — Silver",
      variantTitle: "Silver",
      price: basePrice ?? BASE_UNIT_PRICE,
      image: mediaUrl("product/litsaber-lights-off.jpg"),
    });
    openCart();
    void done.then(() => {
      track(EVENTS.cart_add_to_cart, {
        variant: "silver",
        quantity: qty,
        tier_price: getTierPrice(qty, basePrice),
        unit_price: getTierUnitPrice(qty, basePrice),
        source,
      });
    });
  };
}
