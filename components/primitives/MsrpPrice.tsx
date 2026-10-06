import { formatPrice } from "@/lib/cart/pricing";

interface MsrpPriceProps {
  price: number;
  msrp: number;
  /** Show the visible "MSRP" label. Off only where space forbids it (hero CTA). */
  showLabel?: boolean;
  className?: string;
  /** Classes for the struck-through MSRP and its label. */
  msrpClassName?: string;
  /** Classes for the sell price. */
  priceClassName?: string;
}

/**
 * Sell price with the MSRP anchor struck through before it. The anchor is
 * always labeled "MSRP", never "Was" or "Sale", and is hidden entirely when it
 * is not higher than the price. Strikethrough is not announced by screen
 * readers, so the anchor carries its meaning in visually hidden text instead.
 */
export default function MsrpPrice({
  price,
  msrp,
  showLabel = true,
  className = "",
  msrpClassName = "",
  priceClassName = "",
}: MsrpPriceProps) {
  const showAnchor = msrp > price;
  return (
    <span className={`inline-flex items-baseline flex-wrap gap-x-2 ${className}`}>
      {showAnchor && (
        <>
          <span className="sr-only">{`MSRP ${formatPrice(msrp)}, our price `}</span>
          <span aria-hidden="true" className={`inline-flex items-baseline gap-1 ${msrpClassName}`}>
            {showLabel && <span>MSRP</span>}
            <s data-testid="msrp">{formatPrice(msrp)}</s>
          </span>
        </>
      )}
      <span data-testid="price" className={priceClassName}>
        {formatPrice(price)}
      </span>
    </span>
  );
}
