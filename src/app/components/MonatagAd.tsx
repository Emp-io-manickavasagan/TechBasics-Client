"use client";

import Script from "next/script";

export default function MonatagAd() {
  return (
    <div className="w-full my-6 sm:my-8">
      {/* Ad Container */}
      <div id="nap5k-zone" data-zone="11201525"></div>

      {/* Load the nap5k ad script with proper initialization */}
      <Script
        id="nap5k-script"
        src="https://nap5k.com/tag.min.js"
        strategy="afterInteractive"
        async
      />
    </div>
  );
}