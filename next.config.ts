import type { NextConfig } from 'next';

const isExport = process.env.STATIC_EXPORT === 'true' || Boolean(process.env.GITHUB_ACTIONS);
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? (process.env.GITHUB_ACTIONS ? '/me' : '');

const nextConfig: NextConfig = {
  output: isExport ? 'export' : undefined,
  basePath: basePath,
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  // Allow local network IP access for testing on mobile and other devices
  allowedDevOrigins: [
    '10.10.10.180',
    '10.10.10.*',
    'localhost:3000',
    '127.0.0.1:3000',
  ],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

export default nextConfig;
