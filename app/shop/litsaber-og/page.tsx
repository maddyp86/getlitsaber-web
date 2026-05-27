import type { Metadata } from "next";
import { getProductByHandle } from "@/lib/shopify/queries";
import ProductDisplay from "@/components/home/ProductDisplay/ProductDisplay";

export const metadata: Metadata = {
  title: "Litsaber OG — The Interactive 510 Battery",
};

const SILVER_SKU = "LTS-OG-SLV";
const shopifyConfigured = Boolean(process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN);

export default async function PDPPage() {
  const product = await getProductByHandle("litsaber-og");
  const silverVariant = product?.variants.edges
    .map((e) => e.node)
    .find((v) => v.sku === SILVER_SKU) ?? null;

  // If Shopify is not configured (local dev without env vars), default to
  // showing the buy buttons rather than "Currently unavailable".
  const available = shopifyConfigured ? silverVariant !== null : true;

  return (
    <div className="pt-navbar px-container-mobile lg:px-container-desktop py-xl">
      <ProductDisplay
        variantId={silverVariant?.id ?? ""}
        available={available}
      />
    </div>
  );
}
