import Script from "next/script";

// Only the config script lives in the layout — it must run globally before any
// widget initializes. The preloader script is co-located with JudgemeReviewWidget
// so it fires only after the widget div is in the DOM.
export default function JudgemeScripts() {
  return (
    <Script id="jdgm-config" strategy="afterInteractive">
      {`jdgm = window.jdgm || {}; jdgm.SHOP_DOMAIN = 'ajur1e-s1.myshopify.com'; jdgm.PLATFORM = 'shopify'; jdgm.PUBLIC_TOKEN = 'gijUs8wKxVb6h7ZybFfXSiESlGY';`}
    </Script>
  );
}