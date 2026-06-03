import Script from "next/script";

export default function JudgemeScripts() {
  return (
    <>
    <Script>jdgm = window.jdgm || {};jdgm.SHOP_DOMAIN = 'ajur1e-s1.myshopify.com';jdgm.PLATFORM = 'shopify';jdgm.PUBLIC_TOKEN = 'gijUs8wKxVb6h7ZybFfXSiESlGY';</script><script data-cfasync='false' type='text/javascript' async src='https://cdnwidget.judge.me/widget_preloader.js'></Script>
      <Script
        id="jdgm-preloader"
        src="https://cdnwidget.judge.me/widget_preloader.js"
        strategy="afterInteractive"
        data-cfasync="false"
      />
    </>
  );
}