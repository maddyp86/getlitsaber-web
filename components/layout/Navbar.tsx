"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import MobileNavDrawer from "./MobileNavDrawer";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop/litsaber-og" },
  { label: "The Tech", href: "/the-tech" },
  { label: "About", href: "/about" },
  { label: "Wholesale", href: "/wholesale" },
] as const;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={[
          "fixed top-0 left-0 right-0 z-navbar h-navbar transition-colors duration-300",
          scrolled ? "bg-background-primary" : "bg-transparent",
        ].join(" ")}
      >
        <div className="mx-auto max-w-container h-full px-container-mobile lg:px-container flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="font-subhead font-bold text-text-primary tracking-widest text-lg shrink-0"
            aria-label="Litsaber — go to homepage"
          >
            LITSABER
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-label text-label text-text-secondary hover:text-accent-cyan transition-colors duration-200 tracking-wider uppercase"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-4">
            {/* User icon */}
            <button
              aria-label="Account"
              className="hidden lg:flex items-center justify-center w-8 h-8 text-text-secondary hover:text-accent-cyan transition-colors duration-200"
            >
              <UserIcon />
            </button>

            {/* Cart icon */}
            <button
              aria-label="Cart — 0 items"
              className="relative flex items-center justify-center w-8 h-8 text-text-secondary hover:text-accent-cyan transition-colors duration-200"
            >
              <CartIcon />
              {/* Cart count badge — wired to cart context in Phase 4 */}
              <span
                className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-accent-cyan text-background-primary font-label font-bold text-[10px] leading-none"
                aria-hidden="true"
              >
                0
              </span>
            </button>

            {/* Hamburger — mobile only */}
            <button
              aria-label="Open navigation menu"
              aria-expanded={drawerOpen}
              aria-controls="mobile-nav-drawer"
              className="lg:hidden flex items-center justify-center w-8 h-8 text-text-primary hover:text-accent-cyan transition-colors duration-200"
              onClick={() => setDrawerOpen(true)}
            >
              <HamburgerIcon />
            </button>
          </div>
        </div>
      </header>

      <MobileNavDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
}

function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3 17c0-3.314 3.134-6 7-6s7 2.686 7 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M2 2h1.5l1.8 9h9.4l1.5-6H5.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="16.5" r="1.5" fill="currentColor" />
      <circle cx="14" cy="16.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
