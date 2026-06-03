interface Props {
  productId: string;
  productTitle: string;
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
