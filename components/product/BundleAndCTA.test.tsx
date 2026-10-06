import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { useState } from "react";

const trackMock = vi.fn();

vi.mock("@/lib/analytics/events", () => ({
  track: (...args: unknown[]) => trackMock(...args),
  EVENTS: new Proxy({}, { get: (_t, key) => key }),
}));
vi.mock("@/lib/cart/store", () => ({
  useCartActions: () => ({ addItem: vi.fn() }),
  useCartStore: { getState: () => ({ items: [], checkoutUrl: null }) },
}));
vi.mock("@/lib/cart/useAddToCart", () => ({
  useAddToCart: () => vi.fn(),
  ADD_FAILED_MESSAGE: "failed",
}));
vi.mock("@/lib/toast/store", () => ({ useToastActions: () => ({ addToast: vi.fn() }) }));
vi.mock("@/components/forms/WaitlistForm", () => ({ default: () => null }));

import BundleAndCTA from "./BundleAndCTA";

function Harness({ basePrice }: { basePrice?: number }) {
  const [qty, setQty] = useState(1);
  return (
    <BundleAndCTA
      qty={qty}
      onQtyChange={setQty}
      variantId="gid://shopify/ProductVariant/1"
      available
      surface="pdp"
      basePrice={basePrice}
    />
  );
}

beforeEach(() => trackMock.mockClear());
afterEach(cleanup);

describe("offer rendering", () => {
  it("renders the single with the $49.99 MSRP anchor, $39.99 and $5.99 shipping", () => {
    render(<Harness basePrice={39.99} />);
    const single = within(screen.getByTestId("offer-single"));
    expect(single.getByTestId("msrp").textContent).toBe("$49.99");
    expect(single.getByTestId("msrp").tagName).toBe("S");
    expect(single.getByText("MSRP")).toBeTruthy();
    expect(single.getByTestId("price").textContent).toBe("$39.99");
    expect(single.getByText("+ $5.99 shipping")).toBeTruthy();
    expect(single.getByText("Add a second and shipping's free.")).toBeTruthy();
  });

  it("renders the 2-pack as Most popular with the $99.98 MSRP anchor, $79.98 and free shipping", () => {
    render(<Harness basePrice={39.99} />);
    const pack = within(screen.getByTestId("offer-two_pack"));
    expect(pack.getByText("Most popular")).toBeTruthy();
    expect(pack.getByTestId("msrp").textContent).toBe("$99.98");
    expect(pack.getByText("MSRP")).toBeTruthy();
    expect(pack.getByTestId("price").textContent).toBe("$79.98");
    expect(pack.getByText("Free shipping")).toBeTruthy();
  });

  it("shows exactly two merchandised offers and no save, percent-off or sale badges", () => {
    const { container } = render(<Harness basePrice={39.99} />);
    expect(screen.getAllByRole("radio")).toHaveLength(2);
    const text = container.textContent ?? "";
    expect(text).not.toMatch(/save/i);
    expect(text).not.toMatch(/%/);
    expect(text).not.toMatch(/\bsale\b/i);
    expect(text).not.toMatch(/\bwas\b/i);
  });

  it("never renders a price below $39.99 a unit, even if Shopify sends one", () => {
    render(<Harness basePrice={29.99} />);
    const prices = screen.getAllByTestId("price").map((el) => el.textContent);
    expect(prices).toEqual(["$39.99", "$79.98"]);
  });
});

describe("offer selection", () => {
  it("tracks the 2-pack and checks its card", () => {
    render(<Harness basePrice={39.99} />);
    const [single, pack] = screen.getAllByRole("radio");
    fireEvent.click(pack);
    expect(pack.getAttribute("aria-checked")).toBe("true");
    expect(single.getAttribute("aria-checked")).toBe("false");
    expect(trackMock).toHaveBeenCalledWith("product_offer_selected", {
      offer: "two_pack",
      quantity: 2,
      line_price: 79.98,
      surface: "pdp",
    });
  });

  it("lets the plain stepper reach a custom quantity that ships free", () => {
    render(<Harness basePrice={39.99} />);
    const plus = screen.getByRole("button", { name: "Increase quantity" });
    fireEvent.click(plus);
    fireEvent.click(plus);
    expect(screen.getByTestId("qty-value").textContent).toBe("3");
    for (const radio of screen.getAllByRole("radio")) {
      expect(radio.getAttribute("aria-checked")).toBe("false");
    }
    expect(screen.getByTestId("custom-qty-shipping").textContent).toContain("Free shipping");
    expect(trackMock).toHaveBeenLastCalledWith("product_offer_selected", {
      offer: "custom_qty",
      quantity: 3,
      line_price: 119.97,
      surface: "pdp",
    });
  });
});
