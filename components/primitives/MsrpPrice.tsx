import { formatPrice } from "@/lib/cart/pricing";

interface MsrpPriceProps {
  price: number;
  msrp: number;
  className?: string;
  /** Classes for the struck-through MSRP. */
  msrpClassName?: string;
  /** Classes for the sell price. */
  priceClassName?: string;
}

/**
 * Sell price first, then the MSRP anchor struck through after it. The anchor
 * is never labeled "Was" or "Sale", and is hidden entirely when it is not
 * higher than the price. Strikethrough is not announced by screen readers, so
 * the anchor carries its meaning in visually hidden text instead.
 */
export default function MsrpPrice({
  price,
  msrp,
  className = "",
  msrpClassName = "",
  priceClassName = "",
}: MsrpPriceProps) {
  const showAnchor = msrp > price;
  return (
    <span className={`inline-flex items-baseline flex-wrap gap-x-2 ${className}`}>
      <span data-testid="price" className={priceClassName}>
        {formatPrice(price)}
      </span>
      {showAnchor && (
        <>
          <span className="sr-only">{`, MSRP ${formatPrice(msrp)}`}</span>
          <s aria-hidden="true" data-testid="msrp" className={msrpClassName}>
            {formatPrice(msrp)}
          </s>
        </>
      )}
    </span>
  );
}
