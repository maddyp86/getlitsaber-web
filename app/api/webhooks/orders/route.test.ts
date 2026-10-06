// @vitest-environment node
import { createHmac } from "crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";

const captures: Array<Record<string, unknown>> = [];
const identifies: unknown[] = [];
vi.mock("posthog-node", () => ({
  PostHog: class {
    capture(e: Record<string, unknown>) { captures.push(e); }
    identify(e: unknown) { identifies.push(e); }
    async shutdown() {}
  },
}));

// Supabase mirror: the first delivery of an order inserts, a redelivery does not.
const seen = new Set<string>();
vi.mock("@/supabase/client", () => ({
  insertOrder: async (row: { shopify_order_id: string }) => {
    const inserted = !seen.has(row.shopify_order_id);
    seen.add(row.shopify_order_id);
    return { inserted, error: null };
  },
}));

import { POST } from "./route";

const SECRET = "test-secret";

function order(overrides: Record<string, unknown> = {}) {
  return {
    id: 9001,
    name: "#9001",
    created_at: "2026-10-06T12:00:00Z",
    email: "shopper@example.com",
    financial_status: "paid",
    test: false,
    currency: "USD",
    total_price: "45.98",
    total_discounts: "0.00",
    current_subtotal_price: "39.99",
    total_shipping_price_set: { shop_money: { amount: "5.99" } },
    line_items: [{ quantity: 1 }],
    discount_codes: [],
    customer: { first_name: "Sam", last_name: "Shopper", tags: "" },
    note_attributes: [
      { name: "posthog_distinct_id", value: "019f0000-aaaa-7bbb-8ccc-000000000001" },
      { name: "channel_type", value: "Organic Social" },
      { name: "_shipping_variant", value: "surcharge" },
    ],
    ...overrides,
  };
}

async function deliver(body: unknown) {
  const raw = JSON.stringify(body);
  const hmac = createHmac("sha256", SECRET).update(raw, "utf8").digest("base64");
  return POST(new Request("http://x/api/webhooks/orders", { method: "POST", body: raw, headers: { "x-shopify-hmac-sha256": hmac } }));
}

beforeEach(() => {
  captures.length = 0;
  identifies.length = 0;
  seen.clear();
  process.env.SHOPIFY_WEBHOOK_SECRET = SECRET;
  process.env.NEXT_PUBLIC_POSTHOG_TOKEN = "phc_test";
});

describe("purchase event", () => {
  it("fires once for a paid order, on the browsing visitor's id, with the roadmap properties", async () => {
    await deliver(order());
    expect(captures).toHaveLength(1);
    const e = captures[0];
    expect(e.event).toBe("purchase");
    expect(e.distinctId).toBe("019f0000-aaaa-7bbb-8ccc-000000000001");
    expect(e.properties).toMatchObject({
      order_id: "9001",
      subtotal: 39.99,
      shipping_amount: 5.99,
      item_count: 1,
      offer_selected: "single",
      visitor_linked: true,
      is_internal: false,
      is_test_order: false,
    });
  });

  it("sets the order email on the buyer's person, and nothing else personal", async () => {
    await deliver(order({ email: " Shopper@Example.com ", shipping_address: { address1: "1 Main St", phone: "555-0100" } }));
    expect(identifies).toEqual([
      { distinctId: "019f0000-aaaa-7bbb-8ccc-000000000001", properties: { email: "shopper@example.com" } },
    ]);
    // The event itself carries no personal data, and names, address and phone never go.
    const sent = JSON.stringify(captures) + JSON.stringify(identifies);
    expect(JSON.stringify(captures)).not.toContain("shopper@example.com");
    for (const pii of ["Sam", "Shopper\"", "1 Main St", "555-0100"]) {
      expect(sent).not.toContain(pii);
    }
  });

  it("does not identify a purchase that has no visitor id", async () => {
    await deliver(order({ note_attributes: [] }));
    expect(identifies).toHaveLength(0);
  });

  it("a redelivered webhook does not count the order twice", async () => {
    await deliver(order());
    await deliver(order());
    await deliver(order());
    expect(captures).toHaveLength(1);
  });

  it("an order that is not paid is mirrored but not counted", async () => {
    await deliver(order({ financial_status: "pending" }));
    expect(captures).toHaveLength(0);
  });

  it("a Shopify test-mode order is marked internal, on the event and the person", async () => {
    await deliver(order({ test: true }));
    expect(captures[0].properties).toMatchObject({ is_test_order: true, is_internal: true, $set: { $internal_or_test_user: true } });
  });

  it("a cart from an internal browser, or a customer tagged internal, is marked internal", async () => {
    await deliver(order({ id: 1, note_attributes: [...order().note_attributes, { name: "_internal", value: "true" }] }));
    await deliver(order({ id: 2, customer: { first_name: null, last_name: null, tags: "VIP, Internal" } }));
    expect(captures.map((c) => (c.properties as Record<string, unknown>).is_internal)).toEqual([true, true]);
  });

  it("a purchase with no visitor id does not create a phantom person", async () => {
    await deliver(order({ note_attributes: [] }));
    expect(captures[0].distinctId).toBe("order_9001");
    expect(captures[0].properties).toMatchObject({ visitor_linked: false, $process_person_profile: false });
  });

  it("two units are the two-pack", async () => {
    await deliver(order({ line_items: [{ quantity: 2 }], current_subtotal_price: "79.98", total_shipping_price_set: { shop_money: { amount: "0.00" } } }));
    expect(captures[0].properties).toMatchObject({ offer_selected: "two_pack", item_count: 2, shipping_amount: 0 });
  });
});
