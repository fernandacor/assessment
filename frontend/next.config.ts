import { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1️⃣ Inyecta un header para que el navegador y el loader sepan que es binario
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

  // 2️⃣ Dile a Webpack que los .glb los emita como recurso estático,
  //     no que intente parsearlos como JSON
  webpack(config: any) {
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/models/[name][ext]',
      },
    });
    return config;
  },
};

export default nextConfig;
