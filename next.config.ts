import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const baseConfig: NextConfig = {
   /* config options here */
   async rewrites() {
      return [
         {
            source: "/ws/:path*",
            destination: "https://smarteduhub-server.onrender.com/wss/:path*", // ✅ Proxy WebSocket traffic
         },
      ];
   },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(baseConfig);
