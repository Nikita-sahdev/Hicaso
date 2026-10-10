import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The services business is gone; send old links to the product lineup.
  async redirects() {
    return [
      { source: "/services/:path*", destination: "/products", permanent: true },
      { source: "/work", destination: "/products", permanent: true },
    ];
  },
};

export default nextConfig;
