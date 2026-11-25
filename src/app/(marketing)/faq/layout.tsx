import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Frequently Asked Questions (FAQ) — Safety, Escrow & Verification',
  description:
    'Answers to common questions about Meetzy Club: strictly platonic rules, mobile OTP verification, Razorpay escrow payments, cancellations, and host earnings.',
  path: '/faq',
});

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
