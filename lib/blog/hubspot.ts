import {
  type BlogPost,
  type HubSpotPost,
  inThisBlog,
  isDraft,
  isLive,
  sortNewestFirst,
  toBlogPost,
} from "./posts";

/**
 * Server-side reads of the HubSpot blog (ADR-011). Needs HUBSPOT_ACCESS_TOKEN,
 * a HubSpot service key with the `content` scope (read only). Without it the
 * blog renders its empty state instead of erroring.
 */

const API = "https://api.hubapi.com/cms/v3/blogs";
const REVALIDATE_SECONDS = 300;
export const BLOG_CACHE_TAG = "hubspot-blog";

function token(): string | null {
  return process.env.HUBSPOT_ACCESS_TOKEN?.trim() || null;
}

async function hubspotGet<T>(path: string): Promise<T | null> {
  const key = token();
  if (!key) return null;
  try {
    const res = await fetch(`${API}${path}`, {
      headers: { Authorization: `Bearer ${key}` },
      next: { revalidate: REVALIDATE_SECONDS, tags: [BLOG_CACHE_TAG] },
    });
    if (!res.ok) {
      console.error(`[blog] HubSpot ${path} returned ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error("[blog] HubSpot request failed", err);
    return null;
  }
}

interface Page {
  results?: HubSpotPost[];
  paging?: { next?: { after?: string } };
}

/** Every post in the /blog content group (live and drafts), max 500. */
async function allPosts(): Promise<HubSpotPost[]> {
  const out: HubSpotPost[] = [];
  let after: string | undefined;
  for (let i = 0; i < 5; i++) {
    const qs = new URLSearchParams({ limit: "100", archived: "false" });
    if (after) qs.set("after", after);
    const page = await hubspotGet<Page>(`/posts?${qs.toString()}`);
    if (!page?.results) break;
    out.push(...page.results.filter(inThisBlog));
    after = page.paging?.next?.after;
    if (!after) break;
  }
  return out;
}

/** Published posts, newest first. */
export async function getPublishedPosts(): Promise<BlogPost[]> {
  const posts = await allPosts();
  return sortNewestFirst(posts.filter((p) => isLive(p)).map(toBlogPost));
}

/** One post by its /blog slug. Drafts are returned only when allowed. */
export async function getPost(slug: string, includeDrafts: boolean): Promise<BlogPost | null> {
  const posts = await allPosts();
  const match = posts
    .filter((p) => isLive(p) || (includeDrafts && isDraft(p)))
    .map(toBlogPost)
    .find((p) => p.slug === slug);
  return match ?? null;
}

/** Author display name for a post, or null. */
export async function getAuthorName(authorId: string | null): Promise<string | null> {
  if (!authorId) return null;
  const author = await hubspotGet<{ displayName?: string; fullName?: string; name?: string }>(
    `/authors/${encodeURIComponent(authorId)}`,
  );
  return author?.displayName || author?.fullName || author?.name || null;
}

export function blogConfigured(): boolean {
  return token() !== null;
}
