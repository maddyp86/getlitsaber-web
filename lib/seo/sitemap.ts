import type { MetadataRoute } from "next";
import { POLICIES_EFFECTIVE_DATE } from "@/components/policies/shared";
import type { BlogPost } from "@/lib/blog/posts";

/**
 * Pure sitemap and robots data. No network access here so it can be unit
 * tested; app/sitemap.ts adds the live HubSpot posts.
 */

/** Canonical origin. The apex redirects to www, so every URL uses www. */
export const SITE_ORIGIN = "https://www.getlitsaber.com";

type Entry = MetadataRoute.Sitemap[number];
type StaticRoute = Omit<Entry, "url"> & { path: string };

/** "May 15, 2026" → "2026-05-15". */
function isoDate(label: string): string | undefined {
  const d = new Date(`${label} UTC`);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString().slice(0, 10);
}

const policiesDate = isoDate(POLICIES_EFFECTIVE_DATE);

/**
 * Every indexable page that isn't a blog post. Static pages have no reliable
 * edit date, so they carry no lastModified rather than a made-up one (search
 * engines stop trusting a lastmod that changes on every deploy). Policies use
 * their published effective date.
 */
export const STATIC_ROUTES: readonly StaticRoute[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/shop/litsaber-og", changeFrequency: "weekly", priority: 1 },
  { path: "/the-tech", changeFrequency: "monthly", priority: 0.8 },
  { path: "/wholesale", changeFrequency: "monthly", priority: 0.7 },
  { path: "/about", changeFrequency: "monthly", priority: 0.6 },
  { path: "/activate", changeFrequency: "monthly", priority: 0.5 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.5 },
  { path: "/affiliates", changeFrequency: "monthly", priority: 0.5 },
  { path: "/show-it-off", changeFrequency: "monthly", priority: 0.4 },
  { path: "/policies/shipping-returns", lastModified: policiesDate, changeFrequency: "yearly", priority: 0.3 },
  { path: "/policies/warranty", lastModified: policiesDate, changeFrequency: "yearly", priority: 0.3 },
  { path: "/policies/terms", lastModified: policiesDate, changeFrequency: "yearly", priority: 0.3 },
  { path: "/policies/privacy", lastModified: policiesDate, changeFrequency: "yearly", priority: 0.3 },
];

/**
 * Pages under app/ deliberately left out of the sitemap, with the reason.
 * sitemap.test.ts fails when a page is in neither list.
 */
export const EXCLUDED_ROUTES: Readonly<Record<string, string>> = {
  "/cart": "per-visitor, noindex",
  "/maintenance": "noindex, only served during maintenance mode",
  "/shopify-check": "temporary debug page",
  "/policies": "redirects to /policies/shipping-returns",
  "/policies/shipping": "redirects to /policies/shipping-returns",
  "/policies/refunds": "redirects to /policies/shipping-returns",
  "/blog/[slug]": "listed per post from HubSpot",
};

/** Paths crawlers should not fetch at all. */
export const DISALLOWED_PATHS = ["/api/", "/shopify-check"] as const;

function dateOf(post: BlogPost): string | undefined {
  return post.updatedAt ?? post.publishedAt ?? undefined;
}

/** The full sitemap: static pages, the blog index, then every live post. */
export function buildSitemap(posts: readonly BlogPost[]): MetadataRoute.Sitemap {
  const staticEntries: Entry[] = STATIC_ROUTES.map(({ path, ...rest }) => ({
    url: `${SITE_ORIGIN}${path === "/" ? "" : path}`,
    ...rest,
  }));

  const seen = new Set<string>();
  const postEntries: Entry[] = [];
  for (const post of posts) {
    if (post.isDraft || !post.slug || seen.has(post.slug)) continue;
    seen.add(post.slug);
    postEntries.push({
      url: `${SITE_ORIGIN}/blog/${post.slug}`,
      lastModified: dateOf(post),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  const newest = posts
    .map(dateOf)
    .filter((d): d is string => Boolean(d))
    .sort()
    .pop();
  const blogIndex: Entry = {
    url: `${SITE_ORIGIN}/blog`,
    lastModified: newest,
    changeFrequency: "weekly",
    priority: 0.7,
  };

  return [...staticEntries, blogIndex, ...postEntries];
}

export function buildRobots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: [...DISALLOWED_PATHS] },
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
  };
}
