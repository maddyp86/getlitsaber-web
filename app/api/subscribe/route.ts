import { NextRequest, NextResponse } from "next/server";
import { verifyTurnstile } from "@/lib/security/turnstile";

const EMAIL_RE = /^[^\s@]+@[^\s@]{2,}\.[^\s@]{2,}$/;

const TYPO_DOMAINS = new Set([
  "gmai.com", "gmial.com", "gamil.com", "gmail.co", "gnail.com",
  "yaho.com", "yahooo.com",
  "hotmal.com", "hotmial.com",
  "outlok.com", "outook.com",
  "iclod.com",
]);

function isTypoDomain(email: string): boolean {
  const at = email.lastIndexOf("@");
  if (at === -1) return false;
  return TYPO_DOMAINS.has(email.slice(at + 1).toLowerCase());
}

const PORTAL_ID =
  process.env.HUBSPOT_PORTAL_ID ?? "244547358";

const FORM_IDS: Record<"gold" | "general", string> = {
  gold:    process.env.HUBSPOT_FORM_GOLD    ?? "d499701a-eb43-4c0e-a6cd-b56a57a98433",
  general: process.env.HUBSPOT_FORM_GENERAL ?? "2a41aa81-1b55-4bcd-97e5-b2b3fe23ee69",
};

// In-memory rate limiter. State is per-instance and does not survive cold
// starts. On Vercel's serverless tier, multiple concurrent instances each
// maintain their own map, so a bot hitting different instances could exceed
// the limit. Upgrade to Upstash Redis for multi-instance safety if abuse appears.
const RATE_LIMIT = 5;
const WINDOW_MS = 60_000;

interface RateEntry { count: number; windowStart: number }
const rateMap = new Map<string, RateEntry>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    rateMap.set(ip, { count: 1, windowStart: now });
    return false;
  }

  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

function getClientIp(req: NextRequest): string {
  // Vercel sets x-forwarded-for on every request; take the first (client) IP.
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again shortly." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("email" in body) ||
    !("list" in body)
  ) {
    return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
  }

  const { email, list, source, company, turnstileToken } = body as {
    email: unknown;
    list: unknown;
    source?: unknown;
    company?: unknown;
    turnstileToken?: unknown;
  };

  // Honeypot: bots fill this field, humans never see it. Silently succeed so
  // the bot doesn't learn it was caught.
  if (typeof company === "string" && company.length > 0) {
    return NextResponse.json({ ok: true });
  }

  // Cloudflare Turnstile — verify before any downstream work.
  const captchaOk = await verifyTurnstile(turnstileToken, ip);
  if (!captchaOk) {
    return NextResponse.json(
      { ok: false, error: "Verification failed. Please try again." },
      { status: 403 }
    );
  }

  if (typeof email !== "string" || !EMAIL_RE.test(email) || isTypoDomain(email)) {
    return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
  }

  if (list !== "gold" && list !== "general") {
    return NextResponse.json({ ok: false, error: "Invalid list" }, { status: 400 });
  }

  const formId = FORM_IDS[list];
  const pageName =
    typeof source === "string" && source.length > 0
      ? source
      : list === "gold"
      ? "gold-waitlist"
      : "general-signup";

  const hsUrl = `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${formId}`;

  let hsRes: Response;
  try {
    hsRes = await fetch(hsUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: [{ name: "email", value: email }],
        context: { pageName },
      }),
    });
  } catch (err) {
    console.error("[subscribe] Network error reaching HubSpot:", err);
    return NextResponse.json({ ok: false, error: "Submission failed" }, { status: 502 });
  }

  if (!hsRes.ok) {
    const text = await hsRes.text().catch(() => "(no body)");
    console.error(`[subscribe] HubSpot responded ${hsRes.status}:`, text);
    return NextResponse.json({ ok: false, error: "Submission failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
