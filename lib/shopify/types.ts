export interface ShopifyMoneyV2 {
  amount: string;
  currencyCode: string;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  sku: string;
  availableForSale: boolean;
  price: ShopifyMoneyV2;
}

export interface ShopifyVariantEdge {
  node: ShopifyVariant;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  variants: {
    edges: ShopifyVariantEdge[];
  };
}

export interface ShopifyProductResponse {
  product: ShopifyProduct | null;
}

export interface ShopifyGraphQLError {
  message: string;
  locations?: { line: number; column: number }[];
  path?: string[];
}

export interface ShopifyFetchResult<T> {
  data: T;
  errors?: ShopifyGraphQLError[];
}

export interface AttributeInput {
  key: string;
  value: string;
}

// ---------------------------------------------------------------------------
// Cart types
// ---------------------------------------------------------------------------

export interface ShopifyCartLineNode {
  id: string;
  quantity: number;
  merchandise: {
    __typename: "ProductVariant";
    id: string;
  };
  cost: {
    totalAmount: ShopifyMoneyV2;
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  lines: {
    edges: Array<{ node: ShopifyCartLineNode }>;
  };
  // Cart-level attributes (attribution + experiment arm). Read back on hydrate
  // so an already-frozen arm is never overwritten.
  attributes?: Array<{ key: string; value: string | null }>;
}

export interface ShopifyCartResponse {
  cartCreate?: { cart: ShopifyCart };
  cartLinesAdd?: { cart: ShopifyCart };
  cartLinesRemove?: { cart: ShopifyCart };
  cartLinesUpdate?: { cart: ShopifyCart };
  cartAttributesUpdate?: { cart: ShopifyCart };
  cart?: ShopifyCart | null;
}
