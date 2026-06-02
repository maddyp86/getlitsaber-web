"use client";

import { usePathname } from "next/navigation";
import WholesaleCTABanner from "./WholesaleCTABanner";

export default function WholesaleCTABannerGuard() {
  const pathname = usePathname();
  if (pathname !== "/") return null;
  return <WholesaleCTABanner />;
}
