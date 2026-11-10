import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The dev-only route badge sat over the footer's links at 390; errors still show (docs: devIndicators).
  devIndicators: false,
  // Old /work links go to the product lineup.
  async redirects() {
    return [
      { source: "/work", destination: "/products", permanent: true },
    ];
  },
};

export default nextConfig;
