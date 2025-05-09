/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove static export as it's incompatible with API routes
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;