// Blog index hero. Same type system as PoliciesHero (Stellar headline,
// Monoton accent, Space Mono eyebrow), server-rendered with no motion.
// TODO(copy): headline and subline pending Matt's review.
export const BLOG_HERO = {
  eyebrow: "-- THE LITSABER BLOG",
  headlineWhite: "LIGHT",
  headlineCyan: "NOTES",
  subline:
    "Guides on 510 batteries, festivals and gifting, from the team that builds Litsaber. For adults 21+.",
} as const;

export default function BlogHero() {
  return (
    <section className="relative isolate w-full overflow-hidden bg-hero-fade" aria-label="The Litsaber Blog">
      <div className="mx-auto w-full max-w-content px-content pt-navbar">
        <div className="mx-auto flex max-w-[900px] flex-col items-center gap-6 py-section-y-mobile text-center lg:py-section-y">
          <p className="font-label text-eyebrow uppercase text-accent-cyan">{BLOG_HERO.eyebrow}</p>
          <h1 className="uppercase">
            <span
              className="block font-display font-bold text-text-primary"
              style={{ fontSize: "clamp(50px, 6vw, 100px)", lineHeight: 1.09 }}
            >
              {BLOG_HERO.headlineWhite}
            </span>
            <span
              className="block font-accent text-accent-cyan"
              style={{ fontSize: "clamp(50px, 6vw, 90px)", lineHeight: 1.2 }}
            >
              {BLOG_HERO.headlineCyan}
            </span>
          </h1>
          <p className="max-w-[600px] font-body text-body-sm text-text-secondary md:text-subhead">
            {BLOG_HERO.subline}
          </p>
        </div>
      </div>
    </section>
  );
}
