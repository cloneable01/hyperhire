/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
  // output: 'export',
  distDir: 'dist',
};

module.exports = nextConfig;