import Link from "next/link";

const EXPLORE_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop Litsaber", href: "/shop/litsaber-og" },
  { label: "Wholesale", href: "/wholesale" },
] as const;

const SUPPORT_LINKS = [
  { label: "Contact Us", href: "/contact" },
  { label: "Refund and Returns", href: "/policies/refunds" },
  { label: "Warranty", href: "/policies/warranty" },
] as const;

const BRAND_LINKS = [
  { label: "About", href: "/about" },
  { label: "The Tech", href: "/the-tech" },
] as const;

export default function Footer() {
  return (
    <footer className="bg-background-primary border-t border-surface-tint-white">
      <div className="mx-auto max-w-container px-container-mobile lg:px-container py-section-y-mobile lg:py-section-y">
        {/* Top section */}
        <div className="flex flex-col lg:flex-row lg:gap-16 gap-10">
          {/* Brand column */}
          <div className="lg:max-w-xs shrink-0">
            <Link
              href="/"
              className="font-subhead font-bold text-text-primary tracking-widest text-xl block mb-md"
              aria-label="Litsaber — go to homepage"
            >
              LITSABER
            </Link>
            <p className="font-body text-body text-text-secondary leading-relaxed mb-lg">
              An interactive glowstick that hits 510 carts. Built for festivals, nightlife, and the moments worth being lit for.
            </p>

            {/* Social icons — shown on both mobile and desktop */}
            <SocialIconRow />

            {/* Made-in tagline — shown on both mobile and desktop */}
            <p className="font-label text-eyebrow text-text-muted tracking-widest uppercase mt-md">
              DESIGNED IN LA | ASSEMBLED IN ASIA
            </p>
          </div>

          {/* Nav columns */}
          <div className="flex flex-col sm:flex-row gap-10 lg:gap-16 lg:flex-1">
            <NavColumn heading="Explore" links={EXPLORE_LINKS} />
            <NavColumn heading="Support" links={SUPPORT_LINKS} />
            <NavColumn heading="Brand" links={BRAND_LINKS} />
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-section-y-mobile lg:mt-xl pt-lg border-t border-surface-tint-white space-y-md">
          {/* Copyright and 21+ disclaimer */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-sm">
            <p className="font-label text-eyebrow text-text-muted tracking-wide">
              © 2026 INNOVAPE CONCEPTS · LOS ANGELES
            </p>
            <p className="font-label text-eyebrow text-text-muted tracking-wide">
              21+ ONLY — DO NOT SHARE WITH MINORS
            </p>
          </div>

          {/* Compliance disclaimer */}
          <p className="font-body text-eyebrow text-text-muted leading-relaxed max-w-2xl">
            Litsaber is a rechargeable 510-thread battery accessory. It does not contain cannabis, CBD, nicotine, or any controlled substance. This site does not sell cartridges, oil, or any cannabis product. Intended for adult use only. Use responsibly and in compliance with all applicable local laws.
          </p>

          {/* Policy links */}
          <div className="flex flex-wrap gap-sm">
            {[
              { label: "Terms of Service", href: "/policies/terms" },
              { label: "Privacy Policy", href: "/policies/privacy" },
              { label: "Shipping Policy", href: "/policies/shipping" },
              { label: "Refund Policy", href: "/policies/refunds" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-label text-eyebrow text-text-muted hover:text-text-secondary transition-colors duration-200 tracking-wide"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Payment / Klarna strip */}
          <div className="flex items-center gap-sm pt-xs">
            <span className="font-label text-eyebrow text-text-muted tracking-wide uppercase">
              Secure Checkout
            </span>
            {/* Authorize.net processes payment via Shopify hosted checkout */}
            <span className="font-label text-eyebrow text-text-muted">·</span>
            <span className="font-label text-eyebrow text-text-muted tracking-wide">
              Authorize.net · Free 14-day returns
            </span>
            {/* Klarna logo slot — add SVG/image when asset is available */}
          </div>
        </div>
      </div>
    </footer>
  );
}

function NavColumn({
  heading,
  links,
}: {
  heading: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div className="min-w-[120px]">
      <h3 className="font-label text-label text-text-primary tracking-widest uppercase mb-md font-bold">
        {heading}
      </h3>
      <ul className="space-y-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="font-body text-label text-text-secondary hover:text-accent-cyan transition-colors duration-200"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIconRow() {
  return (
    <div className="flex items-center gap-md" role="list" aria-label="Social media links">
      <a
        href="https://www.instagram.com/getlitsaber"
        target="_blank"
        rel="noopener noreferrer"
        role="listitem"
        aria-label="Litsaber on Instagram"
        className="text-text-muted hover:text-accent-cyan transition-colors duration-200"
      >
        <InstagramIcon />
      </a>
      <a
        href="https://www.youtube.com/@getlitsaber"
        target="_blank"
        rel="noopener noreferrer"
        role="listitem"
        aria-label="Litsaber on YouTube"
        className="text-text-muted hover:text-accent-cyan transition-colors duration-200"
      >
        <YouTubeIcon />
      </a>
      <a
        href="https://www.tiktok.com/@getlitsaber"
        target="_blank"
        rel="noopener noreferrer"
        role="listitem"
        aria-label="Litsaber on TikTok"
        className="text-text-muted hover:text-accent-cyan transition-colors duration-200"
      >
        <TikTokIcon />
      </a>
    </div>
  );
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="14.5" cy="5.5" r="1" fill="currentColor" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="2" y="4" width="16" height="12" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 7.5l5 2.5-5 2.5V7.5z" fill="currentColor" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M13 2c.3 2 1.5 3.2 3 3.5v2.8c-1.1 0-2.2-.4-3-1v5.2a5 5 0 1 1-3-4.6V11a2.5 2.5 0 1 0 1.5 2.3V2H13z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
