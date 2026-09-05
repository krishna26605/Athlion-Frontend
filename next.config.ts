import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'athlion-frontend.vercel.app',
          },
        ],
        destination: 'https://www.athlion.in/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'athlion.in',
          },
        ],
        destination: 'https://www.athlion.in/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

