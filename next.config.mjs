/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "0ku6zb3bovdlowuq.public.blob.vercel-storage.com",
      },
    ],
  },
  // Legacy product URLs that still receive traffic: /product/litsaber is the
  // old WordPress PDP (still linked from social bios and tagged posts), and
  // /products/<handle> is Shopify's own product path, which checkout's
  // "back to store" link points at. Both 404'd on the new build.
  async redirects() {
    return [
      { source: "/product/:slug*", destination: "/shop/litsaber-og", permanent: true },
      { source: "/products/:slug*", destination: "/shop/litsaber-og", permanent: true },
      // Short links for printed QR codes, one consistent UTM set per printed
      // item. Temporary (307) so a destination can change without reprinting.
      {
        source: "/qr/box",
        destination: "/activate?utm_source=packaging&utm_medium=qr&utm_campaign=activation",
        permanent: false,
      },
      {
        source: "/qr/insert",
        destination: "/activate?utm_source=insert&utm_medium=qr&utm_campaign=activation",
        permanent: false,
      },
      {
        source: "/qr/rebate",
        destination: "/show-it-off?utm_source=insert&utm_medium=qr&utm_campaign=show_it_off",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
