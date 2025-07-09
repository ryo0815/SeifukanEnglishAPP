/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/English-app',
  assetPrefix: '/English-app/',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
