'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function GoogleAnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
      (window as any).gtag('config', 'G-LVXR56QPFG', {
        page_path: url,
      });
    }
  }, [pathname, searchParams]);

  return null;
}
