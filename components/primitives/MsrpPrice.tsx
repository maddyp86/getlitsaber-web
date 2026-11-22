import { formatPrice } from "@/lib/cart/pricing";

interface MsrpPriceProps {
  price: number;
  msrp: number;
  className?: string;
  /** Classes for the struck-through MSRP. */
  msrpClassName?: string;
  /** Classes for the sell price. */
  priceClassName?: string;
  /**
   * What the struck price is, for screen readers. "MSRP" by default; "was"
   * when a campaign discounts the line and the anchor is the regular price.
   */
  anchorLabel?: "MSRP" | "was";
}

/**
 * Sell price first, then the anchor struck through after it. The anchor has no
 * visible label and is hidden entirely when it is not higher than the price.
 * Strikethrough is not announced by screen readers, so the anchor's meaning is
 * a visually hidden label inside the same element. The amount itself is in the
 * markup once: it used to be written twice (a hidden copy plus the struck one),
 * which read as a duplicated price to search engines and text extractors.
 */
export default function MsrpPrice({
  price,
  msrp,
  className = "",
  msrpClassName = "",
  priceClassName = "",
  anchorLabel = "MSRP",
}: MsrpPriceProps) {
  const showAnchor = msrp > price;
  return (
    <span className={`inline-flex items-baseline flex-wrap gap-x-2 ${className}`}>
      <span data-testid="price" className={priceClassName}>
        {formatPrice(price)}
      </span>
      {showAnchor && (
        <s data-testid="msrp" className={msrpClassName}>
          <span className="sr-only">{`${anchorLabel} `}</span>
          {formatPrice(msrp)}
        </s>
      )}
    </span>
  );
}
