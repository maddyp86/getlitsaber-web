// SERVER ONLY — Shopify orders/create webhook receiver.
// Verifies HMAC signature, writes to Supabase, fires PostHog purchase event.

import { createHmac, timingSafeEqual } from "crypto";
import { PostHog } from "posthog-node";
import { insertOrder } from "@/lib/supabase/client";

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
  email: string | null;
  currency: string;
  total_price: string;
  total_discounts: string;
  line_items: ShopifyLineItem[];
  discount_codes: ShopifyDiscountCode[];
  note_attributes?: Array<{ name: string; value: string }>;
  customer?: { first_name: string | null; last_name: string | null } | null;
}

// ---------------------------------------------------------------------------
// Signature verification
// ---------------------------------------------------------------------------

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

  // 3. Parse only after verification passes
  let order: ShopifyOrder;
  try {
    order = JSON.parse(rawBody) as ShopifyOrder;
  } catch (err) {
    console.error("[webhook/orders] Failed to parse order JSON", err);
    // Return 200 so Shopify doesn't retry a malformed payload
    return new Response("Bad payload", { status: 200 });
  }

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

  // customer_name: join non-empty name parts; null if both absent.
  const nameParts = [order.customer?.first_name, order.customer?.last_name]
    .filter((p): p is string => Boolean(p?.trim()));
  const customerName = nameParts.length > 0 ? nameParts.join(" ") : null;

  // 4. Write to Supabase — upsert so duplicate deliveries are a no-op
  const { error: dbError } = await insertOrder({
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
    raw: JSON.parse(rawBody) as Record<string, unknown>,
  });

  if (dbError) {
    console.error("[webhook/orders] Supabase insert failed:", dbError.message);
    // Continue — Supabase hiccup must not cause Shopify to retry-storm
  }

  // 5. Fire PostHog server-side purchase event
  const posthogToken = process.env.NEXT_PUBLIC_POSTHOG_TOKEN;
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

  if (posthogToken) {
    const posthog = new PostHog(posthogToken, { host: posthogHost });
    try {
      if (canIdentify) {
        posthog.identify({ distinctId: stitchedId, properties: { email } });
      }
      posthog.capture({
        distinctId,
        event: "purchase",
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
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
          referrer: referrer,
        },
      });
      // Flush before the serverless function freezes — unflushed events are lost
      await posthog.shutdown();
    } catch (err) {
      console.error("[webhook/orders] PostHog capture failed:", err);
      // Continue — analytics failure must not surface as a non-200 to Shopify
    }
  } else {
    console.warn("[webhook/orders] NEXT_PUBLIC_POSTHOG_TOKEN not set — skipping PostHog event");
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}