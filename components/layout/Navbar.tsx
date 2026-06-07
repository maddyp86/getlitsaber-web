"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import MobileNavDrawer from "./MobileNavDrawer";
import { useItemCount } from "@/lib/cart/store";
import { useCartUIActions } from "@/lib/ui/store";

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
  const [mounted, setMounted] = useState(false);
  const itemCount = useItemCount();
  const { openCart } = useCartUIActions();

  useEffect(() => {
    setMounted(true);
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
<div className="mx-auto w-full max-w-content h-full px-content flex items-center">

          {/* ── Mobile: three-column grid ── Desktop: standard flex row ── */}

          {/* Left zone — hamburger/close (mobile) | empty spacer (desktop, handled by nav below) */}
          <div className="flex items-center lg:hidden w-8">
            <button
              aria-label={drawerOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={drawerOpen}
              aria-controls="mobile-nav-drawer"
              className="flex items-center justify-center w-8 h-8 text-text-primary hover:text-accent-cyan transition-colors duration-200"
              onClick={() => setDrawerOpen(!drawerOpen)}
            >
              {drawerOpen ? <CloseIcon /> : <HamburgerIcon />}
            </button>
          </div>

          {/* Logo — centered on mobile via flex-1 + flex justify-center; fixed width on desktop to balance right icons zone */}
          <div className="flex-1 lg:flex-none lg:w-60 flex items-center lg:justify-start justify-center">
            <Link
              href="/"
              className="shrink-0"
              aria-label="Litsaber — go to homepage"
            >
              <Image
                src="/images/global/litsaber-logo-white-cyan.png"
                alt="Litsaber"
                width={140}
                height={40}
                style={{ width: "clamp(130px, 14vw, 200px)", height: "auto" }}
                priority
              />
            </Link>
          </div>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-8 mx-auto" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-label text-text-secondary hover:text-accent-cyan transition-colors duration-200 tracking-wider uppercase"
                style={{ fontSize: "clamp(18px, 1.4vw, 22px)" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right icons — user (desktop only) + cart + hamburger spacer balance */}
          <div className="flex items-center justify-end gap-1 lg:w-40">
            {/* User icon — desktop only */}
            <button
              aria-label="Account"
              className="hidden lg:flex items-center justify-center w-8 h-8 text-text-secondary hover:text-accent-cyan transition-colors duration-200"
            >
              <UserIcon />
            </button>

            {/* User icon — mobile only */}
            <button
              aria-label="Account"
              className="flex lg:hidden items-center justify-center w-8 h-8 text-text-secondary hover:text-accent-cyan transition-colors duration-200"
            >
              <UserIcon />
            </button>

            {/* Cart icon */}
            <button
              aria-label={mounted && itemCount > 0 ? `Cart — ${itemCount} item${itemCount === 1 ? "" : "s"}` : "Cart"}
              onClick={openCart}
              className="relative flex items-center justify-center w-8 h-8 text-text-secondary hover:text-accent-cyan transition-colors duration-200"
            >
              <CartIcon />
              {mounted && itemCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-cta text-text-primary font-label font-bold text-[10px] leading-none"
                  aria-hidden="true"
                >
                  {itemCount}
                </span>
              )}
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
    <svg width="18" height="20" viewBox="0 0 28 32" fill="none" aria-hidden="true">
      <path
        d="M7.78253 10.5774V6.70645C7.78253 5.16649 8.39038 3.68959 9.47232 2.60067C10.5543 1.51175 12.0217 0.900002 13.5518 0.900002C15.0819 0.900002 16.5493 1.51175 17.6312 2.60067C18.7131 3.68959 19.321 5.16649 19.321 6.70645V10.5774M1.05176 10.5774H26.0518L23.1671 28.9645C23.1671 29.4778 22.9645 29.9701 22.6039 30.3331C22.2432 30.6961 21.7541 30.9 21.2441 30.9H5.85945C5.34942 30.9 4.8603 30.6961 4.49966 30.3331C4.13901 29.9701 3.93637 29.4778 3.93637 28.9645L1.05176 10.5774Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
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

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M4 4l14 14M18 4L4 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
