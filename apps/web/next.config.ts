import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  async rewrites() {
    const isDev = process.env.NODE_ENV !== 'production';
    return [
      {
        source: '/toby',
        destination: isDev ? 'http://localhost:5173/toby/' : '/toby/index.html',
      },
      {
        source: '/toby/:path*',
        destination: isDev ? 'http://localhost:5173/toby/:path*' : '/toby/:path*',
      },
    ];
  },
};

export default nextConfig;
