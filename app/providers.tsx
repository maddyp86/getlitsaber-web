"use client";

import { useLayoutEffect } from "react";
import posthog from "posthog-js";
import { readDiagFromLocation } from "@/lib/diag";

export default function PostHogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useLayoutEffect(() => {
    const token = process.env.NEXT_PUBLIC_POSTHOG_TOKEN;
    if (typeof window === "undefined" || !token) return;

    // `?diag=noreplay` disables the rrweb session recorder to test whether it
    // is the source of the mobile OOM crash. Diagnostic only.
    const { noreplay } = readDiagFromLocation();

    posthog.init(token, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      ui_host: "https://us.posthog.com",
      person_profiles: "identified_only",
      capture_exceptions: {
        capture_unhandled_errors: true,
        capture_unhandled_rejections: true,
        capture_console_errors: false,
      },
      capture_dead_clicks: true,
      disable_session_recording: noreplay,
    });
  }, []);

  return <>{children}</>;
}
