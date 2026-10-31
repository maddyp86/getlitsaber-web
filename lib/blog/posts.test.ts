import { describe, expect, it } from "vitest";
import {
  BLOG_CONTENT_GROUP_ID,
  type HubSpotPost,
  cleanBody,
  optimizeBodyImages,
  excerpt,
  formatPostDate,
  inThisBlog,
  isLive,
  postSlug,
  readingMinutes,
  sortNewestFirst,
  toBlogPost,
} from "./posts";

const base: HubSpotPost = {
  id: "1",
  slug: "blog/cannabis-accessory-gifts-under-50",
  name: "Gifts Under $50",
  contentGroupId: BLOG_CONTENT_GROUP_ID,
  currentState: "PUBLISHED",
  publishDate: "2026-10-20T17:00:00Z",
  postBody: "<p>Hello <a href=\"https://example.com\">there</a></p>",
};

describe("postSlug", () => {
  it("drops the blog prefix and stray slashes", () => {
    expect(postSlug("blog/my-post")).toBe("my-post");
    expect(postSlug("/blog/my-post/")).toBe("my-post");
    expect(postSlug("my-post")).toBe("my-post");
    expect(postSlug("innovape-concepts-blog/my-post")).toBe("my-post");
  });
});

describe("isLive / inThisBlog", () => {
  const now = new Date("2026-10-25T00:00:00Z");
  it("shows published posts whose date has passed", () => {
    expect(isLive(base, now)).toBe(true);
  });
  it("hides drafts and scheduled posts", () => {
    expect(isLive({ ...base, currentState: "DRAFT" }, now)).toBe(false);
    expect(isLive({ ...base, publishDate: "2026-11-01T00:00:00Z" }, now)).toBe(false);
  });
  it("only accepts posts from the /blog content group", () => {
    expect(inThisBlog(base)).toBe(true);
    expect(inThisBlog({ ...base, contentGroupId: 999 })).toBe(false);
    expect(inThisBlog({ ...base, contentGroupId: Number(BLOG_CONTENT_GROUP_ID) })).toBe(true);
  });
  it("treats HubSpot's zero archivedAt as not archived", () => {
    expect(inThisBlog({ ...base, archivedAt: 0 })).toBe(true);
    expect(inThisBlog({ ...base, archivedAt: "1970-01-01T00:00:00Z" })).toBe(true);
    expect(inThisBlog({ ...base, archivedAt: "2026-10-01T00:00:00Z" })).toBe(false);
  });
});

describe("cleanBody", () => {
  it("strips scripts, iframes and inline handlers", () => {
    const out = cleanBody('<p onclick="x()">a</p><script>alert(1)</script><iframe src="y"></iframe>');
    expect(out).toBe("<p>a</p>");
  });
  it("drops blank paragraphs and HubSpot's read-more marker", () => {
    expect(cleanBody("<p>&nbsp;</p>\n<!--more-->\n<p>Hi</p><p> <br> </p>")).toBe("<p>Hi</p>");
    expect(cleanBody("<table></table>\n<h2>&nbsp;</h2>\n<h2>Next</h2>")).toBe("<table></table>\n\n<h2>Next</h2>");
  });
  it("moves a photo that sits just above a heading to just below it", () => {
    const out = cleanBody('<p>a</p><figure><img src="x.jpg" alt="x"></figure>\n<h2>Title</h2><p>b</p>');
    expect(out).toBe('<p>a</p><h2>Title</h2>\n<figure><img src="x.jpg" alt="x"></figure><p>b</p>');
  });
  it("neutralises javascript: links", () => {
    expect(cleanBody('<a href="javascript:alert(1)">x</a>')).toContain('href="#"');
  });
  it("opens external links in a new tab but leaves our own links alone", () => {
    expect(cleanBody('<a href="https://example.com">x</a>')).toContain('target="_blank" rel="noopener"');
    expect(cleanBody('<a href="https://www.getlitsaber.com/shop">x</a>')).not.toContain("_blank");
    expect(cleanBody('<a href="/shop">x</a>')).not.toContain("_blank");
  });
});

describe("toBlogPost", () => {
  it("prefers the meta description, else an excerpt of the body", () => {
    expect(toBlogPost({ ...base, metaDescription: "Meta" }).description).toBe("Meta");
    expect(toBlogPost(base).description).toBe("Hello there");
  });
  it("uses the HTML title for SEO when set", () => {
    expect(toBlogPost({ ...base, htmlTitle: "SEO title" }).seoTitle).toBe("SEO title");
    expect(toBlogPost(base).seoTitle).toBe("Gifts Under $50");
  });
  it("maps the slug and draft state", () => {
    const p = toBlogPost({ ...base, currentState: "DRAFT" });
    expect(p.slug).toBe("cannabis-accessory-gifts-under-50");
    expect(p.isDraft).toBe(true);
  });
});

describe("formatting helpers", () => {
  it("formats dates in Pacific time", () => {
    expect(formatPostDate("2026-10-25T03:00:00Z")).toBe("October 24, 2026");
    expect(formatPostDate(null)).toBeNull();
    expect(formatPostDate("nope")).toBeNull();
  });
  it("estimates reading time with a one-minute floor", () => {
    expect(readingMinutes("<p>short</p>")).toBe(1);
    expect(readingMinutes(`<p>${"word ".repeat(920)}</p>`)).toBe(4);
  });
  it("excerpts on a word boundary", () => {
    expect(excerpt("one two three four", 9)).toBe("one two…");
    expect(excerpt("short", 9)).toBe("short");
  });
  it("sorts newest first", () => {
    const a = toBlogPost({ ...base, id: "a", publishDate: "2026-01-01T00:00:00Z" });
    const b = toBlogPost({ ...base, id: "b", publishDate: "2026-06-01T00:00:00Z" });
    expect(sortNewestFirst([a, b]).map((p) => p.id)).toEqual(["b", "a"]);
  });
});

describe("images", () => {
  const blob = "https://0ku6zb3bovdlowuq.public.blob.vercel-storage.com/images/home/rave.jpg";
  it("serves our Blob photos through the optimizer with a srcset", () => {
    const out = optimizeBodyImages(`<img src="${blob}" alt="Rave" width="4000" style="x">`);
    expect(out).toContain(`src="/_next/image?url=${encodeURIComponent(blob)}&w=1080&q=75"`);
    expect(out).toContain("640w");
    expect(out).toContain('loading="lazy"');
    expect(out).toContain('alt="Rave"');
    expect(out).not.toContain("4000");
  });
  it("leaves other hosts alone", () => {
    const tag = '<img src="https://example.com/a.jpg" alt="a">';
    expect(optimizeBodyImages(tag)).toBe(tag);
  });
  it("uses the first body image for cards when there is no featured image", () => {
    const p = toBlogPost({ ...base, postBody: `<p>x</p><img src="${blob}" alt="Rave">` });
    expect(p.image).toBeNull();
    expect(p.cardImage).toBe(blob);
    expect(p.cardImageAlt).toBe("Rave");
    expect(toBlogPost({ ...base, featuredImage: "https://f.example/x.jpg" }).cardImage).toBe("https://f.example/x.jpg");
  });
});
