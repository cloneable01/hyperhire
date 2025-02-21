/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
  output: 'export',  // Add this line to generate static output
  distDir: 'dist',   // Add this to specify the build directory
};

module.exports = nextConfig;