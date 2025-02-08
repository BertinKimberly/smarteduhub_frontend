import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/ws/:path*",
        destination: "http://localhost:8000/ws/:path*", // ✅ Proxy WebSocket traffic
      },
    ];
  },
};

export default nextConfig;
