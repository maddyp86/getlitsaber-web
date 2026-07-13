/**
 * Cloudflare Turnstile server-side verification.
 *
 * Forms POST a `turnstileToken` produced by the <TurnstileWidget /> in the
 * browser. Before forwarding a submission to HubSpot, the API route calls
 * verifyTurnstile() to confirm the token with Cloudflare's siteverify endpoint.
 * This replaces the HubSpot-native reCAPTCHA that had to be disabled to let the
 * Forms API v3 integration submit.
 *
 * Env var: TURNSTILE_SECRET_KEY (server-only, no NEXT_PUBLIC_ prefix). Must be
 * set in the Vercel dashboard (Production + Preview + Development) AND local
 * .env.local. The public site key is NEXT_PUBLIC_TURNSTILE_SITE_KEY.
 *
 * Fail behavior:
 * - Secret NOT set -> skip verification (fail-open). Keeps local dev and a
 *   rollback working without keys. Logs a warning so a missing prod secret is
 *   visible in logs.
 * - Secret set, token missing/invalid/expired -> reject (fail-closed).
 * - Secret set, Cloudflare unreachable -> reject (fail-closed) to keep spam out
 *   during an outage. Cloudflare siteverify is highly available.
 */

const VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

interface SiteVerifyResponse {
  success?: boolean;
  "error-codes"?: string[];
}

export async function verifyTurnstile(
  token: unknown,
  ip?: string
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    console.warn(
      "[turnstile] TURNSTILE_SECRET_KEY not set — skipping CAPTCHA verification."
    );
    return true;
  }

  if (typeof token !== "string" || token.trim().length === 0) {
    return false;
  }

  const form = new URLSearchParams();
  form.append("secret", secret);
  form.append("response", token);
  if (ip && ip !== "unknown") form.append("remoteip", ip);

  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form,
    });

    if (!res.ok) {
      console.error(`[turnstile] siteverify responded HTTP ${res.status}`);
      return false;
    }

    const data = (await res.json()) as SiteVerifyResponse;
    if (!data.success) {
      console.warn("[turnstile] verification failed:", data["error-codes"]);
    }
    return data.success === true;
  } catch (err) {
    console.error("[turnstile] network error during siteverify:", err);
    return false;
  }
}
