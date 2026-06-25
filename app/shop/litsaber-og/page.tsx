import type { Metadata } from "next";
import { getProductByHandle } from "@/lib/shopify/queries";
import { BASE_UNIT_PRICE } from "@/lib/cart/pricing";
import ProductDisplay from "@/components/product/ProductDisplay";
import JudgemeReviewWidget from "@/components/reviews/JudgemeReviewWidget";
{/*import WriteReviewButton from "@/components/reviews/WriteReviewButton";*/}

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
  const basePrice = silverVariant?.price?.amount
    ? parseFloat(silverVariant.price.amount)
    : BASE_UNIT_PRICE;

  return (
    <div className="pt-navbar py-xl">
      <div className="mx-auto w-full justify-center max-w-content pt-xl px-content pb-xl">
        <ProductDisplay
          variantId={silverVariant?.id ?? ""}
          available={available}
          surface="pdp"
          basePrice={basePrice}
        />
      </div>

      {/* Divider aligned to content edge */}
      <div className="mx-auto w-full max-w-content px-content">
        <hr className="w-full border-t border-border-divider" />
      </div>

      <section className="mx-auto w-full max-w-content px-content mt-24">
        <h2
          className="font-display text-h3 lg:text-h1 text-text-primary text-center"
          style={{
            fontSize: "clamp(45px, 3.2vw, 75px)",
            fontStyle: "normal",
            fontWeight: "700",
          }}
        >
          Customer Reviews
        </h2>
        <div className="flex justify-center mb-6">
          {/* <WriteReviewButton /> */}
        </div>
        <JudgemeReviewWidget productId={numericProductId} productTitle="Litsaber OG" />
      </section>
    </div>
  );
}
