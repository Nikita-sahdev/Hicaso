import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The dev-only route badge sat over the footer's links at 390; errors still show (docs: devIndicators).
  devIndicators: false,
  // Image uploads go through a server action: 3 MB image plus multipart overhead.
  experimental: { serverActions: { bodySizeLimit: "4mb" } },
  // Old /work links go to the product lineup.
  async redirects() {
    return [
      { source: "/work", destination: "/products", permanent: true },
    ];
  },
};

export default nextConfig;
