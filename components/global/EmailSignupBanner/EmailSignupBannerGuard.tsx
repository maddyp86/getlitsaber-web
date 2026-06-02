"use client";

import { usePathname } from "next/navigation";
import EmailSignupBanner from "./EmailSignupBanner";

export default function EmailSignupBannerGuard() {
  const pathname = usePathname();
  if (pathname.startsWith("/policies")) return null;
  return <EmailSignupBanner />;
}
