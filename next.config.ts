import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const baseConfig: NextConfig = {
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

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(baseConfig);
