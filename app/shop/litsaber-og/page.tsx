import type { Metadata } from "next";
import { getProductByHandle } from "@/lib/shopify/queries";
import ProductDisplay from "@/components/home/ProductDisplay/ProductDisplay";

export const metadata: Metadata = {
  title: "Litsaber OG — The Interactive 510 Battery",
};

const SILVER_SKU = "LTS-OG-SLV";

export default async function PDPPage() {
  const product = await getProductByHandle("litsaber-og");
  const silverVariant = product?.variants.edges
    .map((e) => e.node)
    .find((v) => v.sku === SILVER_SKU) ?? null;

  return (
    <div className="pt-navbar px-container-mobile lg:px-container-desktop py-xl">
      <ProductDisplay
        variantId={silverVariant?.id ?? ""}
        available={silverVariant !== null}
      />
    </div>
  );
}
