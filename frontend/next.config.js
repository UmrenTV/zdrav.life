/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.youtube.com',
      },
      {
        protocol: 'https',
        hostname: '**.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: '**.instagram.com',
      },
      {
        protocol: 'https',
        hostname: '**.cdninstagram.com',
      },
      // Strapi media (dev: localhost:1337; production: add your Strapi host)
      { protocol: 'http', hostname: 'localhost', port: '1337', pathname: '/uploads/**' },
      { protocol: 'https', hostname: 'localhost', port: '1337', pathname: '/uploads/**' },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/wp-admin',
        destination: '/',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
