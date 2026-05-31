// SERVER ONLY — uses the service_role key which bypasses RLS. Never import into a Client Component.

import { createClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// OrderRow — typed to match the existing `orders` table (do not create/migrate)
// ---------------------------------------------------------------------------

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
  raw: Record<string, unknown> | null;
  created_at: string;
}

export type OrderInsert = Omit<OrderRow, "id" | "created_at">;

// ---------------------------------------------------------------------------
// getSupabaseAdmin — factory so the env-var guard runs at call time, not at
// module import, which surfaces missing-var errors clearly in server logs.
//
// Note: the Database generic doesn't resolve through supabase-js's internal
// type machinery in v2.106.2, so .from("orders").insert() is untyped. Callers
// must use insertOrder() below — it is the single type-checked insert path.
// ---------------------------------------------------------------------------

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) throw new Error("Missing env var: SUPABASE_URL");
  if (!key) throw new Error("Missing env var: SUPABASE_SERVICE_ROLE_KEY");

  return createClient(url, key, { auth: { persistSession: false } });
}

// ---------------------------------------------------------------------------
// insertOrder — type-checked upsert on shopify_order_id.
// Duplicate Shopify webhook deliveries are silently ignored (ignoreDuplicates).
// Returns the Supabase error (or null on success).
// ---------------------------------------------------------------------------

export async function insertOrder(
  payload: OrderInsert
): Promise<{ error: { message: string } | null }> {
  const supabase = getSupabaseAdmin();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("orders")
    .upsert(payload, { onConflict: "shopify_order_id", ignoreDuplicates: true });
  return { error: error ?? null };
}

// Expose the raw client for SELECT queries (reads are structurally safe without
// the Insert type constraint). Do not use for inserts — use insertOrder().
export { getSupabaseAdmin };