/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: '/journey',
        destination: '/',
        permanent: true,
      },
      {
        source: '/admin',
        destination: '/',
        permanent: true,
      },
    ];
  },
}

module.exports = nextConfig
