import Script from "next/script";

export default function JudgemeScripts() {
  return (
    <>
      <Script id="jdgm-config" strategy="beforeInteractive">
        {`jdgm = window.jdgm || {}; jdgm.SHOP_DOMAIN = 'ajur1e-s1.myshopify.com'; jdgm.PLATFORM = 'shopify'; jdgm.PUBLIC_TOKEN = 'gijUs8wKxVb6h7ZybFfXSiESlGY';`}
      </Script>
      <Script
        id="jdgm-preloader"
        src="https://cdnwidget.judge.me/widget_preloader.js"
        strategy="afterInteractive"
        data-cfasync="false"
      />
    </>
  );
}