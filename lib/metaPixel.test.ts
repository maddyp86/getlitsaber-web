import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  addToCart,
  contentIdFor,
  initiateCheckout,
  isMetaPixelEnabled,
  markMetaPixelReady,
  newEventId,
  pageView,
  resetMetaPixelForTests,
  viewContent,
  whenMetaPixelReady,
} from "./metaPixel";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const VARIANT = "gid://shopify/ProductVariant/45098118316239";

beforeEach(() => resetMetaPixelForTests());
afterEach(() => {
  delete window.fbq;
});

describe("without the pixel", () => {
  it("every helper is a no-op and returns null when window.fbq is missing", () => {
    expect(window.fbq).toBeUndefined();
    expect(pageView()).toBeNull();
    expect(viewContent({ variantId: VARIANT, value: 39.99 })).toBeNull();
    expect(addToCart({ variantId: VARIANT, quantity: 2, value: 79.98 })).toBeNull();
    expect(initiateCheckout({ lines: [{ variantId: VARIANT, quantity: 1 }], value: 39.99 })).toBeNull();
  });

  it("is disabled unless the id is a plain number", () => {
    expect(isMetaPixelEnabled("")).toBe(false);
    expect(isMetaPixelEnabled("abc')</script>")).toBe(false);
    expect(isMetaPixelEnabled("1682439596999374")).toBe(true);
  });
});

describe("with the pixel", () => {
  const fbq = vi.fn();
  beforeEach(() => {
    fbq.mockReset();
    window.fbq = fbq;
    vi.stubEnv("NEXT_PUBLIC_META_PIXEL_ID", "1682439596999374");
  });
  afterEach(() => vi.unstubAllEnvs());

  it("sends each event with a UUID eventID and returns it", () => {
    const id = viewContent({ variantId: VARIANT, value: 39.99 });
    expect(id).toMatch(UUID);
    expect(fbq).toHaveBeenCalledWith("track", "ViewContent", expect.any(Object), { eventID: id });
  });

  it("PageView goes through trackSingle, which the library does not deduplicate", () => {
    const id = pageView();
    expect(id).toMatch(UUID);
    expect(fbq).toHaveBeenCalledWith("trackSingle", "1682439596999374", "PageView", {}, { eventID: id });
  });

  it("PageView falls back to track when no pixel id is configured", () => {
    vi.stubEnv("NEXT_PUBLIC_META_PIXEL_ID", "");
    const id = pageView();
    expect(fbq).toHaveBeenCalledWith("track", "PageView", {}, { eventID: id });
  });

  it("ViewContent carries the variant id, product type, value and USD", () => {
    const id = viewContent({ variantId: VARIANT, value: 39.99 });
    expect(fbq).toHaveBeenCalledWith(
      "track",
      "ViewContent",
      { content_ids: ["45098118316239"], content_type: "product", value: 39.99, currency: "USD" },
      { eventID: id }
    );
  });

  it("AddToCart values exactly the units added", () => {
    const id = addToCart({ variantId: VARIANT, quantity: 2, value: 2 * 39.99 });
    expect(fbq).toHaveBeenCalledWith(
      "track",
      "AddToCart",
      {
        content_ids: ["45098118316239"],
        content_type: "product",
        contents: [{ id: "45098118316239", quantity: 2 }],
        value: 79.98,
        currency: "USD",
      },
      { eventID: id }
    );
  });

  it("InitiateCheckout carries the cart subtotal, unit count and every line", () => {
    const id = initiateCheckout({
      lines: [
        { variantId: VARIANT, quantity: 2 },
        { variantId: "gid://shopify/ProductVariant/1", quantity: 1 },
      ],
      value: 119.97,
    });
    expect(fbq).toHaveBeenCalledWith(
      "track",
      "InitiateCheckout",
      {
        content_ids: ["45098118316239", "1"],
        content_type: "product",
        contents: [
          { id: "45098118316239", quantity: 2 },
          { id: "1", quantity: 1 },
        ],
        num_items: 3,
        value: 119.97,
        currency: "USD",
      },
      { eventID: id }
    );
  });

  it("every event gets its own id", () => {
    const a = pageView();
    const b = pageView();
    expect(a).not.toBe(b);
    expect(newEventId()).not.toBe(newEventId());
  });

  it("swallows a throwing fbq", () => {
    fbq.mockImplementation(() => {
      throw new Error("boom");
    });
    expect(pageView()).toBeNull();
  });
});

describe("readiness queue", () => {
  it("runs queued callbacks once the snippet has run, and later ones at once", () => {
    const first = vi.fn();
    const second = vi.fn();
    whenMetaPixelReady(first);
    expect(first).not.toHaveBeenCalled();
    markMetaPixelReady();
    expect(first).toHaveBeenCalledTimes(1);
    whenMetaPixelReady(second);
    expect(second).toHaveBeenCalledTimes(1);
  });
});

describe("content ids", () => {
  it("uses the numeric part of a Shopify GID and passes anything else through", () => {
    expect(contentIdFor(VARIANT)).toBe("45098118316239");
    expect(contentIdFor("LTS-OG-SLV")).toBe("LTS-OG-SLV");
  });
});
