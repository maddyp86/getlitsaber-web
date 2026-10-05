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
    ];
  },
};

export default nextConfig;
