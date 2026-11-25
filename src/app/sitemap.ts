import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { CITIES } from '@/lib/data/cities';
import { ACTIVITIES } from '@/lib/data/activities';
import { SITE_URL } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/explore`, lastModified: now, changeFrequency: 'daily', priority: 0.95 },
    { url: `${SITE_URL}/become-a-host`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${SITE_URL}/become-a-companion`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/how-it-works`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/safety`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/trust`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/membership`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/community-guidelines`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${SITE_URL}/refunds`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
  ];

  const cityRoutes: MetadataRoute.Sitemap = CITIES.map((city) => ({
    url: `${SITE_URL}/city/${city.slug}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  const activityRoutes: MetadataRoute.Sitemap = ACTIVITIES.map((act) => ({
    url: `${SITE_URL}/explore/${act.slug}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  let companionRoutes: MetadataRoute.Sitemap = [];
  try {
    const companions = await prisma.companion.findMany({
      select: { id: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
      take: 250,
    });
    companionRoutes = companions.map((c) => ({
      url: `${SITE_URL}/companions/${c.id}`,
      lastModified: c.updatedAt || now,
      changeFrequency: 'weekly',
      priority: 0.75,
    }));
  } catch {
    companionRoutes = [];
  }

  return [...staticRoutes, ...cityRoutes, ...activityRoutes, ...companionRoutes];
}
