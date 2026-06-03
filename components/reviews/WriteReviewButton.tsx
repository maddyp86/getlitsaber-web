// Product-specific Judge.me review link for Litsaber OG.
// Copied from Judge.me admin → Settings → Request reviews →
// Links, QR codes and point of sale → Product review collection link.
const JUDGEME_REVIEW_LINK = "https://judge.me/product_reviews/9ae70b18-28e0-4076-a1ab-48502a1c64a4/new?id=7870095392975&source=shareable-link";

export default function WriteReviewButton() {
  return (
    <a
      href={JUDGEME_REVIEW_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center font-label font-bold text-[14px] uppercase tracking-wider text-accent-cyan border border-accent-cyan rounded-md px-6 py-3 transition-colors hover:bg-accent-cyan hover:text-background-primary"
    >
      Write a Review
    </a>
  );
}
