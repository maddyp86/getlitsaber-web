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

export { getSupabaseAdmin };