// Product-specific Judge.me review link for Litsaber OG.
// Copied from Judge.me admin → Settings → Request reviews →
// Links, QR codes and point of sale → Product review collection link.
const JUDGEME_REVIEW_LINK = "REPLACE_WITH_JUDGEME_PRODUCT_REVIEW_LINK";

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
