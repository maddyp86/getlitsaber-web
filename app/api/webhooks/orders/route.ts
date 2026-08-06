// SERVER ONLY — Shopify orders/create webhook receiver.
// Verifies HMAC signature, writes to Supabase, fires PostHog purchase event.

import { createHash, createHmac, timingSafeEqual } from "crypto";
import { PostHog } from "posthog-node";
import { insertOrder } from "@/supabase/client";

export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// Shopify payload types — only the fields we actually read
// ---------------------------------------------------------------------------

interface ShopifyLineItem {
  quantity: number;
}

interface ShopifyDiscountCode {
  code: string;
}

interface ShopifyOrder {
  id: number;
  name: string;
  created_at?: string;
  email: string | null;
  currency: string;
  total_price: string;
  total_discounts: string;
  current_subtotal_price: string;
  total_shipping_price_set?: { shop_money?: { amount?: string } };
  shipping_lines?: Array<{ price: string }>;
  line_items: ShopifyLineItem[];
  discount_codes: ShopifyDiscountCode[];
  note_attributes?: Array<{ name: string; value: string }>;
  customer?: { first_name: string | null; last_name: string | null } | null;
}

// ---------------------------------------------------------------------------
// Signature verification
// ---------------------------------------------------------------------------

// A stable, v5-shaped UUID derived from a seed string. Same seed always yields
// the same UUID, which lets a redelivered webhook produce a byte-identical
// PostHog event id. See the capture call for why that matters.
function deterministicUuid(seed: string): string {
  const h = createHash("sha1").update(seed).digest("hex");
  // Force version 5 and the RFC 4122 variant bits so the value is a valid UUID.
  const version = "5" + h.slice(13, 16);
  const variant = ((parseInt(h[16], 16) & 0x3) | 0x8).toString(16) + h.slice(17, 20);
  return [h.slice(0, 8), h.slice(8, 12), version, variant, h.slice(20, 32)].join("-");
}

// Parse a Shopify money string, distinguishing "absent or unparseable" (null)
// from a genuine zero. `parseFloat(x) || 0` conflates the two, which is how a
// missing subtotal turned into a negative contribution on the experiment metric.
function parseMoney(raw: string | null | undefined): number | null {
  if (raw === null || raw === undefined || String(raw).trim() === "") return null;
  const parsed = parseFloat(String(raw));
  return Number.isFinite(parsed) ? parsed : null;
}

function verifyShopifyHmac(rawBody: string, headerHmac: string, secret: string): boolean {
  const computed = createHmac("sha256", secret).update(rawBody, "utf8").digest("base64");
  try {
    return timingSafeEqual(Buffer.from(computed), Buffer.from(headerHmac));
  } catch {
    // buffers differ in length — definitely not equal
    return false;
  }
}

// ---------------------------------------------------------------------------
// POST /api/webhooks/orders
// ---------------------------------------------------------------------------

export async function POST(req: Request): Promise<Response> {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[webhook/orders] SHOPIFY_WEBHOOK_SECRET is not set");
    return new Response("Server misconfiguration", { status: 500 });
  }

  // 1. Read raw body BEFORE any parsing — HMAC is computed over the exact bytes
  const rawBody = await req.text();

  // 2. Verify signature
  const headerHmac = req.headers.get("x-shopify-hmac-sha256") ?? "";
  if (!verifyShopifyHmac(rawBody, headerHmac, secret)) {
    return new Response("Unauthorized", { status: 401 });
  }

  // 3. Parse only after verification passes. Parsed once and reused for both
  // the field reads and the `raw` column — the payload is large enough that a
  // second parse is wasted time on a path Shopify only allows 5 seconds.
  let raw: Record<string, unknown>;
  try {
    raw = JSON.parse(rawBody) as Record<string, unknown>;
  } catch (err) {
    console.error("[webhook/orders] Failed to parse order JSON", err);
    // Return 200 so Shopify doesn't retry a malformed payload
    return new Response("Bad payload", { status: 200 });
  }
  const order = raw as unknown as ShopifyOrder;

  const orderId = String(order.id);
  const orderValue = parseFloat(order.total_price) || 0;
  const discountAmount = parseFloat(order.total_discounts) || 0;
  const itemCount = order.line_items.reduce((sum, li) => sum + li.quantity, 0);
  const hasPromoCode = order.discount_codes.length > 0;
  const discountCode = order.discount_codes[0]?.code ?? null;

  // distinct_id: use the PostHog visitor id stitched through checkout via cart attributes.
  // Falls back to 'order_<id>' when the attribute is absent (e.g. direct API orders).
  const stitchedId = order.note_attributes
    ?.find((a) => a.name === "posthog_distinct_id")
    ?.value?.trim();
  const distinctId = stitchedId || "order_" + orderId;
  if (!stitchedId) {
    console.warn("[webhook/orders] no posthog_distinct_id on order, using fallback", orderId);
  }

  const email = (order.email || "").trim().toLowerCase();
  const canIdentify =
    !!stitchedId &&
    !stitchedId.startsWith("order_") &&
    !stitchedId.includes("@") &&
    !!email;

  const deviceType =
    order.note_attributes?.find((a) => a.name === "device_type")?.value?.trim() || "unknown";
  const channelType =
    order.note_attributes?.find((a) => a.name === "channel_type")?.value?.trim() || "unknown";
  const utmSource =
    order.note_attributes?.find((a) => a.name === "utm_source")?.value?.trim() || "";
  const utmMedium =
    order.note_attributes?.find((a) => a.name === "utm_medium")?.value?.trim() || "";
  const utmCampaign =
    order.note_attributes?.find((a) => a.name === "utm_campaign")?.value?.trim() || "";
  const referrer =
    order.note_attributes?.find((a) => a.name === "referrer")?.value?.trim() || "";

  // Shipping surcharge A/B — product revenue after discounts, before shipping/tax.
  // Nullable on purpose: an absent field must not collapse to 0, or the
  // contribution below silently becomes "costs with no revenue" and subtracts a
  // fabricated loss from the experiment's primary metric.
  const subtotal = parseMoney(order.current_subtotal_price);
  // Shopify charges shipping (0 or 5.99). Prefer the money set; fall back to summing lines.
  // Absent genuinely means nothing was charged here, so 0 is the right default.
  const shippingAmount =
    parseFloat(order.total_shipping_price_set?.shop_money?.amount ?? "") ||
    (order.shipping_lines ?? []).reduce((sum, l) => sum + (parseFloat(l.price) || 0), 0);
  // Arm label, frozen onto the cart client-side. Same read path as channel_type.
  const shippingVariant =
    order.note_attributes?.find((a) => a.name === "_shipping_variant")?.value?.trim() || "unknown";
  // Only a real arm counts. "unknown" (cart predates the stamp) and "unresolved"
  // (flags had not loaded) are both non-answers and must not be filed as control.
  const assignedArm =
    shippingVariant === "control" || shippingVariant === "surcharge" ? shippingVariant : null;

  // Contribution per order — the shipping-surcharge experiment's true success
  // metric, baked onto the event so PostHog can test it natively (metrics can
  // only aggregate a single property). Product margin + shipping collected,
  // minus product cost and one postage per shipment. COGS is landed unit cost;
  // POSTAGE is the $6 to $9 average. Both are constants, applied consistently
  // across arms; revisit if either cost moves.
  // Null when subtotal is unknown: no number is far better than a negative one,
  // which PostHog would happily sum into the arm.
  const COGS_PER_UNIT = 13.33;
  const POSTAGE_PER_ORDER = 7.5;
  const contribution =
    subtotal === null
      ? null
      : subtotal - COGS_PER_UNIT * itemCount + shippingAmount - POSTAGE_PER_ORDER;
  if (subtotal === null) {
    console.warn("[webhook/orders] no current_subtotal_price, omitting contribution", orderId);
  }

  // customer_name: join non-empty name parts; null if both absent.
  const nameParts = [order.customer?.first_name, order.customer?.last_name]
    .filter((p): p is string => Boolean(p?.trim()));
  const customerName = nameParts.length > 0 ? nameParts.join(" ") : null;

  // 4. Write to Supabase — upsert so duplicate deliveries are a no-op.
  // `inserted` is true only on the delivery that actually created the row; it
  // is the idempotency gate for the PostHog event below.
  const { inserted, error: dbError } = await insertOrder({
    shopify_order_id: orderId,
    order_number: order.name,
    order_value: orderValue,
    item_count: itemCount,
    currency: order.currency,
    distinct_id: distinctId,
    has_promo_code: hasPromoCode,
    discount_code: discountCode,
    discount_amount: discountAmount,
    email: order.email ?? null,
    customer_name: customerName,
    device_type: deviceType === "unknown" ? null : deviceType,
    shipping_variant: assignedArm,
    shipping_amount: shippingAmount,
    raw,
  });

  if (dbError) {
    console.error("[webhook/orders] Supabase insert failed:", dbError.message);
    // Continue — Supabase hiccup must not cause Shopify to retry-storm
  }

  // 5. Fire PostHog server-side purchase event.
  //
  // Shopify delivers webhooks AT LEAST ONCE: a delivery that doesn't get a 2xx
  // within Shopify's 5-second budget is retried, even when the handler in fact
  // ran to completion. Order #1040 landed three times that way and was counted
  // three times in revenue and in the shipping-surcharge experiment.
  //
  // Two independent guards, because either one alone has a hole:
  //   a) Skip the capture when the Supabase insert was a no-op — a redelivery.
  //      Skipped when the DB itself errored, since we can't tell a duplicate
  //      from an outage and a lost purchase is worse than a duplicate one.
  //   b) Pin the event uuid and timestamp to values derived from the order, so
  //      any capture that does slip through guard (a) carries an identical
  //      dedupe key and PostHog collapses it into the first one.
  const posthogToken = process.env.NEXT_PUBLIC_POSTHOG_TOKEN;
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

  const alreadyCaptured = !inserted && !dbError;
  if (alreadyCaptured) {
    console.info("[webhook/orders] duplicate delivery, skipping PostHog capture", orderId);
  }

  if (posthogToken && !alreadyCaptured) {
    const posthog = new PostHog(posthogToken, { host: posthogHost });
    try {
      if (canIdentify) {
        posthog.identify({ distinctId: stitchedId, properties: { email } });
      }
      posthog.capture({
        distinctId,
        event: "purchase",
        // Both derived from the order, never from the delivery — a retry must
        // reproduce them exactly for PostHog's dedupe to bite.
        uuid: deterministicUuid("purchase:" + orderId),
        timestamp: order.created_at ? new Date(order.created_at) : undefined,
        properties: {
          order_id: orderId,
          order_number: order.name,
          order_value: orderValue,
          item_count: itemCount,
          currency: order.currency,
          has_promo_code: hasPromoCode,
          discount_code: discountCode,
          discount_amount: discountAmount,
          device_type: deviceType,
          channel_type: channelType,
          subtotal: subtotal,
          shipping_amount: shippingAmount,
          shipping_variant: shippingVariant,
          contribution: contribution,
          // Stamp the arm the shopper actually checked out under. The exposure
          // event is captured client-side under whichever distinct_id was
          // current at the time, so a purchase that arrives from the server has
          // no arm of its own to be grouped by. Carrying it on the event makes
          // the result analysable directly from the purchase, independent of how
          // the exposure was recorded. Omitted entirely when the arm is unknown,
          // so an unbucketed order is absent rather than miscounted.
          ...(assignedArm
            ? { "$feature/single-unit-shipping-surcharge": assignedArm }
            : {}),
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
          referrer: referrer,
        },
      });
      // Flush before the serverless function freezes — unflushed events are lost
      await posthog.shutdown();
    } catch (err) {
      // Continue — analytics failure must not surface as a non-200 to Shopify.
      // Note the trade-off in guard (a): the Supabase row already exists, so a
      // Shopify retry will now skip this capture and the event is lost. Logged
      // with the order id because the full payload is in orders.raw and the
      // event can be replayed from there.
      console.error("[webhook/orders] PostHog capture failed, order needs replay:", orderId, err);
    }
  } else if (!posthogToken) {
    console.warn("[webhook/orders] NEXT_PUBLIC_POSTHOG_TOKEN not set — skipping PostHog event");
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}