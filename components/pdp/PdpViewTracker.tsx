"use client";

import { useEffect, useRef } from "react";
import { track, EVENTS } from "@/lib/analytics/events";

// Invisible client component — fires product_viewed once on PDP mount.
// Inserted into the PDP Server Component (app/shop/litsaber-og/page.tsx).
export default function PdpViewTracker() {
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    track(EVENTS.product_viewed, { surface: "pdp" });
  }, []);

  return null;
}
