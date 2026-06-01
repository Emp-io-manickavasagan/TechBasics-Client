"use client";

import { useEffect, useState } from "react";
import { Share2, Check } from "lucide-react";

/**
 * Scroll progress bar + copy-link button — client-only interactivity
 * extracted from the blog post page to allow the page itself to be a Server Component.
 */
export function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        setProgress((window.pageYOffset / total) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-slate-100 z-50">
      <div
        className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-75"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="p-2 border border-slate-200 hover:border-slate-300 rounded-xl bg-white text-slate-500 hover:text-slate-800 shadow-sm transition-all flex items-center gap-1.5 text-xs font-semibold"
      title="Copy link"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-emerald-500" />
          <span className="hidden sm:inline">Copied!</span>
        </>
      ) : (
        <>
          <Share2 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Share</span>
        </>
      )}
    </button>
  );
}
