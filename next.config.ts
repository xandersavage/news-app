import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        hostname: "kmwhmoolymzovvnapzfw.supabase.co",
      },
      // You may need to add other domains here later if you use external image CDNs
    ],
  },
};

export default nextConfig;
