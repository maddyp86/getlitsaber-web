import { describe, expect, it } from "vitest";
import { mergeCartAttributes } from "./store";

describe("mergeCartAttributes", () => {
  it("keeps an existing visitor id and first-touch channel when refreshing", () => {
    const merged = mergeCartAttributes(
      [
        { key: "posthog_distinct_id", value: "device-123" },
        { key: "channel_type", value: "paid_social" },
        { key: "_shipping_variant", value: "control" },
      ],
      [
        { key: "channel_type", value: "direct" },
        { key: "device_type", value: "mobile" },
        { key: "_shipping_variant", value: "surcharge" },
      ]
    );
    const byKey = Object.fromEntries(merged.map((a) => [a.key, a.value]));
    expect(byKey).toEqual({
      posthog_distinct_id: "device-123",
      channel_type: "paid_social",
      device_type: "mobile",
      _shipping_variant: "surcharge",
    });
  });

  it("fills a missing or empty visitor id from the fresh set", () => {
    const merged = mergeCartAttributes(
      [{ key: "posthog_distinct_id", value: null }],
      [{ key: "posthog_distinct_id", value: "device-456" }]
    );
    expect(merged).toEqual([{ key: "posthog_distinct_id", value: "device-456" }]);
  });
});
