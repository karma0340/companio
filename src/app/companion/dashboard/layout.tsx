import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Host Dashboard',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function CompanionDashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
