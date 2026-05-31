// DEV ONLY — remove after Supabase client verification. DO NOT commit to main.
// Inserts one TEST- row into orders and reads it back to confirm the client,
// service-role key, and table all resolve correctly.
// The inserted row will remain in the database; delete it manually from Supabase.

import { NextResponse } from "next/server";
import { getSupabaseAdmin, type OrderInsert } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const testOrderId = `TEST-${Date.now()}`;

    // Insert a clearly-prefixed dummy row
    const payload: OrderInsert = {
      shopify_order_id: testOrderId,
      order_number: "TEST-0000",
      order_value: 0,
      item_count: 0,
      currency: "USD",
      distinct_id: null,
      has_promo_code: false,
      discount_code: null,
      discount_amount: 0,
      email: null,
      raw: null,
    };
    const { error: insertError } = await supabase.from("orders").insert(payload as never);

    if (insertError) {
      return NextResponse.json({ ok: false, stage: "insert", error: insertError.message }, { status: 500 });
    }

    // Read it back to confirm round-trip
    const { data, error: selectError } = await supabase
      .from("orders")
      .select("*")
      .eq("shopify_order_id", testOrderId)
      .maybeSingle();

    if (selectError) {
      return NextResponse.json({ ok: false, stage: "select", error: selectError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, row: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, stage: "init", error: message }, { status: 500 });
  }
}
