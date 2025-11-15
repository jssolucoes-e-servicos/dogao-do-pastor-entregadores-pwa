import type { NextConfig } from "next";

// Config padrão, sem plugin PWA, para evitar erro com turbopack
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('http://localhost/**')],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/app',
        permanent: true,
      },
    ]
  },
  turbopack: {} // silencia erro do Turbopack
};

export default nextConfig;
