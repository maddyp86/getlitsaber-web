"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { mediaUrl } from "@/lib/media";

interface MobileNavDrawerProps {
  open: boolean;
  onClose: () => void;
}

const PRIMARY_NAV = [
  { label: "Home", href: "/", hasSubmenu: false },
  { label: "Shop", href: "/shop/litsaber-og", hasSubmenu: true },
  { label: "The Tech", href: "/the-tech", hasSubmenu: true },
  { label: "About", href: "/about", hasSubmenu: false },
  { label: "Wholesale", href: "/wholesale", hasSubmenu: false },
] as const;

const QUICK_LINKS = [
  { label: "FAQs", href: "/contact#faq" },
  { label: "Contact Us", href: "/contact" },
  { label: "Track Your Order", href: "/contact#track" },
  { label: "Start a Return", href: "/policies/refunds" },
] as const;

const ACCOUNT_URL =
  process.env.NEXT_PUBLIC_ACCOUNT_URL ?? "https://shopify.com/65425866959/account";

export default function MobileNavDrawer({ open, onClose }: MobileNavDrawerProps) {
  const [quickLinksOpen, setQuickLinksOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      document.body.classList.add("scroll-locked");
      closeButtonRef.current?.focus();
    } else {
      document.body.classList.remove("scroll-locked");
      setQuickLinksOpen(false);
    }
    return () => {
      document.body.classList.remove("scroll-locked");
    };
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={[
          "fixed inset-0 bg-background-overlay transition-opacity duration-300 z-drawer lg:hidden",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        id="mobile-nav-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={[
          "fixed inset-0 z-drawer bg-[#000000] flex flex-col lg:hidden",
          "transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-container-mobile h-navbar border-b border-surface-tint-white">
          <Link
            href="/"
            onClick={onClose}
            aria-label="Litsaber — go to homepage"
          >
            <Image
              src={mediaUrl("global/litsaber-logo-white-cyan.png")}
              alt="Litsaber"
              width={140}
              height={40}
              style={{ width: "clamp(130px, 12vw, 200px)", height: "auto" }}
            />
          </Link>
          <button
            ref={closeButtonRef}
            aria-label="Close navigation menu"
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 text-text-primary hover:text-accent-cyan transition-colors duration-200"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-container-mobile pt-sm pb-lg">
          {/* Primary nav */}
          <nav aria-label="Main navigation">
            <ul className="space-y-0">
              {PRIMARY_NAV.map((item) => (
                <li key={item.href} className="border-b border-surface-tint-white">
                  <div className="flex items-center justify-between py-md">
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="font-subhead text-lg font-bold text-text-primary hover:text-accent-cyan transition-colors duration-200 tracking-wider uppercase"
                    >
                      {item.label}
                    </Link>
                    {item.hasSubmenu && (
                      <ChevronRightIcon className="text-text-muted" />
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </nav>

          {/* Quick Links expandable section */}
          <div className="mt-2">
            <button
              aria-expanded={quickLinksOpen}
              aria-controls="quick-links-panel"
              onClick={() => setQuickLinksOpen((v) => !v)}
              className="flex items-center justify-between w-full py-sm text-left"
            >
              <span className="font-subhead text-lg font-bold text-text-primary hover:text-accent-cyan transition-colors duration-200 tracking-wider uppercase">
                Quick Links
              </span>
              <ChevronDownIcon
                className={[
                  "text-text-muted transition-transform duration-200",
                  quickLinksOpen ? "rotate-180" : "",
                ].join(" ")}
              />
            </button>

            <div
              id="quick-links-panel"
              className={[
                "overflow-hidden transition-all duration-300",
                quickLinksOpen ? "max-h-60" : "max-h-0",
              ].join(" ")}
            >
              <ul className="py-sm space-y-sm pl-md">
                {QUICK_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="font-label text-label text-text-secondary hover:text-accent-cyan transition-colors duration-200 tracking-wide"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Drawer footer */}
        <div className="px-container-mobile py-lg border-t border-surface-tint-white space-y-sm">
          <Link
            href="/shop/litsaber-og"
            onClick={onClose}
            className="block w-full py-md text-center font-label text-label tracking-widest uppercase border border-accent-cyan text-accent-cyan bg-accent-cyan-alpha-10 rounded-md hover:bg-accent-cyan hover:text-background-primary transition-colors duration-200"
          >
            GET YOURS — $59.99
          </Link>
          <a
            href={ACCOUNT_URL}
            onClick={onClose}
            className="block w-full py-xs text-center font-label text-eyebrow tracking-widest uppercase text-text-muted hover:text-text-secondary transition-colors duration-200"
          >
            LOGIN TO YOUR ACCOUNT
          </a>
        </div>
      </div>
    </>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ChevronRightIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path d="M7 5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDownIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path d="M5 7l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
