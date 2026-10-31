import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/blog/hubspot";
import { buildSitemap } from "@/lib/seo/sitemap";

// Rebuilt hourly, so a newly published HubSpot post is listed within the hour.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildSitemap(await getPublishedPosts());
}
