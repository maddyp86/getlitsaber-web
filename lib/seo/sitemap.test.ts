import { readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { describe, expect, it } from "vitest";
import type { BlogPost } from "@/lib/blog/posts";
import {
  DISALLOWED_PATHS,
  EXCLUDED_ROUTES,
  SITE_ORIGIN,
  STATIC_ROUTES,
  buildRobots,
  buildSitemap,
} from "./sitemap";

/** Every page route under app/, e.g. "/", "/blog/[slug]". */
function appPages(dir = join(process.cwd(), "app")): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "api") continue;
      out.push(...appPages(full));
    } else if (/^page\.(tsx|ts|jsx|js)$/.test(entry.name)) {
      const rel = relative(join(process.cwd(), "app"), dir).split(sep).join("/");
      // Route groups like (marketing) don't appear in the URL.
      const path = rel
        .split("/")
        .filter((s) => s && !/^\(.*\)$/.test(s))
        .join("/");
      out.push(`/${path}`);
    }
  }
  return out;
}

function post(overrides: Partial<BlogPost>): BlogPost {
  return {
    id: "1",
    slug: "a-post",
    title: "A post",
    seoTitle: "A post",
    description: "",
    bodyHtml: "",
    summaryHtml: "",
    image: null,
    imageAlt: "",
    cardImage: null,
    cardImageAlt: "",
    publishedAt: "2026-10-01T16:00:00Z",
    updatedAt: "2026-10-20T16:00:00Z",
    authorId: null,
    isDraft: false,
    ...overrides,
  };
}

describe("STATIC_ROUTES", () => {
  it("accounts for every page in app/, listed or excluded", () => {
    const listed = new Set(STATIC_ROUTES.map((r) => r.path));
    const excluded = new Set(Object.keys(EXCLUDED_ROUTES));
    const unaccounted = appPages()
      .filter((p) => !listed.has(p) && !excluded.has(p) && p !== "/blog");
    expect(unaccounted).toEqual([]);
  });

  it("lists only pages that exist", () => {
    const pages = new Set(appPages());
    expect(STATIC_ROUTES.map((r) => r.path).filter((p) => !pages.has(p))).toEqual([]);
  });

  it("never lists an excluded page", () => {
    expect(STATIC_ROUTES.filter((r) => r.path in EXCLUDED_ROUTES)).toEqual([]);
  });

  it("ranks the homepage and PDP highest", () => {
    const top = STATIC_ROUTES.filter((r) => r.priority === 1).map((r) => r.path);
    expect(top.sort()).toEqual(["/", "/shop/litsaber-og"]);
  });

  it("dates policies by their effective date", () => {
    expect(STATIC_ROUTES.find((r) => r.path === "/policies/terms")?.lastModified).toBe("2026-05-15");
  });
});

describe("buildSitemap", () => {
  it("uses the www origin for every URL", () => {
    const urls = buildSitemap([post({})]).map((e) => e.url);
    expect(urls.every((u) => u.startsWith(`${SITE_ORIGIN}/`) || u === SITE_ORIGIN)).toBe(true);
    expect(urls).toContain(SITE_ORIGIN);
    expect(urls).toContain(`${SITE_ORIGIN}/blog`);
  });

  it("lists live posts with their HubSpot updated date", () => {
    const entry = buildSitemap([post({ slug: "gift-guide" })]).find((e) => e.url.endsWith("/blog/gift-guide"));
    expect(entry?.lastModified).toBe("2026-10-20T16:00:00Z");
  });

  it("falls back to the publish date, and dates /blog by its newest post", () => {
    const map = buildSitemap([
      post({ slug: "old", updatedAt: null, publishedAt: "2026-09-01T00:00:00Z" }),
      post({ slug: "new", updatedAt: "2026-10-25T00:00:00Z" }),
    ]);
    expect(map.find((e) => e.url.endsWith("/blog/old"))?.lastModified).toBe("2026-09-01T00:00:00Z");
    expect(map.find((e) => e.url === `${SITE_ORIGIN}/blog`)?.lastModified).toBe("2026-10-25T00:00:00Z");
  });

  it("skips drafts, empty slugs and duplicate slugs", () => {
    const map = buildSitemap([
      post({ slug: "draft", isDraft: true }),
      post({ slug: "" }),
      post({ id: "1", slug: "twice" }),
      post({ id: "2", slug: "twice" }),
    ]);
    const blogUrls = map.map((e) => e.url).filter((u) => u.includes("/blog/"));
    expect(blogUrls).toEqual([`${SITE_ORIGIN}/blog/twice`]);
  });

  it("still lists /blog with no posts", () => {
    const blog = buildSitemap([]).find((e) => e.url === `${SITE_ORIGIN}/blog`);
    expect(blog).toBeDefined();
    expect(blog?.lastModified).toBeUndefined();
  });
});

describe("buildRobots", () => {
  it("points at the www sitemap", () => {
    expect(buildRobots().sitemap).toBe(`${SITE_ORIGIN}/sitemap.xml`);
  });

  it("blocks nothing the sitemap lists", () => {
    const paths = buildSitemap([post({})]).map((e) => new URL(e.url).pathname);
    const blocked = paths.filter((p) => DISALLOWED_PATHS.some((d) => p.startsWith(d)));
    expect(blocked).toEqual([]);
  });
});
