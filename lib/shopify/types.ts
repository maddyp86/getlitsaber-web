export interface ShopifyMoneyV2 {
  amount: string;
  currencyCode: string;
}

export interface ShopifyVariant {
  id: string;
  title: string;
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
