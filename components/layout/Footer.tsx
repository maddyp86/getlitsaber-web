import Link from "next/link";
import Image from "next/image";

const EXPLORE_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop Litsaber", href: "/shop/litsaber-og" },
  { label: "Wholesale", href: "/wholesale" },
] as const;

const SUPPORT_LINKS = [
  { label: "Contact Us", href: "/contact" },
  { label: "Shipping & Returns", href: "/policies/shipping-returns" },
  { label: "Warranty", href: "/policies/warranty" },
] as const;

const BRAND_LINKS = [
  { label: "About", href: "/about" },
  { label: "The Tech", href: "/the-tech" },
  { label: "Activate", href: "/activate" },
] as const;

export default function Footer() {
  return (
    <footer className="bg-background-primary"
      style={{ background: "linear-gradient(180deg, #150C2D 0%, #000 100%)" }}
      >
      <div aria-hidden="true" style={{ background: "linear-gradient(90deg, #150C2D 0%, #00E5FF 48.08%, #150C2D 100%)", height: "1px" }} />
     <div className="mx-auto max-w-content px-content py-10 lg:py-16">
        {/* Top section */}
        <div className="flex flex-col lg:flex-row lg:justify-between gap-10">
          {/* Brand column */}
          <div className="lg:max-w-[500px] shrink-0">
            <Link
              href="/"
              className="block mb-md"
              aria-label="Litsaber — go to homepage"
            >
              <Image
                src="/images/global/litsaber-logo-white-cyan.png"
                alt="Litsaber"
                width={140}
                height={40}
                className="h-8 w-auto"
              />
            </Link>
            <p className="font-body text-body-sm sm:text-body lg:text-[18px] text-text-secondary leading-relaxed mb-lg">
              An interactive glowstick that hits 510 carts. Built for festivals, nightlife, and the moments worth being lit for.
            </p>

            <SocialIconRow />

            <p className="font-label text-eyebrow text-accent-cyan tracking-widest uppercase mt-md">
              DESIGNED IN LA | ASSEMBLED IN ASIA
            </p>
          </div>

          {/* Nav columns */}
          <div className="flex flex-col md:flex-row gap-5 md:gap-8">
            <NavColumn heading="Explore" links={EXPLORE_LINKS} />
            <NavColumn heading="Support" links={SUPPORT_LINKS} />
            <NavColumn heading="Brand" links={BRAND_LINKS} />
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-section-y-mobile lg:mt-xl border-t border-surface-tint-white pt-lg space-y-lg">
          {/* Compliance disclaimer */}
          <p className="font-body text-[11px] sm:text-eyebrow text-text-muted leading-relaxed text-center">
            Litsaber is sold as a 510-thread battery accessory. We do not produce, manufacture, or distribute cannabis. The device is not intended for use with nicotine, e-juice, or e-liquids. Not for sale to minors. Use responsibly and in accordance with local laws.
          </p>

          {/* Payment badges */}
          <div className="flex items-center justify-center gap-sm flex-wrap">
            <MastercardBadge />
            <VisaBadge />
            <AmexBadge />
            <DiscoverBadge />
          </div>

          {/* Divider */}
          <div className="border-t border-surface-tint-white" />

          {/* Copyright + policy links */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-sm">
            <p className="font-label text-[12px] sm:text-[14px] text-text-muted tracking-wide text-center sm:text-left">
              © 2026 INNOVAPE CONCEPTS · LOS ANGELES
            </p>
            <div className="flex items-center justify-center gap-xs flex-wrap">
              {[
                { label: "PRIVACY", href: "/policies/privacy" },
                { label: "TERMS", href: "/policies/terms" },
              ].map((link, i, arr) => (
                <span key={link.href} className="flex items-center gap-xs">
                  <Link
                    href={link.href}
                    className="font-label text-[12px] sm:text-[14px] text-text-muted hover:text-text-accent transition-colors duration-200 tracking-widest"
                  >
                    {link.label}
                  </Link>
                  {i < arr.length - 1 && (
                    <span className="font-label text-eyebrow text-text-muted select-none">·</span>
                  )}
                </span>
              ))}
            </div>
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
      <h3 className="font-label text-label text-accent-cyan tracking-widest uppercase mb-md font-bold">
        {heading}
      </h3>
      <ul className="space-y-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="font-body text-body-sm sm:text-label text-text-secondary hover:text-accent-cyan transition-colors duration-200"
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
    <div className="flex items-center gap-sm" role="list" aria-label="Social media links">
      
        href="https://www.instagram.com/getlitsaber"
        target="_blank"
        rel="noopener noreferrer"
        role="listitem"
        aria-label="Litsaber on Instagram"
        className="flex items-center justify-center w-10 h-10 border border-surface-tint-white text-text-secondary hover:border-accent-cyan hover:text-accent-cyan transition-colors duration-200"
      >
        <InstagramIcon />
      </a>
      
        href="https://www.youtube.com/@getlitsaber"
        target="_blank"
        rel="noopener noreferrer"
        role="listitem"
        aria-label="Litsaber on YouTube"
        className="flex items-center justify-center w-10 h-10 border border-surface-tint-white text-text-secondary hover:border-accent-cyan hover:text-accent-cyan transition-colors duration-200"
      >
        <YouTubeIcon />
      </a>
      
        href="https://www.tiktok.com/@getlitsaber"
        target="_blank"
        rel="noopener noreferrer"
        role="listitem"
        aria-label="Litsaber on TikTok"
        className="flex items-center justify-center w-10 h-10 border border-surface-tint-white text-text-secondary hover:border-accent-cyan hover:text-accent-cyan transition-colors duration-200"
      >
        <TikTokIcon />
      </a>
    </div>
  );
}