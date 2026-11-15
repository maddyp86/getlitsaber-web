"use client";

import Script from "next/script";
import { META_PIXEL_ID, isMetaPixelEnabled, markMetaPixelReady } from "@/lib/metaPixel";
import MetaPixelPageView from "./MetaPixelPageView";

// Meta's standard base code, loaded once site-wide. Rendered only when
// NEXT_PUBLIC_META_PIXEL_ID is set. The snippet defines the fbq queue and
// inserts fbevents.js asynchronously; next/script runs it after hydration so
// it never blocks rendering. It only initializes the pixel (and turns off the
// library's own history-change PageView): PageView is fired by
// MetaPixelPageView, on the first load and on every client-side route change,
// so a full page load fires it exactly once and each one has an eventID. The helpers in
// lib/metaPixel.ts are where every event is sent from.
function baseCode(pixelId: string): string {
  return (
    "!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?" +
    "n.callMethod.apply(n,arguments):n.queue.push(arguments)};" +
    "if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';" +
    "n.queue=[];t=b.createElement(e);t.async=!0;" +
    "t.src=v;s=b.getElementsByTagName(e)[0];" +
    "s.parentNode.insertBefore(t,s)}(window,document,'script'," +
    "'https://connect.facebook.net/en_US/fbevents.js');" +
    // fbevents.js hooks pushState and fires its own PageView on every
    // client-side route change, without an eventID, and then drops ours for
    // that URL as a duplicate. Off, so MetaPixelPageView is the one source of
    // PageView and every one carries an eventID.
    "fbq.disablePushState=true;" +
    `fbq('init','${pixelId}');`
  );
}

export default function MetaPixel() {
  if (!isMetaPixelEnabled()) return null;
  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive" onReady={markMetaPixelReady}>
        {baseCode(META_PIXEL_ID)}
      </Script>
      {/* No-JS fallback as raw HTML. Rendered as React children, the <img>
          would be created on the client during hydration (a browser with JS
          parses noscript content as text, which React then "repairs"), and
          that fetch is a second, untagged PageView. */}
      <noscript
        dangerouslySetInnerHTML={{
          __html: `<img height="1" width="1" style="display:none" alt="" src="https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1" />`,
        }}
      />
      <MetaPixelPageView />
    </>
  );
}
