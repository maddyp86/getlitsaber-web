import { NextRequest, NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]{2,}\.[^\s@]{2,}$/;

const PORTAL_ID = process.env.HUBSPOT_PORTAL_ID ?? "244547358";
// TODO: confirm this form ID in HubSpot portal before going live
const FORM_ID =
  process.env.HUBSPOT_FORM_WHOLESALE ?? "f4b0a43c-c1e0-4452-a5ce-48d36ae56f57";

// number_of_retail_locations + estimated_first_order_size confirmed from
// HubSpot 400 error (2026-06-04). referralSource internal name STILL UNVERIFIED —
// confirm in HubSpot form editor and check a test contact record, or it silently drops.
const CUSTOM_FIELD_MAP: Record<string, string> = {
  retailLocations: "0-2/number_of_retail_locations",
  firstOrderSize: "0-2/estimated_first_order_size",
  referralSource: "how_did_you_hear_about_us_",
};

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

interface WholesalePayload {
  firstname?: unknown;
  lastname?: unknown;
  email?: unknown;
  company?: unknown;
  phone?: unknown;
  state?: unknown;
  retailLocations?: unknown;
  firstOrderSize?: unknown;
  referralSource?: unknown;
  source?: unknown;
  botField?: unknown;
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
    company,
    phone,
    state,
    retailLocations,
    firstOrderSize,
    referralSource,
    source,
    botField,
  } = body as WholesalePayload;

  // Honeypot: bots fill this field, humans never see it.
  if (typeof botField === "string" && botField.length > 0) {
    return NextResponse.json({ ok: true });
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
  if (typeof company !== "string" || company.trim().length === 0) {
    return NextResponse.json(
      { ok: false, error: "Company name is required" },
      { status: 400 }
    );
  }
  if (typeof state !== "string" || state.trim().length === 0) {
    return NextResponse.json(
      { ok: false, error: "State/region is required" },
      { status: 400 }
    );
  }
  if (typeof retailLocations !== "string" || retailLocations.trim().length === 0) {
    return NextResponse.json(
      { ok: false, error: "Number of retail locations is required" },
      { status: 400 }
    );
  }
  if (typeof firstOrderSize !== "string" || firstOrderSize.trim().length === 0) {
    return NextResponse.json(
      { ok: false, error: "Estimated first order size is required" },
      { status: 400 }
    );
  }

  const fields: { name: string; value: string }[] = [
    { name: "firstname", value: String(firstname).trim() },
    { name: "lastname", value: String(lastname).trim() },
    { name: "email", value: String(email).trim() },
    { name: "company", value: String(company).trim() },
    { name: "state", value: String(state).trim() },
    { name: CUSTOM_FIELD_MAP.retailLocations, value: String(retailLocations).trim() },
    { name: CUSTOM_FIELD_MAP.firstOrderSize, value: String(firstOrderSize).trim() },
  ];

  if (typeof phone === "string" && phone.trim().length > 0) {
    fields.push({ name: "phone", value: phone.trim() });
  }
  if (typeof referralSource === "string" && referralSource.trim().length > 0) {
    fields.push({
      name: CUSTOM_FIELD_MAP.referralSource,
      value: referralSource.trim(),
    });
  }

  const pageName =
    typeof source === "string" && source.length > 0 ? source : "wholesale-apply";

  const hsUrl = `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_ID}`;

  let hsRes: Response;
  try {
    hsRes = await fetch(hsUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields,
        context: {
          pageUri: "https://getlitsaber.com/wholesale",
          pageName,
        },
      }),
    });
  } catch (err) {
    console.error("[wholesale] Network error reaching HubSpot:", err);
    return NextResponse.json(
      { ok: false, error: "Submission failed. Please try again." },
      { status: 502 }
    );
  }

  if (!hsRes.ok) {
    const text = await hsRes.text().catch(() => "(no body)");
    console.error(`[wholesale] HubSpot responded ${hsRes.status}:`, text);
    return NextResponse.json(
      { ok: false, error: "Submission failed. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}