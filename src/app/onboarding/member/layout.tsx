import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Member Onboarding',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function OnboardingMemberLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
