// A campaign is a time-boxed variant of the storefront (hero, announcement
// bar, pricing, shipping) that can be switched on and off without touching the
// regular site. See docs/decisions/012-holiday-sale-2026.md.

export interface BarSegment {
  text: string;
  /** Rendered in the cyan accent (prices and dates only). */
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
    /** Shown beside the sale name on the PDP, e.g. "ends Dec 16". */
    endsLabel: string;
    pdpDescription: string;
  };
  gallery: GalleryExtra[];
}
