import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Old /work links go to the product lineup.
  async redirects() {
    return [
      { source: "/work", destination: "/products", permanent: true },
    ];
  },
};

export default nextConfig;
