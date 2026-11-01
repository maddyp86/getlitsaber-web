"use client";

import type { PostHog } from "posthog-js";

// posthog-js is ~105KB compressed and was the largest script on every page,
// parsed and run during hydration. app/providers.tsx now imports it after
// first paint and hands the initialized instance here, so nothing else
// imports the library itself (only its types).

let client: PostHog | null = null;
let waiting: Array<(ph: PostHog) => void> = [];

/** The initialized PostHog instance, or null until providers.tsx has set it. */
export function getPosthog(): PostHog | null {
  return client;
}

/** Called once by providers.tsx after posthog.init(). */
export function setPosthog(ph: PostHog): void {
  client = ph;
  const queued = waiting;
  waiting = [];
  queued.forEach((cb) => cb(ph));
}

/** Runs `cb` now if PostHog is ready, otherwise once it is. */
export function whenPosthogReady(cb: (ph: PostHog) => void): void {
  if (client) cb(client);
  // Capped so a page without a PostHog token (local dev) cannot grow it forever.
  else if (waiting.length < 200) waiting.push(cb);
}
