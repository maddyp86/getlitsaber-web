"use client";

import { getLinePrice, getDisplayUnitPrice, BASE_UNIT_PRICE } from "@/lib/cart/pricing";
import { offerForQty } from "@/lib/cart/offers";
import { useCartActions } from "@/lib/cart/store";
import { useCartUIActions } from "@/lib/ui/store";
import { useToastActions } from "@/lib/toast/store";
import { track, EVENTS, type AddSource } from "@/lib/analytics/events";
import { mediaUrl } from "@/lib/media";

interface UseAddToCartOptions {
  variantId: string;
  basePrice?: number;
  source: AddSource;
}

export const ADD_FAILED_MESSAGE = "Couldn't add to cart. Check your connection and try again.";

/**
 * Shared Silver add-to-cart used by every buy surface (PDP selector, homepage
 * strip, PDP sticky bar), so they all open the drawer and track identically.
 */
export function useAddToCart({ variantId, basePrice, source }: UseAddToCartOptions) {
  const { addItem } = useCartActions();
  const { openCart, closeCart } = useCartUIActions();
  const { addToast } = useToastActions();

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
      price: getDisplayUnitPrice(basePrice ?? BASE_UNIT_PRICE),
      image: mediaUrl("product/litsaber-packaging-1.jpg"),
    });
    openCart();
    void done.then((result) => {
      if (result.status === "added") {
        track(EVENTS.cart_add_to_cart, {
          variant: "silver",
          quantity: qty,
          tier_price: getLinePrice(qty, basePrice),
          unit_price: getDisplayUnitPrice(basePrice),
          offer: offerForQty(qty),
          source,
        });
      } else if (result.status === "failed") {
        // The store has already rolled the line back; close the drawer so the
        // shopper isn't left looking at a cart that didn't change.
        closeCart();
        addToast({ variant: "error", message: ADD_FAILED_MESSAGE });
        track(EVENTS.cart_add_failed, { variant: "silver", quantity: qty, source, reason: result.reason });
      }
    });
  };
}
