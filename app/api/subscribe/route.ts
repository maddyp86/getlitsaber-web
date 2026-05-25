import { NextRequest, NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PORTAL_ID =
  process.env.HUBSPOT_PORTAL_ID ?? "244547358";

const FORM_IDS: Record<"gold" | "general", string> = {
  gold:    process.env.HUBSPOT_FORM_GOLD    ?? "d499701a-eb43-4c0e-a6cd-b56a57a98433",
  general: process.env.HUBSPOT_FORM_GENERAL ?? "2a41aa81-1b55-4bcd-97e5-b2b3fe23ee69",
};

export async function POST(req: NextRequest) {
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

  const { email, list, source } = body as {
    email: unknown;
    list: unknown;
    source?: unknown;
  };

  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
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
