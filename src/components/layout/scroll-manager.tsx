'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Ensures Next.js App Router route transitions immediately reset scroll to the top
 * of the new page's interactive content (avoiding landing on the Footer when the
 * previous route was scrolled down or while client states hydrate).
 */
export function ScrollManager() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.location.hash) return;

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    const rafId = window.requestAnimationFrame(() => {
      if (!window.location.hash) {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }
    });

    return () => window.cancelAnimationFrame(rafId);
  }, [pathname]);

  return null;
}
