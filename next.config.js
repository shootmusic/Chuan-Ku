/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['saweria.co'],
  },
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
