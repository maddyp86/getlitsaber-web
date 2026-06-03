const JUDGEME_PRODUCT_ID = "7870095392975";

interface Props {
  productId?: string;
  productTitle?: string;
}

export default function JudgemeReviewWidget({
  productId,
  productTitle = "Litsaber OG",
}: Props) {
  // Judge.me resolves reviews by the numeric Shopify product ID. Fall back to the
  // known constant when the Shopify fetch hasn't populated it (pre-integration).
  const resolvedId =
    productId && productId.length > 0 ? productId : JUDGEME_PRODUCT_ID;

  return (
    <div
      className="jdgm-widget jdgm-review-widget jdgm-outside-widget"
      data-id={resolvedId}
      data-product-title={productTitle}
    />
  );
}