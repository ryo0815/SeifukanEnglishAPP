/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // GitHub Pages用の設定
  basePath: process.env.NODE_ENV === 'production' ? '/SeifukanEnglishAPP' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/SeifukanEnglishAPP' : '',
}

export default nextConfig
