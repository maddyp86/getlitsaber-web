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
  it("renders the single at $39.99 followed by the struck $49.99 MSRP, plus $5.99 shipping", () => {
    render(<Harness basePrice={39.99} />);
    const single = within(screen.getByTestId("offer-single"));
    const price = single.getByTestId("price");
    const msrp = single.getByTestId("msrp");
    expect(price.textContent).toBe("$39.99");
    expect(msrp.textContent).toBe("$49.99");
    expect(msrp.tagName).toBe("S");
    // Sell price comes first, the struck anchor after it.
    expect(price.compareDocumentPosition(msrp) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(single.getByText("+ $5.99 shipping")).toBeTruthy();
  });

  it("renders the 2-pack as Most popular at $79.98 with the struck $99.98 MSRP and free shipping", () => {
    render(<Harness basePrice={39.99} />);
    const pack = within(screen.getByTestId("offer-two_pack"));
    expect(pack.getByText("Most popular")).toBeTruthy();
    expect(pack.getByTestId("msrp").textContent).toBe("$99.98");
    expect(pack.getByTestId("price").textContent).toBe("$79.98");
    expect(pack.getByText("Free shipping")).toBeTruthy();
  });

  it("shows exactly two offers, no stepper, and no save, percent-off or sale badges", () => {
    const { container } = render(<Harness basePrice={39.99} />);
    expect(screen.getAllByRole("radio")).toHaveLength(2);
    expect(screen.queryByRole("button", { name: /increase quantity/i })).toBeNull();
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
});
