"use client";

import { useLayoutEffect } from "react";
import posthog from "posthog-js";

declare global {
  interface Window {
    posthog?: typeof posthog;
  }
}

export default function PostHogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useLayoutEffect(() => {
    const token = process.env.NEXT_PUBLIC_POSTHOG_TOKEN;
    if (typeof window === "undefined" || !token) return;

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
      internal_or_test_user_hostname: /^(localhost|127\.0\.0\.1|.*\.vercel\.app)$/,
    });

    if (typeof window !== "undefined") {
      window.posthog = posthog;
      const INTERNAL_FLAG_TOKEN = process.env.NEXT_PUBLIC_INTERNAL_FLAG_TOKEN;
      const internalParam = new URLSearchParams(window.location.search).get("internal");
      if (INTERNAL_FLAG_TOKEN && internalParam === INTERNAL_FLAG_TOKEN) {
        posthog.setInternalOrTestUser();
      } else if (internalParam === "off") {
        posthog.setPersonProperties({ $internal_or_test_user: false });
      }
    }
  }, []);

  return <>{children}</>;
}
