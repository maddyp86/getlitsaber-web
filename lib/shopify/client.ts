import type { ShopifyFetchResult } from "./types";

const STOREFRONT_API_VERSION = "2025-07";

function getEnv(): { domain: string; token: string } {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;

  if (!domain) {
    throw new Error(
      "Missing env var: NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN is not set."
    );
  }
  if (!token) {
    throw new Error(
      "Missing env var: NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN is not set."
    );
  }

  return { domain, token };
}

export async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const { domain, token } = getEnv();
  const endpoint = `https://${domain}/api/${STOREFRONT_API_VERSION}/graphql.json`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(
      `Shopify Storefront API returned HTTP ${res.status} for ${endpoint}`
    );
  }

  const json = (await res.json()) as ShopifyFetchResult<T>;

  if (json.errors && json.errors.length > 0) {
    const messages = json.errors.map((e) => e.message).join("; ");
    throw new Error(`Shopify GraphQL errors: ${messages}`);
  }

  return json.data;
}
