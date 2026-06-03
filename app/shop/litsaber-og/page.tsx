import type { Metadata } from "next";
import { getProductByHandle } from "@/lib/shopify/queries";
import ProductDisplay from "@/components/product/ProductDisplay/ProductDisplay";
import PdpViewTracker from "@/components/pdp/PdpViewTracker";
import JudgemeReviewWidget from "@/components/reviews/JudgemeReviewWidget";

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

  const available = shopifyConfigured ? silverVariant?.availableForSale === true : true;
  const numericProductId = product?.id?.split("/").pop() ?? "";

  return (
    <div className="pt-navbar lg:px-container-desktop py-xl px-8">
      <PdpViewTracker />
      <div className="mx-auto w-full max-w-[1250px]">
        <ProductDisplay
          variantId={silverVariant?.id ?? ""}
          available={available}
          surface="pdp"
        />
      </div>
      <section className="mx-auto w-full max-w-[1250px] mt-24">
        <JudgemeReviewWidget productId={numericProductId} productTitle="Litsaber OG" />
      </section>
    </div>
  );
}
