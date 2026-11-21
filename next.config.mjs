/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/app/:path+',
        destination: '/:path+',
      },
      {
        source: '/become-a-host',
        destination: '/become-a-companion',
      },
      {
        source: '/become-a-host/apply',
        destination: '/become-a-companion/apply',
      },
      {
        source: '/companion/kyc',
        destination: '/become-a-companion/apply',
      },
      {
        source: '/host/dashboard',
        destination: '/companion/dashboard',
      },
    ];
  },
};

export default nextConfig;
