import Link from "next/link";

export default function BlogPostNotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] w-full max-w-[860px] flex-col items-start justify-center gap-md px-content pt-navbar">
      <p className="font-label text-eyebrow uppercase tracking-widest text-accent-cyan">404</p>
      <h1 className="font-display text-h2 font-bold uppercase text-text-primary">This post isn&apos;t here</h1>
      <p className="font-body text-body-sm text-text-secondary">It may have moved, or it hasn&apos;t been published yet.</p>
      <Link
        href="/blog"
        className="font-label text-eyebrow uppercase tracking-widest text-text-primary underline underline-offset-4 hover:text-accent-cyan"
      >
        ← All posts
      </Link>
    </section>
  );
}
