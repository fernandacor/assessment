import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
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