interface Props {
  productId: 7870095392975;
  productTitle: "LitsaberOG";
}

export default function JudgemeReviewWidget({ productId, productTitle }: Props) {
  return (
    <div
      className="jdgm-widget jdgm-review-widget jdgm-outside-widget"
      data-id={productId}
      data-product-title={productTitle}
    />
  );
}
