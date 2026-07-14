import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['maplibre-gl', 'react-map-gl'],
  },
  async redirects() {
    return [
      {
        source: '/live',
        destination: '/flights',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
