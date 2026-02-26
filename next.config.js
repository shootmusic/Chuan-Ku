const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['saweria.co'],
  },
  webpack: (config) => {
    config.resolve.alias['@'] = path.join(__dirname)
    return config
  },
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
