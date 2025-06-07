import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // fuerza el uso del App Router (si estás en >=13.4 no hace falta, pero no duele)
  experimental: { appDir: true },
  // (opcional) si tu proxy no sirve bien .glb, añade este headers
  async headers() {
    return [
      {
        source: '/models/:path*',
        headers: [
          { key: 'Content-Type', value: 'model/gltf-binary' }
        ],
      },
    ];
  },
};

export default nextConfig;