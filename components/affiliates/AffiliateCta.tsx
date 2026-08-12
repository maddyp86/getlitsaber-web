import { SIGNUP_URL } from "./affiliates.content";

const BASE =
  "inline-flex items-center justify-center gap-[10px] rounded-selector font-label font-bold text-eyebrow uppercase tracking-wider p-5 transition-all duration-200 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-accent-cyan-alpha-50";

const VARIANTS = {
  // The money button. Pink CTA token, glow powers up on hover.
  cta:
    "border border-border-cta bg-cta-alpha-10 text-cta shadow-glow-cta hover:shadow-glow-cta-hover hover:-translate-y-px active:translate-y-px",
  // Secondary route into the portal for existing affiliates.
  outline:
    "border border-border-accent bg-transparent text-accent-cyan hover:bg-accent-cyan hover:text-background-primary",
} as const;

interface AffiliateCtaProps {
  href?: string;
  children: React.ReactNode;
  variant?: keyof typeof VARIANTS;
  withArrow?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export default function AffiliateCta({
  href = SIGNUP_URL,
  children,
  variant = "cta",
  withArrow = false,
  fullWidth = false,
  className = "",
}: AffiliateCtaProps) {
  return (
    <a
      href={href}
      className={[
        BASE,
        VARIANTS[variant],
        fullWidth ? "w-full" : "w-full sm:w-auto sm:min-w-[240px]",
        className,
      ].join(" ")}
    >
      {children}
      {withArrow && (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          className="shrink-0"
          aria-hidden="true"
        >
          <path
            d="M5 12h14M13 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </a>
  );
}
