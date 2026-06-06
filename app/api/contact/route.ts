import { NextRequest, NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]{2,}\.[^\s@]{2,}$/;

const PORTAL_ID = process.env.HUBSPOT_PORTAL_ID ?? "244547358";
const FORM_ID = process.env.HUBSPOT_FORM_CONTACT ?? "fb0f6c82-3f57-405e-a655-a722321fd93f";

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

interface ContactPayload {
  firstname?: unknown;
  lastname?: unknown;
  email?: unknown;
  reason?: unknown;
  company?: unknown;
  phone?: unknown;
  message?: unknown;
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

  const { firstname, lastname, email, reason, company, phone, message, source, botField } =
    body as ContactPayload;

  // Honeypot
  if (typeof botField === "string" && botField.length > 0) {
    return NextResponse.json({ ok: true });
  }

  if (typeof firstname !== "string" || firstname.trim().length === 0) {
    return NextResponse.json({ ok: false, error: "First name is required" }, { status: 400 });
  }
  if (typeof lastname !== "string" || lastname.trim().length === 0) {
    return NextResponse.json({ ok: false, error: "Last name is required" }, { status: 400 });
  }
  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "A valid email address is required" },
      { status: 400 }
    );
  }

  const reasonStr =
    typeof reason === "string" && reason.trim().length > 0 ? reason.trim() : "";
  const messageBody = (() => {
    const msg = typeof message === "string" ? message.trim() : "";
    return reasonStr && msg ? `[${reasonStr}] ${msg}` : reasonStr ? `[${reasonStr}]` : msg;
  })();

  const fields: { name: string; value: string }[] = [
    { name: "firstname", value: String(firstname).trim() },
    { name: "lastname", value: String(lastname).trim() },
    { name: "email", value: String(email).trim() },
  ];

  if (messageBody) fields.push({ name: "message", value: messageBody });
  if (typeof company === "string" && company.trim()) {
    fields.push({ name: "company", value: company.trim() });
  }
  if (typeof phone === "string" && phone.trim()) {
    fields.push({ name: "phone", value: phone.trim() });
  }

  const pageName =
    typeof source === "string" && source.length > 0 ? source : "contact-page";

  const hsUrl = `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_ID}`;

  let hsRes: Response;
  try {
    hsRes = await fetch(hsUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields,
        context: {
          pageUri: "https://getlitsaber.com/contact",
          pageName,
        },
      }),
    });
  } catch (err) {
    console.error("[contact] Network error reaching HubSpot:", err);
    return NextResponse.json(
      { ok: false, error: "Submission failed. Please try again." },
      { status: 502 }
    );
  }

  if (!hsRes.ok) {
    const text = await hsRes.text().catch(() => "(no body)");
    console.error(`[contact] HubSpot responded ${hsRes.status}:`, text);
    return NextResponse.json(
      { ok: false, error: "Submission failed. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
