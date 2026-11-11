import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  async headers() {
    return [
      {
        source: '/api/auth/unified/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: 'https://dumpit-web.harooo.co.kr' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
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
