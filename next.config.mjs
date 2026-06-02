/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "p16.muscdn.com" },
      { protocol: "https", hostname: "p16-sign.tiktokcdn.com" },
      { protocol: "https", hostname: "p16-sign-sg.tiktokcdn.com" },
      { protocol: "https", hostname: "p16-sign-va.tiktokcdn.com" },
      { protocol: "https", hostname: "p19-sign.tiktokcdn.com" },
      { protocol: "https", hostname: "p19-sign-sg.tiktokcdn.com" },
      { protocol: "https", hostname: "p19-sign-va.tiktokcdn.com" },
    ],
  },
};

export default nextConfig;
