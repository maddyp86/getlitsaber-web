// Attribution and privacy rules applied to every PostHog event and to the
// cart attributes the orders webhook reads (roadmap Phase 6). Pure functions
// plus thin storage helpers, so they are unit-testable without PostHog.
//
//  - getlitsaber.com and checkout.getlitsaber.com are one site. A visit that
//    arrives from our own checkout is a return, not a new referral, so the
//    original source (stored on the first external touch) carries through.
//  - Personal data never goes to PostHog: query parameters that can carry it
//    are stripped from every URL property before an event is sent.
//  - Owner visits (packaging QR, activation and rebate pages) are marked with
//    is_owner_visit for the rest of the browser session.
//  - Internal and test browsers are remembered so their carts and orders can
//    be marked internal too.

const OWN_DOMAIN = /(^|\.)getlitsaber\.com$/i;
// Shopify-hosted checkout and Shop Pay redirect hops can also be the referrer
// on the way back to the storefront.
const CHECKOUT_DOMAINS = /(^|\.)(myshopify\.com|shopify\.com|shop\.app)$/i;

export function isOwnSiteHost(host: string): boolean {
  const h = host.replace(/^www\./i, "").toLowerCase();
  return OWN_DOMAIN.test(h) || CHECKOUT_DOMAINS.test(h);
}

export function hostOf(url: string): string | null {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

/** True when a referrer is our own storefront or checkout (or absent). */
export function isInternalReferrer(referrer: string): boolean {
  if (!referrer || referrer === "$direct") return false;
  const host = hostOf(referrer);
  return host !== null && isOwnSiteHost(host);
}

// ---------------------------------------------------------------------------
// Personal data in URLs
// ---------------------------------------------------------------------------

const PII_PARAMS = new Set([
  "email", "e", "mail", "phone", "tel", "name", "firstname", "first_name",
  "lastname", "last_name", "fullname", "full_name", "address", "address1",
  "address2", "zip", "postal_code", "customer_email", "checkout[email]",
]);

/** Removes query parameters that can carry names, emails, phones or addresses. */
export function scrubUrl(value: string): string {
  if (!value || !/[?&]/.test(value)) return value;
  try {
    const url = new URL(value);
    let changed = false;
    for (const key of Array.from(url.searchParams.keys())) {
      if (PII_PARAMS.has(key.toLowerCase())) {
        url.searchParams.delete(key);
        changed = true;
      }
    }
    // Any remaining value that looks like an email address goes too.
    for (const [key, v] of Array.from(url.searchParams.entries())) {
      if (/[^\s@]+@[^\s@]+\.[^\s@]+/.test(v)) {
        url.searchParams.delete(key);
        changed = true;
      }
    }
    return changed ? url.toString() : value;
  } catch {
    return value;
  }
}

const URL_PROPERTIES = [
  "$current_url", "$referrer", "$initial_current_url", "$initial_referrer",
  "$session_entry_url", "$session_entry_referrer", "$prev_pageview_url",
];

type Props = Record<string, unknown>;

function scrubUrlProps(props: Props | undefined): void {
  if (!props) return;
  for (const key of URL_PROPERTIES) {
    const v = props[key];
    if (typeof v === "string") props[key] = scrubUrl(v);
  }
}

// ---------------------------------------------------------------------------
// First external touch
// ---------------------------------------------------------------------------

export interface Touch {
  referrer: string;
  referring_domain: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  at: number;
}

const TOUCH_KEY = "litsaber_touch";
const TOUCH_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function utmFrom(search: string) {
  const p = new URLSearchParams(search);
  return {
    utm_source: p.get("utm_source") ?? "",
    utm_medium: p.get("utm_medium") ?? "",
    utm_campaign: p.get("utm_campaign") ?? "",
  };
}

/** The touch this landing represents, or null if it is internal or direct with no UTMs. */
export function touchFromLanding(search: string, referrer: string, now: number): Touch | null {
  const utm = utmFrom(search);
  const external = !!referrer && !isInternalReferrer(referrer);
  if (!utm.utm_source && !utm.utm_medium && !utm.utm_campaign && !external) return null;
  const ref = external ? scrubUrl(referrer) : "";
  return { referrer: ref, referring_domain: (ref && hostOf(ref)) || "", ...utm, at: now };
}

export function readTouch(now: number = Date.now()): Touch | null {
  try {
    const raw = localStorage.getItem(TOUCH_KEY);
    if (!raw) return null;
    const t = JSON.parse(raw) as Touch;
    return now - t.at < TOUCH_TTL_MS ? t : null;
  } catch {
    return null;
  }
}

/** Store this landing's external touch, if it has one. Last external touch wins. */
export function rememberLandingTouch(): void {
  try {
    const t = touchFromLanding(window.location.search, document.referrer, Date.now());
    if (t) localStorage.setItem(TOUCH_KEY, JSON.stringify(t));
  } catch {
    // storage unavailable: attribution falls back to this page's own referrer
  }
}

// ---------------------------------------------------------------------------
// Owner and internal markers
// ---------------------------------------------------------------------------

/** Pages only device owners reach (QR-scanned from the box and insert). */
export const OWNER_PATHS = ["/activate", "/show-it-off"];
const OWNER_KEY = "litsaber_owner_visit";
const INTERNAL_KEY = "litsaber_internal";

/** True for the rest of the browser session once an owner page was visited. */
export function isOwnerVisit(pathname: string): boolean {
  try {
    if (OWNER_PATHS.includes(pathname)) {
      sessionStorage.setItem(OWNER_KEY, "1");
      return true;
    }
    return sessionStorage.getItem(OWNER_KEY) === "1";
  } catch {
    return OWNER_PATHS.includes(pathname);
  }
}

/**
 * Where an owner visit came from. Printed codes in circulation use
 * utm_source=packaging (box) or utm_source=insert (card), both utm_medium=qr,
 * with differing campaigns; the short links in next.config.mjs (/qr/box,
 * /qr/insert, /qr/rebate) are the consistent tags for future print runs.
 */
export function activationSource(search: string): "packaging_qr" | "insert_qr" | "direct" {
  const p = new URLSearchParams(search);
  const source = (p.get("utm_source") ?? "").toLowerCase();
  if (source === "packaging") return "packaging_qr";
  if (source === "insert") return "insert_qr";
  return "direct";
}

export const INTERNAL_HOSTNAME = /^(localhost|127\.0\.0\.1|.*\.vercel\.app)$/;

export function setInternalBrowser(on: boolean): void {
  try {
    if (on) localStorage.setItem(INTERNAL_KEY, "1");
    else localStorage.removeItem(INTERNAL_KEY);
  } catch {}
}

/** Internal or test browser: a preview/dev host, or flagged with ?internal=<token>. */
export function isInternalBrowser(hostname: string): boolean {
  if (INTERNAL_HOSTNAME.test(hostname)) return true;
  try {
    return localStorage.getItem(INTERNAL_KEY) === "1";
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// The PostHog before_send step
// ---------------------------------------------------------------------------

interface EventLike {
  event: string;
  properties?: Props;
  $set?: Props;
  $set_once?: Props;
}

/**
 * Applied to every outgoing event: strip personal data from URLs, treat a
 * referral from our own checkout as a return (carrying the stored original
 * source), and mark owner visits.
 */
export function applyAttributionRules<T extends EventLike>(event: T, pathname: string, touch: Touch | null): T {
  const props = (event.properties ??= {});
  scrubUrlProps(props);
  scrubUrlProps(event.$set);
  scrubUrlProps(event.$set_once);
  scrubUrlProps(props.$set as Props | undefined);
  scrubUrlProps(props.$set_once as Props | undefined);

  const ref = typeof props.$referrer === "string" ? props.$referrer : "";
  if (isInternalReferrer(ref)) {
    props.$referrer = touch?.referrer || "$direct";
    props.$referring_domain = touch?.referring_domain || "$direct";
    for (const key of ["utm_source", "utm_medium", "utm_campaign"] as const) {
      if (touch?.[key] && !props[key]) props[key] = touch[key];
    }
  }

  for (const once of [event.$set_once, props.$set_once as Props | undefined]) {
    const initial = once && typeof once.$initial_referrer === "string" ? once.$initial_referrer : "";
    if (once && isInternalReferrer(initial)) {
      once.$initial_referrer = touch?.referrer || "$direct";
      once.$initial_referring_domain = touch?.referring_domain || "$direct";
    }
  }

  if (isOwnerVisit(pathname)) props.is_owner_visit = true;
  return event;
}
