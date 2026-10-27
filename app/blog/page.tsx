import type { Metadata } from "next";
import Link from "next/link";
import BlogHero from "@/components/blog/BlogHero";
import PostCard from "@/components/blog/PostCard";
import { getPublishedPosts } from "@/lib/blog/hubspot";
import { BLOG_ORIGIN } from "@/lib/blog/posts";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog: 510 Batteries, Festivals and Gift Guides",
  description:
    "Guides from the team behind Litsaber, the interactive 510 battery: voltage settings, festival gear, gift ideas and honest comparisons. For adults 21+.",
  alternates: { canonical: `${BLOG_ORIGIN}/blog` },
  openGraph: { url: `${BLOG_ORIGIN}/blog`, type: "website" },
};

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();

  return (
    <>
      <BlogHero />
      <section className="mx-auto w-full max-w-content px-content pt-xl pb-section-y-mobile lg:pt-section-y-mobile lg:pb-section-y">
        {posts.length === 0 ? (
          <div className="mx-auto max-w-[600px] rounded-card border border-border-default bg-surface-card p-xl text-center">
            <p className="font-label text-eyebrow uppercase tracking-widest text-accent-cyan">First guides coming soon</p>
            <p className="mt-sm font-body text-body-sm text-text-secondary">
              In the meantime, see how Litsaber is built.
            </p>
            <Link
              href="/the-tech"
              className="mt-md inline-block font-label text-eyebrow uppercase tracking-widest text-text-primary underline underline-offset-4 hover:text-accent-cyan"
            >
              The tech →
            </Link>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-lg md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <li key={post.id}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
