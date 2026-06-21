"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

export default function PostHogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_POSTHOG_TOKEN;
    if (typeof window === "undefined" || !token) return;

    posthog.init(token, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      defaults: "2026-01-30",
      capture_exceptions: {
        capture_unhandled_errors: true,
        capture_unhandled_rejections: true,
        capture_console_errors: false,
      },
      capture_dead_clicks: true,
    });
  }, []);

  return <>{children}</>;
}
