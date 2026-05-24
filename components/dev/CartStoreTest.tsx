"use client";

import {
  useCartItems,
  useItemCount,
  useSubtotal,
  useCartStore,
} from "@/lib/cart/store";

export default function CartStoreTest() {
  const items = useCartItems();
  const itemCount = useItemCount();
  const subtotal = useSubtotal();
  const { addItem, removeItem, updateQty, clear } = useCartStore();

  function addSilverSingle() {
    addItem({
      variantId: "silver-single",
      qty: 1,
      title: "Litsaber OG — Silver",
      variantTitle: "Single",
      price: 59.99,
      image: "/images/product/litsaber-silver.svg",
    });
  }

  function addTwoPack() {
    addItem({
      variantId: "silver-twopack",
      qty: 1,
      title: "Litsaber OG — Silver",
      variantTitle: "Two Pack",
      price: 99.99,
      image: "/images/product/litsaber-silver.svg",
    });
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: "#0a0a0a",
        borderBottom: "2px solid #00E5FF",
        padding: "12px 16px",
        fontFamily: "monospace",
        fontSize: "13px",
        color: "#fff",
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
        <span style={{ color: "#00E5FF", fontWeight: "bold" }}>
          [DEV] Cart Store Test
        </span>
        <span>
          itemCount: <strong style={{ color: "#00E5FF" }}>{itemCount}</strong>
        </span>
        <span>
          subtotal:{" "}
          <strong style={{ color: "#EC5793" }}>
            ${subtotal.toFixed(2)}
          </strong>
        </span>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
        <Btn onClick={addSilverSingle} color="#00E5FF">
          + Silver Single ($59.99)
        </Btn>
        <Btn onClick={addSilverSingle} color="#00E5FF">
          + Silver Single again
        </Btn>
        <Btn onClick={addTwoPack} color="#FF00E5">
          + Two Pack ($99.99)
        </Btn>
        <Btn onClick={clear} color="#ff4444">
          Clear All
        </Btn>
      </div>

      {/* Live lines */}
      {items.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {items.map((line) => (
            <div
              key={line.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "#1a1a1a",
                borderRadius: 4,
                padding: "4px 8px",
              }}
            >
              <span style={{ color: "#aaa", minWidth: 220 }}>
                {line.title} — {line.variantTitle}
              </span>
              <span style={{ color: "#888", minWidth: 60 }}>
                ${line.price.toFixed(2)}
              </span>
              <Btn
                onClick={() => updateQty(line.id, line.qty - 1)}
                color="#888"
                small
              >
                −
              </Btn>
              <span style={{ minWidth: 20, textAlign: "center" }}>{line.qty}</span>
              <Btn
                onClick={() => updateQty(line.id, line.qty + 1)}
                color="#888"
                small
              >
                +
              </Btn>
              <span style={{ color: "#EC5793", minWidth: 70 }}>
                = ${(line.price * line.qty).toFixed(2)}
              </span>
              <Btn onClick={() => removeItem(line.id)} color="#ff4444" small>
                Remove
              </Btn>
              <span style={{ color: "#444", fontSize: 10, marginLeft: "auto" }}>
                id: {line.id.slice(0, 8)}…
              </span>
            </div>
          ))}
        </div>
      )}

      {items.length === 0 && (
        <span style={{ color: "#555" }}>No items in cart.</span>
      )}
    </div>
  );
}

function Btn({
  children,
  onClick,
  color,
  small,
}: {
  children: React.ReactNode;
  onClick: () => void;
  color: string;
  small?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "transparent",
        border: `1px solid ${color}`,
        color,
        borderRadius: 4,
        padding: small ? "1px 7px" : "3px 10px",
        cursor: "pointer",
        fontSize: small ? 12 : 13,
        fontFamily: "monospace",
      }}
    >
      {children}
    </button>
  );
}
