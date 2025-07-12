/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // CSS設定を強化
  swcMinify: true,
  experimental: {
    optimizeCss: false,
    forceSwcTransforms: true,
  },
  // Vercel用設定
  compiler: {
    // Tailwind CSS を確実に処理
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

export default nextConfig
