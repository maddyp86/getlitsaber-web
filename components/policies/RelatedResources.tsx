import Link from "next/link";
import { RELATED_RESOURCES } from "./shared";

function MailIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 8l10 7 10-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function FaqIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M9.5 9.5C9.5 8.12 10.62 7 12 7s2.5 1.12 2.5 2.5c0 1.38-1 2.14-1.8 2.7-.55.38-.7.6-.7 1.3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="17" r="0.75" fill="currentColor" />
    </svg>
  );
}

function ActivateIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M13 2L4 14h8l-1 8 9-12h-8l1-8z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const ICONS = {
  mail: MailIcon,
  faq: FaqIcon,
  activate: ActivateIcon,
} as const;

export default function RelatedResources() {
  return (
    <section
      className="border-t border-surface-tint-white"
      style={{ background: "linear-gradient(180deg, #0A0518 0%, #150C2D 100%)" }}
      aria-label="Related resources"
    >
      <div className="mx-auto w-full max-w-content px-content py-16 lg:py-24">
        <p className="font-label text-eyebrow text-accent-cyan uppercase tracking-widest mb-4">
          RELATED RESOURCES
        </p>
        <h2
          className="font-display font-bold uppercase text-text-primary mb-10 lg:mb-14"
          style={{ fontSize: "clamp(32px, 3.5vw, 52px)" }}
        >
          NEED MORE HELP?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-8">
          {RELATED_RESOURCES.map((resource) => {
            const Icon = ICONS[resource.icon];
            return (
              <Link
                key={resource.label}
                href={resource.href}
                className="group flex flex-col gap-4 rounded-xl border border-border-default hover:border-accent-cyan bg-surface-card p-6 lg:p-8 transition-colors duration-200"
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full text-accent-cyan"
                  style={{
                    border: "1px solid rgba(0,229,255,0.3)",
                    background: "rgba(0,229,255,0.05)",
                  }}
                >
                  <Icon />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-label font-bold text-label uppercase tracking-widest text-text-primary group-hover:text-accent-cyan transition-colors duration-200">
                    {resource.label}
                  </h3>
                  <p className="font-body text-body-sm text-text-secondary leading-relaxed">
                    {resource.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
