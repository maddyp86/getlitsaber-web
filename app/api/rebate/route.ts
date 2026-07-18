import { NextRequest, NextResponse } from "next/server";
import { verifyTurnstile } from "@/lib/security/turnstile";

const EMAIL_RE = /^[^\s@]+@[^\s@]{2,}\.[^\s@]{2,}$/;

const PORTAL_ID = process.env.HUBSPOT_PORTAL_ID ?? "244547358";
// Rebate form — created in HubSpot 2026-07-17 (portal 244547358, region na2).
const FORM_ID =
  process.env.HUBSPOT_FORM_REBATE ?? "44b281f3-f679-4531-967b-9d9a70062d08";

// firstname / lastname / email are standard HubSpot contact properties.
// The three below are CUSTOM contact properties — their internal names must
// match HubSpot exactly or the v3 submit rejects the WHOLE payload with a 400.
// Confirmed against the HubSpot rebate form (Matt, 2026-07-17). Env-overridable.
const ORDER_NUMBER_FIELD =
  process.env.HUBSPOT_REBATE_ORDER_FIELD ?? "order_number";
const PLATFORM_FIELD =
  process.env.HUBSPOT_REBATE_PLATFORM_FIELD ?? "social_media_platform";
const POST_URL_FIELD =
  process.env.HUBSPOT_REBATE_POST_URL_FIELD ?? "add_link";

const RATE_LIMIT = 5;
const WINDOW_MS = 60_000;

interface RateEntry {
  count: number;
  windowStart: number;
}
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
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}

interface RebatePayload {
  firstname?: unknown;
  lastname?: unknown;
  email?: unknown;
  orderNumber?: unknown;
  platform?: unknown;
  postUrl?: unknown;
  source?: unknown;
  botField?: unknown;
  turnstileToken?: unknown;
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
    return NextResponse.json(
      { ok: false, error: "Invalid request body" },
      { status: 400 }
    );
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json(
      { ok: false, error: "Invalid request body" },
      { status: 400 }
    );
  }

  const {
    firstname,
    lastname,
    email,
    orderNumber,
    platform,
    postUrl,
    source,
    botField,
    turnstileToken,
  } = body as RebatePayload;

  // Honeypot: bots fill this field, humans never see it.
  if (typeof botField === "string" && botField.length > 0) {
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

  // Required field validation
  if (typeof firstname !== "string" || firstname.trim().length === 0) {
    return NextResponse.json(
      { ok: false, error: "First name is required" },
      { status: 400 }
    );
  }
  if (typeof lastname !== "string" || lastname.trim().length === 0) {
    return NextResponse.json(
      { ok: false, error: "Last name is required" },
      { status: 400 }
    );
  }
  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "A valid email address is required" },
      { status: 400 }
    );
  }
  if (typeof orderNumber !== "string" || orderNumber.trim().length === 0) {
    return NextResponse.json(
      { ok: false, error: "Order number is required" },
      { status: 400 }
    );
  }
  if (typeof platform !== "string" || platform.trim().length === 0) {
    return NextResponse.json(
      { ok: false, error: "Social platform is required" },
      { status: 400 }
    );
  }
  if (typeof postUrl !== "string" || !/^https?:\/\//i.test(postUrl.trim())) {
    return NextResponse.json(
      { ok: false, error: "A valid link to your post is required" },
      { status: 400 }
    );
  }

  const fields: { name: string; value: string }[] = [
    { name: "firstname", value: String(firstname).trim() },
    { name: "lastname", value: String(lastname).trim() },
    { name: "email", value: String(email).trim() },
    { name: ORDER_NUMBER_FIELD, value: String(orderNumber).trim() },
    { name: PLATFORM_FIELD, value: String(platform).trim() },
    { name: POST_URL_FIELD, value: String(postUrl).trim() },
  ];

  const pageName =
    typeof source === "string" && source.length > 0 ? source : "rebate-page";

  const hsUrl = `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_ID}`;

  let hsRes: Response;
  try {
    hsRes = await fetch(hsUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields,
        context: {
          pageUri: "https://getlitsaber.com/show-it-off",
          pageName,
        },
      }),
    });
  } catch (err) {
    console.error("[rebate] Network error reaching HubSpot:", err);
    return NextResponse.json(
      { ok: false, error: "Submission failed. Please try again." },
      { status: 502 }
    );
  }

  if (!hsRes.ok) {
    const text = await hsRes.text().catch(() => "(no body)");
    console.error(`[rebate] HubSpot responded ${hsRes.status}:`, text);
    return NextResponse.json(
      { ok: false, error: "Submission failed. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
