import type { Metadata } from 'next';

const rawUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'https://www.meetzy.club';
export const SITE_URL = rawUrl.replace(/\/+$/, '');
export const DEFAULT_OG_IMAGE = '/icon.png';

interface BuildMetadataInput {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  keywords?: string[];
  type?: 'website' | 'profile';
}

export function buildMetadata({
  title,
  description,
  path = '/',
  image = DEFAULT_OG_IMAGE,
  noIndex = false,
  keywords,
  type = 'website',
}: BuildMetadataInput): Metadata {
  const canonicalPath = path.startsWith('/') ? path : `/${path}`;
  return {
    title,
    description,
    ...(keywords && keywords.length > 0 ? { keywords } : {}),
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      url: canonicalPath,
      siteName: 'Meetzy Club',
      locale: 'en_IN',
      type,
      images: [
        {
          url: image,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    ...(noIndex
      ? {
          robots: {
            index: false,
            follow: false,
            googleBot: { index: false, follow: false },
          },
        }
      : {}),
  };
}
