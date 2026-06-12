/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
};

export default nextConfig;
