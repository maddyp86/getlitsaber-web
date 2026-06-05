"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useToastActions } from "@/lib/toast/store";
import { CONTACT_METHODS, QUICK_LINKS, type ContactMethod } from "./contact.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function MailIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="#00E5FF" strokeWidth="1.5" />
      <path d="M2 7l10 7 10-7" stroke="#00E5FF" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.5 11.5 0 003.6.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z"
        stroke="#00E5FF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
        stroke="#00E5FF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getIcon(icon: ContactMethod["icon"]) {
  if (icon === "email") return <MailIcon />;
  if (icon === "phone") return <PhoneIcon />;
  return <ChatIcon />;
}

function ContactCard({
  method,
  index,
  onChatClick,
}: {
  method: ContactMethod;
  index: number;
  onChatClick: () => void;
}) {
  const prefersReduced = useReducedMotion();
  const isChat = method.icon === "chat";

  return (
    <motion.div
      className="flex flex-col gap-4 rounded-xl border border-[#1A1035] bg-[#0A0515] p-6 lg:p-8"
      initial={prefersReduced ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: EASE }}
    >
      {/* Icon circle */}
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(0,229,255,0.3)] bg-[rgba(0,229,255,0.05)]">
        {getIcon(method.icon)}
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <p className="font-label text-eyebrow tracking-[0.2em] uppercase text-text-muted text-xs">
            {method.label}
          </p>
          {method.badge && (
            <span className="px-2 py-0.5 rounded-full font-label text-[9px] tracking-[0.12em] uppercase border border-[rgba(255,0,229,0.4)] bg-[rgba(255,0,229,0.1)] text-[#FF00E5]">
              {method.badge}
            </span>
          )}
        </div>

        {isChat ? (
          <button
            onClick={onChatClick}
            className="font-subhead font-bold text-white text-left transition-colors hover:text-accent-cyan"
            style={{ fontSize: "clamp(16px, 1.8vw, 20px)" }}
          >
            {method.label}
          </button>
        ) : (
          <p
            className="font-subhead font-bold text-white"
            style={{ fontSize: "clamp(16px, 1.8vw, 20px)" }}
          >
            {method.value}
          </p>
        )}

        <p className="font-body text-body-sm text-text-secondary leading-relaxed mt-1">
          {method.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function ContactMethods() {
  const prefersReduced = useReducedMotion();
  const { addToast } = useToastActions();

  const handleChatClick = () => {
    addToast({ variant: "success", message: "Coming soon. Drop us an email in the meantime." });
  };

  return (
    <section
      className="relative w-full bg-background-primary"
      aria-label="Contact methods"
    >
      <div className="mx-auto w-full max-w-[1250px] px-[20px] lg:px-[60px] py-[80px]">
        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {CONTACT_METHODS.map((method, i) => (
            <ContactCard
              key={method.label}
              method={method}
              index={i}
              onChatClick={handleChatClick}
            />
          ))}
        </div>

        {/* Quick Links */}
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={prefersReduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <p className="font-label text-eyebrow tracking-[0.2em] uppercase text-text-muted text-xs">
            QUICK LINKS
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {QUICK_LINKS.map((link, i) => (
              <span key={link.href} className="flex items-center gap-6">
                <Link
                  href={link.href}
                  className="font-label text-eyebrow tracking-[0.1em] uppercase text-text-secondary hover:text-accent-cyan transition-colors text-xs"
                >
                  {link.label}
                </Link>
                {i < QUICK_LINKS.length - 1 && (
                  <span className="text-text-muted text-xs hidden sm:inline" aria-hidden="true">
                    ·
                  </span>
                )}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
