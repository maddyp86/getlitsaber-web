// SERVER ONLY — uses the service_role key which bypasses RLS. Never import into a Client Component.

import { createClient } from "@supabase/supabase-js";

export interface OrderRow {
  id: string;
  shopify_order_id: string;
  order_number: string;
  order_value: number;
  item_count: number;
  currency: string;
  distinct_id: string | null;
  has_promo_code: boolean;
  discount_code: string | null;
  discount_amount: number;
  email: string | null;
  customer_name: string | null;
  device_type: string | null;
  shipping_variant: string | null;
  shipping_amount: number;
  raw: Record<string, unknown> | null;
  created_at: string;
}

export type OrderInsert = Omit<OrderRow, "id" | "created_at">;

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) throw new Error("Missing env var: SUPABASE_URL");
  if (!key) throw new Error("Missing env var: SUPABASE_SERVICE_ROLE_KEY");

  return createClient(url, key, { auth: { persistSession: false } });
}

// Mirrors an order, and reports whether THIS call is the one that created the
// row. `ignoreDuplicates: true` compiles to `INSERT ... ON CONFLICT DO NOTHING`,
// so the `.select()` returns the inserted row on a first delivery and an empty
// set on a redelivery. Shopify guarantees at-least-once webhook delivery, so
// callers use `inserted` as the idempotency gate for any side effect that must
// happen exactly once per order (the PostHog purchase event). The unique index
// on shopify_order_id is what arbitrates — two genuinely concurrent deliveries
// race in Postgres, and exactly one of them wins.
export async function insertOrder(
  payload: OrderInsert
): Promise<{ inserted: boolean; error: { message: string } | null }> {
  const supabase = getSupabaseAdmin();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("orders")
    .upsert(payload, { onConflict: "shopify_order_id", ignoreDuplicates: true })
    .select("id");
  const rows = (data as Array<{ id: string }> | null) ?? [];
  return { inserted: rows.length > 0, error: error ?? null };
}

// Look up a mirrored order by its Shopify numeric id. Used by the refunds
// webhook to recover the stitched distinct_id + email (the refund payload
// carries neither). Returns null when the order is not mirrored or on error.
export async function getOrderByShopifyId(
  shopifyOrderId: string
): Promise<OrderRow | null> {
  const supabase = getSupabaseAdmin();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("orders")
    .select("*")
    .eq("shopify_order_id", shopifyOrderId)
    .maybeSingle();
  if (error) {
    console.error("[supabase] getOrderByShopifyId failed:", error.message);
    return null;
  }
  return (data as OrderRow | null) ?? null;
}

export { getSupabaseAdmin };
