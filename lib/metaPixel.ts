// Meta Pixel ("Litsaber OG" pixel) helpers. The pixel itself loads once,
// site-wide, from components/analytics/MetaPixel.tsx, and only when
// NEXT_PUBLIC_META_PIXEL_ID is set. Every helper here:
//
//  - is safe during SSR and before fbevents.js has run: with no window.fbq it
//    does nothing and returns null;
//  - sends an eventID (UUID) with the event, so the same event can later be
//    sent server-side through the Conversions API and deduplicated.
//
// Purchase is NOT fired from the storefront. Shopify's Facebook & Instagram
// app sends it from the hosted checkout.
//
// PostHog is untouched by this module; it is a separate, parallel tracker.

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";

/** True when a pixel id is configured and well-formed (digits only). */
export function isMetaPixelEnabled(pixelId: string = META_PIXEL_ID): boolean {
  return /^\d+$/.test(pixelId);
}

export const META_CURRENCY = "USD";

type FbqParams = Record<string, unknown>;

export interface Fbq {
  (command: "init", pixelId: string): void;
  (command: "track", event: string, params?: FbqParams, options?: { eventID: string }): void;
  (command: "trackSingle", pixelId: string, event: string, params?: FbqParams, options?: { eventID: string }): void;
}

declare global {
  interface Window {
    fbq?: Fbq;
  }
}

export type MetaEventName = "PageView" | "ViewContent" | "AddToCart" | "InitiateCheckout";

// ---------------------------------------------------------------------------
// Readiness. fbevents.js is injected after hydration (next/script,
// afterInteractive), so an effect that runs during hydration (the first
// PageView, ViewContent on the product page) may run before window.fbq
// exists. Those callers queue through whenMetaPixelReady(); the loader
// component calls markMetaPixelReady() once the snippet has run. With no pixel
// configured the queue is simply never flushed (capped, so it cannot grow).
// Same pattern as lib/analytics/posthogClient.ts.
// ---------------------------------------------------------------------------

let ready = false;
let waiting: Array<() => void> = [];

export function markMetaPixelReady(): void {
  ready = true;
  const queued = waiting;
  waiting = [];
  queued.forEach((cb) => cb());
}

/** Runs `cb` now if the pixel snippet has run, otherwise once it has. */
export function whenMetaPixelReady(cb: () => void): void {
  if (ready) cb();
  else if (waiting.length < 50) waiting.push(cb);
}

/** Test-only: forget readiness and queued callbacks. */
export function resetMetaPixelForTests(): void {
  ready = false;
  waiting = [];
}

// ---------------------------------------------------------------------------
// Event ids and content ids
// ---------------------------------------------------------------------------

/** A UUID for eventID. crypto.randomUUID needs a secure context; fall back otherwise. */
export function newEventId(): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === "function") return c.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (ch) => {
    const r = (Math.random() * 16) | 0;
    const v = ch === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * The id Meta sees for a product: the numeric Shopify variant id, taken from
 * the variant GID ("gid://shopify/ProductVariant/123" -> "123"). A value that
 * is not a GID (a SKU, say) is passed through unchanged. One place to change
 * if the Meta catalog turns out to key items differently.
 */
export function contentIdFor(variantId: string): string {
  const tail = variantId.split("/").pop();
  return tail || variantId;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

// ---------------------------------------------------------------------------
// Sending
// ---------------------------------------------------------------------------

/**
 * Sends one standard event with a fresh eventID. Returns the eventID, or null
 * when nothing was sent (server render, pixel not loaded, or fbq threw).
 * `single` sends through trackSingle (addressed to our pixel id) instead of
 * track; see pageView() for why.
 */
export function sendMetaEvent(
  event: MetaEventName,
  params: FbqParams = {},
  { single = false }: { single?: boolean } = {}
): string | null {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return null;
  const eventID = newEventId();
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";
  try {
    if (single && pixelId) window.fbq("trackSingle", pixelId, event, params, { eventID });
    else window.fbq("track", event, params, { eventID });
  } catch {
    return null;
  }
  return eventID;
}

/**
 * One PageView. fbevents.js sends a `track PageView` once per document and
 * silently drops every later one, so a client-side route change would never
 * reach Meta that way (verified 2026-11-15 over the DevTools protocol). Its
 * own history-change PageView is turned off in the base code (it carries no
 * eventID), and trackSingle, which the library does not deduplicate, carries
 * ours on every navigation.
 */
export function pageView(): string | null {
  return sendMetaEvent("PageView", {}, { single: true });
}

export interface ViewContentParams {
  /** Shopify variant GID (or SKU). */
  variantId: string;
  /** Unit price in dollars, the live floor-guarded Shopify price. */
  value: number;
}

export function viewContent({ variantId, value }: ViewContentParams): string | null {
  return sendMetaEvent("ViewContent", {
    content_ids: [contentIdFor(variantId)],
    content_type: "product",
    value: round2(value),
    currency: META_CURRENCY,
  });
}

export interface AddToCartParams {
  variantId: string;
  /** Units added by this action. */
  quantity: number;
  /** Dollars for exactly those units: line unit price x quantity. */
  value: number;
}

export function addToCart({ variantId, quantity, value }: AddToCartParams): string | null {
  const id = contentIdFor(variantId);
  return sendMetaEvent("AddToCart", {
    content_ids: [id],
    content_type: "product",
    contents: [{ id, quantity }],
    value: round2(value),
    currency: META_CURRENCY,
  });
}

export interface CheckoutLine {
  variantId: string;
  quantity: number;
}

export interface InitiateCheckoutParams {
  lines: CheckoutLine[];
  /** Cart subtotal in dollars (before shipping). */
  value: number;
}

export function initiateCheckout({ lines, value }: InitiateCheckoutParams): string | null {
  return sendMetaEvent("InitiateCheckout", {
    content_ids: lines.map((l) => contentIdFor(l.variantId)),
    content_type: "product",
    contents: lines.map((l) => ({ id: contentIdFor(l.variantId), quantity: l.quantity })),
    num_items: lines.reduce((acc, l) => acc + l.quantity, 0),
    value: round2(value),
    currency: META_CURRENCY,
  });
}
