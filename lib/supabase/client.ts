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

// Matches the shape produced by supabase-js codegen (Tables + Views + Functions + Enums).
// All tables other than `orders` are omitted — add them as needed.
interface Database {
  public: {
    Tables: {
      orders: {
        Row: OrderRow;
        Insert: OrderInsert;
        Update: Partial<OrderInsert>;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// ---------------------------------------------------------------------------
// getSupabaseAdmin — factory so the env-var guard runs at call time, not at
// module import, which surfaces missing-var errors clearly in server logs.
// ---------------------------------------------------------------------------

export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) throw new Error("Missing env var: SUPABASE_URL");
  if (!key) throw new Error("Missing env var: SUPABASE_SERVICE_ROLE_KEY");

  return createClient<Database>(url, key, {
    auth: { persistSession: false },
  });
}
