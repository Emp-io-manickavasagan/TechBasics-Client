"use client";

import { useEffect } from "react";
import { ExternalLink, Sparkles } from "lucide-react";

export default function MonatagAd() {
  useEffect(() => {
    // Inject the Monetag side notification (In-Page Push) script on the client side.
    // We check if it already exists to prevent duplicates in React Strict Mode.
    if (!document.querySelector('script[data-zone="11201525"]')) {
      const script = document.createElement("script");
      script.src = "https://nap5k.com/tag.min.js";
      script.setAttribute("data-zone", "11201525");
      script.setAttribute("data-cfasync", "false");
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="w-full my-8">
      {/* Custom Banner linking to Direct Ads */}
      <a 
        href="https://omg10.com/4/11201996"
        target="_blank"
        rel="noopener noreferrer"
        className="group block relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 p-[1px] shadow-sm hover:shadow-md transition-all duration-300"
      >
        <div className="relative bg-white rounded-[15px] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 h-full">
          {/* Subtle background glow on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="relative flex items-start gap-4">
            <div className="flex-shrink-0 mt-1 sm:mt-0">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-600">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                  Sponsored
                </span>
              </div>
              <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
                Discover Exclusive Tech Offers & Tools
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Explore hand-picked recommendations and exclusive deals to boost your productivity.
              </p>
            </div>
          </div>

          <div className="relative flex-shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
            <span className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl group-hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
              Learn More
              <ExternalLink className="w-4 h-4" />
            </span>
          </div>
        </div>
      </a>
    </div>
  );
}