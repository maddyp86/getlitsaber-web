import Link from "next/link";

export default function ActivateCta() {
  return (
    <section className="py-section-y-mobile lg:py-section-y border-t border-border-divider">
      <div className="mx-auto w-full max-w-content px-content text-center">
        <p className="font-label text-eyebrow tracking-[0.15em] uppercase text-text-muted mb-4">
          ALL SET?
        </p>
        <h2
          className="font-display font-bold uppercase text-text-primary mb-6"
          style={{ fontSize: "clamp(32px, 4vw, 55px)" }}
        >
          Ready to light up.
        </h2>
        <Link
          href="/shop/litsaber-og"
          className="inline-block rounded-pill border border-cta bg-cta px-8 py-3 font-label text-label tracking-widest uppercase text-text-primary transition-shadow duration-200 hover:shadow-glow-cta"
        >
          GET YOURS
        </Link>
        {/* TODO: build in follow-up prompt */}
      </div>
    </section>
  );
}
