/**
 * Pure helpers for the HubSpot-authored blog (ADR-011). No network access
 * here so they can be unit tested; fetching lives in lib/blog/hubspot.ts.
 */

/** HubSpot blog (content group) that powers /blog. */
export const BLOG_CONTENT_GROUP_ID = "415916821203";

/** Public origin for canonical URLs (www, the domain the site is served on). */
export const BLOG_ORIGIN = "https://www.getlitsaber.com";

/** Vercel Blob store that holds the site's own photography (ADR-007). */
export const MEDIA_HOST = "0ku6zb3bovdlowuq.public.blob.vercel-storage.com";
const OPTIMIZER_WIDTHS = [640, 1080, 1920] as const;

function optimized(src: string, width: number): string {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;
}

/**
 * Serves our own Blob photos in post bodies through the Next.js image
 * optimizer (originals run to several MB), with a responsive srcset and lazy
 * loading. Other image hosts are left alone.
 */
export function optimizeBodyImages(html: string): string {
  return html.replace(/<img\b([^>]*)>/gi, (tag, attrs: string) => {
    const m = attrs.match(/\ssrc\s*=\s*("|')([^"']+)\1/i);
    if (!m) return tag;
    const src = m[2];
    let host = "";
    try {
      host = new URL(src).host;
    } catch {
      return tag;
    }
    if (host !== MEDIA_HOST) return tag;
    const srcset = OPTIMIZER_WIDTHS.map((w) => `${optimized(src, w)} ${w}w`).join(", ");
    const rest = attrs
      .replace(/\s(src|srcset|sizes|loading|decoding|width|height|style)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
      .trim();
    return `<img src="${optimized(src, 1080)}" srcset="${srcset}" sizes="(min-width: 1440px) 1260px, 100vw" loading="lazy" decoding="async"${rest ? ` ${rest}` : ""}>`;
  });
}

/** First image URL in a body (original src), for cards and link previews. */
export function firstImage(html: string): { src: string; alt: string } | null {
  const tag = html.match(/<img\b[^>]*>/i)?.[0];
  if (!tag) return null;
  const src = tag.match(/\ssrc\s*=\s*("|')([^"']+)\1/i)?.[2];
  if (!src || src.startsWith("/")) return null;
  const alt = tag.match(/\salt\s*=\s*("|')(.*?)\1/i)?.[2] ?? "";
  return { src, alt };
}

/** The subset of HubSpot's blog post object the site uses. */
export interface HubSpotPost {
  id: string;
  slug: string;
  name: string;
  htmlTitle?: string | null;
  metaDescription?: string | null;
  postBody?: string | null;
  postSummary?: string | null;
  featuredImage?: string | null;
  featuredImageAltText?: string | null;
  publishDate?: string | null;
  updated?: string | null;
  blogAuthorId?: string | null;
  contentGroupId?: string | number | null;
  currentState?: string | null;
  state?: string | null;
  archivedAt?: string | number | null;
}

/** A post shaped for rendering. */
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  bodyHtml: string;
  summaryHtml: string;
  /** HubSpot featured image, shown above the post. */
  image: string | null;
  imageAlt: string;
  /** Featured image, else the first image in the body. For cards and OG. */
  cardImage: string | null;
  cardImageAlt: string;
  publishedAt: string | null;
  updatedAt: string | null;
  authorId: string | null;
  isDraft: boolean;
}

/**
 * "blog/my-post" → "my-post". HubSpot slugs include the blog's path at the
 * time the post was created (a post made before the blog was renamed keeps
 * e.g. "innovape-concepts-blog/my-post"), so only the last segment is used.
 */
export function postSlug(hubspotSlug: string): string {
  const parts = hubspotSlug.split("/").filter(Boolean);
  return parts[parts.length - 1] ?? "";
}

/** True for a published post whose publish date has arrived. */
export function isLive(post: HubSpotPost, now: Date = new Date()): boolean {
  const state = (post.currentState ?? post.state ?? "").toUpperCase();
  if (state !== "PUBLISHED") return false;
  if (!post.publishDate) return true;
  return new Date(post.publishDate).getTime() <= now.getTime();
}

export function isDraft(post: HubSpotPost): boolean {
  return (post.currentState ?? post.state ?? "").toUpperCase() === "DRAFT";
}

/** True when the post belongs to the /blog content group and isn't archived. */
export function inThisBlog(post: HubSpotPost): boolean {
  if (post.archivedAt && String(post.archivedAt) !== "0" && !String(post.archivedAt).startsWith("1970")) {
    return false;
  }
  return String(post.contentGroupId ?? "") === BLOG_CONTENT_GROUP_ID;
}

/** Plain text from HTML, for descriptions and excerpts. */
export function stripHtml(html: string): string {
  return html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&rsquo;|&lsquo;/g, "'")
    .replace(/&quot;|&ldquo;|&rdquo;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

/** Trim to a word boundary, adding an ellipsis when shortened. */
export function excerpt(text: string, max = 160): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : max).replace(/[,;:.\s]+$/, "")}…`;
}

/**
 * Prepares HubSpot body HTML for the site: removes scripts, inline event
 * handlers and iframes (bodies are authored in HubSpot, but nothing in a post
 * should run code on the storefront), and opens external links in a new tab.
 */
export function cleanBody(html: string): string {
  return html
    // HubSpot's editor leaves blank paragraphs (<p>&nbsp;</p>) and its
    // read-more marker behind; both render as empty gaps.
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<p[^>]*>(?:\s|&nbsp;|&#160;|<br\s*\/?>)*<\/p>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/href\s*=\s*("|')\s*javascript:[^"']*\1/gi, 'href="#"')
    .replace(/<a\s+([^>]*href=("|')https?:\/\/(?!(?:www\.)?getlitsaber\.com)[^"']+\2[^>]*)>/gi, (match, attrs: string) =>
      /target=/i.test(attrs) ? match : `<a ${attrs} target="_blank" rel="noopener">`,
    )
    .trim();
}

/** Maps a HubSpot post to the render shape. */
export function toBlogPost(post: HubSpotPost): BlogPost {
  const rawBody = cleanBody(post.postBody ?? "");
  const inline = firstImage(rawBody);
  const body = optimizeBodyImages(rawBody);
  const summary = cleanBody(post.postSummary ?? "");
  const description =
    post.metaDescription?.trim() || excerpt(stripHtml(summary || body), 160);
  return {
    id: String(post.id),
    slug: postSlug(post.slug),
    title: post.name,
    seoTitle: post.htmlTitle?.trim() || post.name,
    description,
    bodyHtml: body,
    summaryHtml: summary,
    image: post.featuredImage?.trim() || null,
    imageAlt: post.featuredImageAltText?.trim() || post.name,
    cardImage: post.featuredImage?.trim() || inline?.src || null,
    cardImageAlt: post.featuredImageAltText?.trim() || inline?.alt || post.name,
    publishedAt: post.publishDate ?? null,
    updatedAt: post.updated ?? null,
    authorId: post.blogAuthorId ? String(post.blogAuthorId) : null,
    isDraft: isDraft(post),
  };
}

/** Newest first; undated drafts sort to the top. */
export function sortNewestFirst(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => {
    const ta = a.publishedAt ? new Date(a.publishedAt).getTime() : Number.POSITIVE_INFINITY;
    const tb = b.publishedAt ? new Date(b.publishedAt).getTime() : Number.POSITIVE_INFINITY;
    return tb - ta;
  });
}

/** "October 24, 2026" in Pacific time (the business's time zone). */
export function formatPostDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/Los_Angeles",
  });
}

/** Rough reading time at 230 words a minute, minimum 1. */
export function readingMinutes(html: string): number {
  const words = stripHtml(html).split(" ").filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}
