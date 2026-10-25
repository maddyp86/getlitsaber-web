import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getAuthorName, getPost } from "@/lib/blog/hubspot";
import { BLOG_ORIGIN, formatPostDate, readingMinutes } from "@/lib/blog/posts";

// Drafts are visible to anyone holding the storefront preview cookie
// (visit any page with ?preview=<MAINTENANCE_BYPASS_TOKEN>, see middleware.ts).
function canSeeDrafts(): boolean {
  const token = process.env.MAINTENANCE_BYPASS_TOKEN;
  if (!token) return false;
  try {
    return cookies().get("ls-preview")?.value === token;
  } catch {
    return false;
  }
}

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug, canSeeDrafts());
  if (!post) return { title: "Post not found" };
  const url = `${BLOG_ORIGIN}/blog/${post.slug}`;
  return {
    title: { absolute: post.seoTitle },
    description: post.description,
    alternates: { canonical: url },
    robots: post.isDraft ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "article",
      url,
      title: post.seoTitle,
      description: post.description,
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt ?? undefined,
      images: post.image ? [{ url: post.image, alt: post.imageAlt }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPost(params.slug, canSeeDrafts());
  if (!post) notFound();

  const author = (await getAuthorName(post.authorId)) ?? "The Litsaber team";
  const published = formatPostDate(post.publishedAt);
  const updated = formatPostDate(post.updatedAt);
  const url = `${BLOG_ORIGIN}/blog/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url,
    mainEntityOfPage: url,
    datePublished: post.publishedAt ?? undefined,
    dateModified: post.updatedAt ?? post.publishedAt ?? undefined,
    image: post.image ?? undefined,
    author: { "@type": "Person", name: author },
    publisher: { "@type": "Organization", name: "Litsaber", url: BLOG_ORIGIN },
  };

  return (
    <article className="pt-navbar">
      {!post.isDraft && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}

      <header className="mx-auto w-full max-w-[860px] px-content pt-14 pb-8 lg:pt-20 lg:pb-10">
        <Link
          href="/blog"
          className="font-label text-eyebrow uppercase tracking-widest text-text-muted hover:text-accent-cyan"
        >
          ← The Litsaber Blog
        </Link>
        {post.isDraft && (
          <p className="mt-md inline-block rounded-pill border border-border-cta px-sm py-xs font-label text-eyebrow uppercase tracking-widest text-cta">
            Draft preview, not published
          </p>
        )}
        <h1
          className="mt-md font-display font-bold uppercase text-text-primary"
          style={{ fontSize: "clamp(34px, 4.4vw, 60px)", lineHeight: 1.1 }}
        >
          {post.title}
        </h1>
        <p className="mt-md font-label text-eyebrow uppercase tracking-widest text-text-muted">
          {[
            `By ${author}`,
            published,
            updated && updated !== published ? `Updated ${updated}` : null,
            `${readingMinutes(post.bodyHtml)} min read`,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </header>

      {post.image && (
        <div className="mx-auto w-full max-w-[1100px] px-content">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-card bg-background-elevated">
            <Image src={post.image} alt={post.imageAlt} fill priority sizes="(min-width: 1100px) 1100px, 100vw" className="object-cover" />
          </div>
        </div>
      )}

      <div
        className="blog-prose mx-auto w-full max-w-[860px] px-content py-xl"
        dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
      />

      <aside className="mx-auto w-full max-w-[860px] px-content pb-section-y-mobile lg:pb-section-y">
        <div className="flex flex-col items-start gap-md rounded-card border border-border-default bg-surface-card p-lg md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-label text-eyebrow uppercase tracking-widest text-accent-cyan">Litsaber OG</p>
            <p className="mt-xs font-body text-body-sm text-text-secondary">
              The interactive 510 battery. 41 LEDs, 10 colors, 3 modes.
            </p>
          </div>
          <Link
            href="/shop/litsaber-og"
            className="rounded-pill bg-cta px-lg py-sm font-label text-eyebrow uppercase tracking-widest text-text-primary shadow-glow-cta transition-shadow hover:shadow-glow-cta-hover"
          >
            Shop $39.99
          </Link>
        </div>
      </aside>
    </article>
  );
}
