// TEMP — remove after variant IDs captured. DO NOT commit to main.
import { getProductByHandle } from "@/lib/shopify/queries";

export const dynamic = "force-dynamic";

export default async function ShopifyCheckPage() {
  let product = null;
  let fetchError: string | null = null;

  try {
    product = await getProductByHandle("litsaber-og");
  } catch (err) {
    fetchError = err instanceof Error ? err.message : String(err);
  }

  return (
    <div style={{ fontFamily: "monospace", padding: "32px", maxWidth: "800px" }}>
      {/* DEV ONLY BANNER */}
      <div
        style={{
          background: "#b91c1c",
          color: "#fff",
          padding: "10px 16px",
          borderRadius: "6px",
          marginBottom: "24px",
          fontWeight: "bold",
        }}
      >
        DEV ONLY — remove before final commit. Captures Shopify variant IDs.
      </div>

      <h1 style={{ fontSize: "20px", marginBottom: "16px" }}>
        Shopify Storefront API — Phase 4a verification
      </h1>
      <p style={{ marginBottom: "8px", color: "#6b7280" }}>
        API version: <strong>2025-07</strong> &nbsp;|&nbsp; Handle queried:{" "}
        <strong>litsaber-og</strong>
      </p>

      {fetchError && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fca5a5",
            borderRadius: "6px",
            padding: "16px",
            color: "#b91c1c",
            marginTop: "16px",
          }}
        >
          <strong>Error:</strong> {fetchError}
        </div>
      )}

      {!fetchError && !product && (
        <div
          style={{
            background: "#fffbeb",
            border: "1px solid #fcd34d",
            borderRadius: "6px",
            padding: "16px",
            color: "#92400e",
            marginTop: "16px",
          }}
        >
          <strong>Product not found.</strong> Handle &quot;litsaber-og&quot; returned null.
          Check the exact handle in Shopify admin.
        </div>
      )}

      {product && (
        <div>
          <table
            style={{
              borderCollapse: "collapse",
              marginBottom: "24px",
              width: "100%",
            }}
          >
            <tbody>
              <tr>
                <td style={labelCell}>Title</td>
                <td style={valueCell}>{product.title}</td>
              </tr>
              <tr>
                <td style={labelCell}>Handle</td>
                <td style={valueCell}>{product.handle}</td>
              </tr>
              <tr>
                <td style={labelCell}>Product GID</td>
                <td style={valueCell}>{product.id}</td>
              </tr>
            </tbody>
          </table>

          <h2 style={{ fontSize: "16px", marginBottom: "12px" }}>Variants</h2>
          <table
            style={{
              borderCollapse: "collapse",
              width: "100%",
              border: "1px solid #e5e7eb",
            }}
          >
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                <th style={th}>Title</th>
                <th style={th}>Variant GID</th>
                <th style={th}>Price (amount)</th>
                <th style={th}>Currency</th>
                <th style={th}>availableForSale</th>
              </tr>
            </thead>
            <tbody>
              {product.variants.edges.map(({ node }) => (
                <tr key={node.id}>
                  <td style={td}>{node.title}</td>
                  <td style={{ ...td, fontSize: "11px", wordBreak: "break-all" }}>
                    {node.id}
                  </td>
                  <td style={td}>{node.price.amount}</td>
                  <td style={td}>{node.price.currencyCode}</td>
                  <td
                    style={{
                      ...td,
                      color: node.availableForSale ? "#16a34a" : "#dc2626",
                      fontWeight: "bold",
                    }}
                  >
                    {node.availableForSale ? "true" : "false"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const labelCell: React.CSSProperties = {
  padding: "6px 12px 6px 0",
  color: "#6b7280",
  verticalAlign: "top",
  width: "140px",
};

const valueCell: React.CSSProperties = {
  padding: "6px 0",
  fontWeight: "bold",
  wordBreak: "break-all",
};

const th: React.CSSProperties = {
  padding: "8px 12px",
  textAlign: "left",
  border: "1px solid #e5e7eb",
  fontSize: "13px",
  color: "#374151",
};

const td: React.CSSProperties = {
  padding: "8px 12px",
  border: "1px solid #e5e7eb",
  fontSize: "13px",
  verticalAlign: "top",
};
