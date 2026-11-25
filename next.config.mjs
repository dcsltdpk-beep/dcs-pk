/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  swcMinify: true,
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/services/cloud-devops',
        destination: '/services/cloud-devops-solutions',
        permanent: true,
      },
      {
        source: '/services/it-support',
        destination: '/services/domain-hosting-it-support',
        permanent: true,
      },
      {
        source: '/courses/ai-automation-agents',
        destination: '/courses/ai-automation',
        permanent: true,
      },
      {
        source: '/courses/video-editing',
        destination: '/courses/video-editing-graphic-design',
        permanent: true,
      },
      {
        source: '/courses/graphic-design',
        destination: '/courses/video-editing-graphic-design',
        permanent: true,
      },
      {
        source: '/courses/web-dev',
        destination: '/courses/web-development',
        permanent: true,
      },
      {
        source: '/academy',
        destination: '/courses',
        permanent: true,
      },
      {
        source: '/courses/computer-basics-office',
        destination: '/courses/computer-basics',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
