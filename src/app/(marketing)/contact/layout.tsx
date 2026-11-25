import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Contact & Safety Support Desk',
  description:
    'Reach Meetzy Club support for escrow payment questions, safety reports, host verification queries, or grievance redressal.',
  path: '/contact',
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
