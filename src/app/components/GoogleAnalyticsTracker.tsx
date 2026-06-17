'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const GA_ID = 'G-LVXR56QPFG';

function sendPageView(url: string) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', GA_ID, { page_path: url });
  }
}

export default function GoogleAnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');

    if ((window as any).gtag) {
      sendPageView(url);
    } else {
      // gtag not yet loaded (scripts are afterInteractive) — wait for it
      const interval = setInterval(() => {
        if ((window as any).gtag) {
          clearInterval(interval);
          sendPageView(url);
        }
      }, 100);
      // Stop polling after 5s to avoid memory leaks
      setTimeout(() => clearInterval(interval), 5000);
    }
  }, [pathname, searchParams]);

  return null;
}
