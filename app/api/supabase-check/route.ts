// DEV ONLY — remove after Supabase client verification. DO NOT commit to main.
// Inserts one TEST- row into orders and reads it back to confirm the client,
// service-role key, and table all resolve correctly.
// The inserted row will remain in the database; delete it manually from Supabase.

import { NextResponse } from "next/server";
import { insertOrder, getSupabaseAdmin } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const testOrderId = `TEST-${Date.now()}`;

    // Insert via the type-checked helper
    const { error: insertError } = await insertOrder({
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
    });

    if (insertError) {
      return NextResponse.json({ ok: false, stage: "insert", error: insertError.message }, { status: 500 });
    }

    // Read it back to confirm round-trip
    const supabase = getSupabaseAdmin();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error: selectError } = await (supabase as any)
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
