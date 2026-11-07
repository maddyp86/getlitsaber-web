// React hydration failures, made visible.
//
// When the server HTML and the client render disagree (a browser extension,
// content blocker, translation or accessibility tool inserting a node ahead
// of React's first child is the common cause on phones), React 18 throws the
// whole page away and rebuilds it on the client. The page still looks fine,
// but anything wired by an inline script is now unwired: that is how the age
// gate's confirm button went dead for visitors on 2026-10-17 and 2026-10-29,
// and nothing recorded it. React reports these through window "error" events
// (recoverable errors go through reportError), which fire during hydration,
// before any React effect can listen. So a head script buffers them, and
// HydrationErrorTracker sends them to PostHog once it mounts.

export const HYDRATION_ERROR_EVENT = "litsaber:hydration-error";

/**
 * Production React codes: 418 text mismatch, 419 suspense server error,
 * 420-425 hydration failed / switched to client rendering. Development
 * builds say "Hydration failed" or "while hydrating" in words.
 */
export const HYDRATION_ERROR_PATTERN = /Minified React error #(418|419|42[0-5])\b|hydrat/i;

declare global {
  interface Window {
    __hydrationErrors?: string[];
  }
}

/** The React error code in a message, or "dev" for a development-build message. */
export function hydrationErrorCode(message: string): string {
  const match = /Minified React error #(4\d\d)/.exec(message);
  return match ? match[1] : "dev";
}

/** Whether a window "error" event message is a React hydration failure. */
export function isHydrationErrorMessage(message: string): boolean {
  return HYDRATION_ERROR_PATTERN.test(message);
}

/** Inline, in <head>, before React's bundle: buffers hydration errors. */
export const HYDRATION_ERROR_HEAD_SCRIPT = `(function(){try{window.addEventListener("error",function(e){var m=(e&&e.message)||(e&&e.error&&e.error.message)||"";if(!${HYDRATION_ERROR_PATTERN.toString()}.test(m))return;(window.__hydrationErrors||(window.__hydrationErrors=[])).push(m);try{window.dispatchEvent(new CustomEvent(${JSON.stringify(HYDRATION_ERROR_EVENT)},{detail:m}))}catch(x){}})}catch(e){}})();`;
