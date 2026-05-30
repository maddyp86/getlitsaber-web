"use client";

import { useHomepageEngaged } from "@/lib/analytics/useHomepageEngaged";

// Invisible client component — mounts the homepage engagement tracker.
// Inserted into the homepage Server Component as a sibling of Hero.
// Passes the CSS selector for the scroll trigger target to the hook.
export default function HomepageEngagementTracker() {
  useHomepageEngaged("[data-analytics='stat-bar']");
  return null;
}
