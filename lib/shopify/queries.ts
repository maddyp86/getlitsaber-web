import { shopifyFetch } from "./client";
import type { ShopifyProduct, ShopifyProductResponse } from "./types";

export const GET_PRODUCT_BY_HANDLE = `
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      variants(first: 10) {
        edges {
          node {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export async function getProductByHandle(
  handle: string
): Promise<ShopifyProduct | null> {
  const data = await shopifyFetch<ShopifyProductResponse>(
    GET_PRODUCT_BY_HANDLE,
    { handle }
  );
  return data.product;
}
