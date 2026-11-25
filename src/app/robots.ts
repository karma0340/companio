import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard',
          '/host/',
          '/companion/dashboard',
          '/companion/kyc',
          '/bookings',
          '/book/',
          '/booking/',
          '/chat',
          '/chat/',
          '/session/',
          '/profile',
          '/wallet',
          '/onboarding/',
          '/receipt/',
          '/login',
          '/app',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
