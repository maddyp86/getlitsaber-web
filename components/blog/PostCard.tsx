import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/blog/posts";
import { formatPostDate, readingMinutes } from "@/lib/blog/posts";

export default function PostCard({ post }: { post: BlogPost }) {
  const date = formatPostDate(post.publishedAt);
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-card border border-border-default bg-surface-card transition-colors hover:border-border-accent">
      <Link href={`/blog/${post.slug}`} className="flex h-full flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-cyan">
        {post.cardImage && (
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-background-elevated">
            <Image
              src={post.cardImage}
              alt={post.cardImageAlt}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>
        )}
        <div className="flex flex-1 flex-col gap-sm p-lg">
          <p className="font-label text-eyebrow uppercase tracking-widest text-text-muted">
            {[date, `${readingMinutes(post.bodyHtml)} MIN READ`].filter(Boolean).join(" · ")}
          </p>
          <h2 className="font-subhead text-[18px] font-bold uppercase leading-snug text-text-primary group-hover:text-accent-cyan lg:text-[20px]">
            {post.title}
          </h2>
          <p className="font-body text-body-sm leading-relaxed text-text-secondary">{post.description}</p>
          <span className="mt-auto pt-sm font-label text-eyebrow uppercase tracking-widest text-accent-cyan">
            Read the guide →
          </span>
        </div>
      </Link>
    </article>
  );
}
