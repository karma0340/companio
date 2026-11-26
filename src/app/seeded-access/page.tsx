import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Badge } from '@/components/ui/badge';
import { SeededProfileSwitcher } from '@/components/auth/seeded-profile-switcher';
import { verifySeededPortalKey } from '@/lib/seeded-auth';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Internal Access',
  robots: {
    index: false,
    follow: false,
  },
};

export default function SeededAccessPage({
  searchParams,
}: {
  searchParams?: { key?: string };
}) {
  const accessKey = typeof searchParams?.key === 'string' ? searchParams.key : '';

  if (!verifySeededPortalKey(accessKey)) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6">
        <div className="w-full max-w-xl rounded-3xl border-brutal bg-white p-6 sm:p-8 shadow-brutal-lg space-y-5">
          <div className="space-y-2">
            <Badge variant="sunny" size="sm">
              Internal Access
            </Badge>
            <h1 className="font-display text-2xl font-black text-ink">
              Managed Profiles Portal
            </h1>
            <p className="font-body text-xs sm:text-sm text-ink-soft">
              Private operator portal. Only internal managed accounts are listed after authentication.
            </p>
          </div>

          <SeededProfileSwitcher accessKey={accessKey} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
