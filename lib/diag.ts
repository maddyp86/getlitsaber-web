/**
 * Diagnostic kill-switch flags, toggled via the `?diag=` query param.
 *
 * TEMPORARY instrumentation to binary-search the mobile OOM crash on a real
 * device. Each flag strips one suspected memory consumer so we can isolate the
 * root cause:
 *
 *   /?diag=noreplay   PostHog session replay (rrweb) off
 *   /?diag=novideo    all homepage videos render their static poster instead
 *   /?diag=lite       everything below the fold is not rendered (Hero only)
 *   /?diag=all        all of the above at once
 *
 * Combine with commas: /?diag=noreplay,novideo
 *
 * Remove this file and its references once the cause is found.
 */
export interface DiagFlags {
  noreplay: boolean;
  novideo: boolean;
  lite: boolean;
}

export const EMPTY_DIAG: DiagFlags = {
  noreplay: false,
  novideo: false,
  lite: false,
};

function fromTokens(tokens: string[]): DiagFlags {
  const set = new Set(tokens.map((t) => t.trim().toLowerCase()).filter(Boolean));
  const all = set.has("all");
  return {
    noreplay: all || set.has("noreplay"),
    novideo: all || set.has("novideo"),
    lite: all || set.has("lite"),
  };
}

/** Server-side: parse from Next.js `searchParams`. */
export function parseDiag(
  searchParams?: Record<string, string | string[] | undefined>
): DiagFlags {
  if (!searchParams) return EMPTY_DIAG;
  const raw = searchParams.diag;
  const values = Array.isArray(raw) ? raw : raw ? [raw] : [];
  return fromTokens(values.flatMap((v) => v.split(",")));
}

/** Client-side: parse from the current URL (for code that runs outside the page tree). */
export function readDiagFromLocation(): DiagFlags {
  if (typeof window === "undefined") return EMPTY_DIAG;
  const raw = new URLSearchParams(window.location.search).get("diag") ?? "";
  return fromTokens(raw.split(","));
}
