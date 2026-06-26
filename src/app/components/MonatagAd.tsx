"use client";

import Script from "next/script";
import { useEffect } from "react";

export default function MonatagAd() {
  useEffect(() => {
    // Ensure the script has executed and created the ad container
    // This is a fallback in case the script doesn't auto-initialize
    if (window && typeof window !== "undefined") {
      // The nap5k script will look for elements with data-zone attribute
      // and automatically render ads in them
    }
  }, []);

  return (
    <div className="w-full my-6 sm:my-8">
      {/* Ad Container — the script will detect this and render the ad */}
      <div data-zone="11201525" className="min-h-[100px]"></div>

      {/* Load the nap5k ad script */}
      <Script
        src="https://nap5k.com/tag.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          // After script loads, trigger ad initialization if needed
          if (window && (window as any).monTag) {
            (window as any).monTag.render();
          }
        }}
      />
    </div>
  );
}