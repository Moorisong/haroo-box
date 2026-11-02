import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  compiler: {
    // 프로덕션 환경에서만 console 로그 제거 (error, warn은 유지하여 디버깅 가능하게 함)
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
