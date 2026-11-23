// A campaign is a time-boxed variant of the storefront (hero, announcement
// bar, pricing, shipping) that can be switched on and off without touching the
// regular site. See docs/decisions/012-holiday-sale-2026.md.

export interface BarSegment {
  text: string;
  /** Marks a price or date. Not styled: the bar is one colour (2026-11-22). */
  accent?: boolean;
}

export interface BarMessage {
  id: string;
  desktop: BarSegment[];
  /** Shorter line used below 640px. Under 40 characters. */
  mobile?: BarSegment[];
}

export interface BarPhase {
  id: string;
  /** ISO timestamps with an explicit Pacific offset. Start inclusive, end exclusive. */
  start: string;
  end: string;
  messages: BarMessage[];
}

export interface CampaignPricing {
  /** Dollars taken off once per order when the cart holds two or more units. */
  multiUnitDiscount: number;
  /**
   * The saving a multi-unit order is SHOWN as having: its struck price is the
   * sale price plus this. May differ from multiUnitDiscount by a cent so the
   * anchor is a round number (Holiday 2026: $79.99, not 2 x $39.99 = $79.98).
   */
  multiUnitSaving: number;
  /** Every order ships free, including a single unit. */
  freeShippingAll: boolean;
  /**
   * Value stamped on the `_shipping_variant` cart attribute. Anything other
   * than "surcharge" makes the Shopify delivery Function ship free.
   */
  shippingAttribute: string;
}

export interface GalleryExtra {
  src: string;
  alt: string;
}

export interface Campaign {
  id: string;
  /** Customer-facing sale name, used for the "on sale" labels. */
  saleName: string;
  /** The campaign switches itself off at this instant, whatever the switch says. */
  end: string;
  href: string;
  pricing: CampaignPricing;
  bar: { phases: BarPhase[] };
  copy: {
    freeShippingLabel: string;
    /** Shown beside the sale name on the PDP, e.g. "Ends Dec 16". */
    endsLabel: string;
    /** Second line of the PDP sale banner: what the offer is. */
    offerLine: string;
    /** The one shipping line under the PDP Add to Cart button. */
    shippingLine: string;
    /** What each PDP quantity row contains, keyed by quantity. */
    offerContents: Record<number, string>;
    pdpDescription: string;
  };
  gallery: GalleryExtra[];
}
