// SERVER ONLY — Shopify refunds/create webhook receiver.
// Verifies HMAC signature, then fires a PostHog `rebate_refund_granted` event
// when the refund is a $5 rebate payout, so PostHog can report total rebates
// granted and their total value.
//
// Detecting a rebate refund: the refund is treated as a rebate payout when its
// note contains "rebate" (case-insensitive — the reliable, explicit signal ops
// should use) OR its amount equals REBATE_AMOUNT ($5.00, the fixed program
// payout). Add "rebate" to the Shopify refund note to be unambiguous; the
// amount fallback catches un-noted $5 refunds but will also match any unrelated
// exactly-$5 refund, so the note is preferred.

import { createHmac, timingSafeEqual } from "crypto";
import { PostHog } from "posthog-node";
import { getOrderByShopifyId } from "@/supabase/client";

export const dynamic = "force-dynamic";

// The fixed rebate payout. Kept in sync with the "$5 off" offer.
const REBATE_AMOUNT = 5;

interface ShopifyRefundTransaction {
  amount: string;
  kind: string;
  status: string;
  currency?: string;
}

interface ShopifyRefund {
  id: number;
  order_id: number;
  note: string | null;
  created_at?: string;
  transactions?: ShopifyRefundTransaction[];
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

// Sum refund transactions — the money returned to the customer. Include both
// "success" and "pending": Authorize.Net can report a refund as pending at
// refunds/create time (it settles later), and a pending rebate refund has still
// been granted, so it should count toward the value. Excludes failure/error.
function refundAmount(refund: ShopifyRefund): number {
  return (refund.transactions ?? [])
    .filter(
      (t) => t.kind === "refund" && (t.status === "success" || t.status === "pending")
    )
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
}

export async function POST(req: Request): Promise<Response> {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[webhook/refunds] SHOPIFY_WEBHOOK_SECRET is not set");
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
  let refund: ShopifyRefund;
  try {
    refund = JSON.parse(rawBody) as ShopifyRefund;
  } catch (err) {
    console.error("[webhook/refunds] Failed to parse refund JSON", err);
    // Return 200 so Shopify doesn't retry a malformed payload
    return new Response("Bad payload", { status: 200 });
  }

  const amount = refundAmount(refund);
  const noteHasRebate = (refund.note ?? "").toLowerCase().includes("rebate");
  const amountMatches = Math.abs(amount - REBATE_AMOUNT) < 0.001;
  const isRebateRefund = noteHasRebate || amountMatches;

  // Not a rebate payout — acknowledge and ignore (this topic fires on ALL refunds).
  if (!isRebateRefund) {
    return new Response(JSON.stringify({ received: true, rebate: false }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const orderId = String(refund.order_id);
  const matchedBy = noteHasRebate ? "note" : "amount";

  // Recover the stitched distinct_id + email/order number from the mirrored order.
  const order = await getOrderByShopifyId(orderId);
  const stitchedId = order?.distinct_id?.trim();
  const canStitch = !!stitchedId && !stitchedId.startsWith("order_") && !stitchedId.includes("@");
  const distinctId = canStitch ? (stitchedId as string) : "order_" + orderId;
  const email = (order?.email || "").trim().toLowerCase();
  const currency = refund.transactions?.[0]?.currency || order?.currency || "USD";

  const posthogToken = process.env.NEXT_PUBLIC_POSTHOG_TOKEN;
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

  if (posthogToken) {
    const posthog = new PostHog(posthogToken, { host: posthogHost });
    try {
      if (canStitch && email) {
        posthog.identify({ distinctId, properties: { email } });
      }
      posthog.capture({
        distinctId,
        event: "rebate_refund_granted",
        properties: {
          order_id: orderId,
          order_number: order?.order_number ?? null,
          refund_amount: amount,
          currency,
          matched_by: matchedBy,
          email: email || null,
          source: "rebate-page",
        },
      });
      // Flush before the serverless function freezes — unflushed events are lost
      await posthog.shutdown();
    } catch (err) {
      console.error("[webhook/refunds] PostHog capture failed:", err);
      // Continue — analytics failure must not surface as a non-200 to Shopify
    }
  } else {
    console.warn("[webhook/refunds] NEXT_PUBLIC_POSTHOG_TOKEN not set — skipping event");
  }

  return new Response(JSON.stringify({ received: true, rebate: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
