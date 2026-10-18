import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      { source: "/headquarter/assest", destination: "/headquarter/assets", permanent: false },
      { source: "/squadron/reports", destination: "/squadron#reports", permanent: false },
      { source: "/squadron/maintenance", destination: "/squadron#maintenance", permanent: false },
      { source: "/squadron/fleet/:id", destination: "/squadron/fleet?aircraft=:id", permanent: false },
    ];
  },
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
