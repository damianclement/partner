import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://obus-partners.otapp.live/:path*",
      },
    ];
  },
  // Handle redirects properly
  async redirects() {
    return [];
  },
  // Enable external redirects to be followed
  experimental: {
    proxyTimeout: 30000,
  },
  // Disable image optimization to avoid conflicts
  images: {
    unoptimized: true,
  },
  /* config options here */
};

export default nextConfig;
