import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Compiler optimizations ─────────────────────────────────────────────
  compiler: {
    // Remove console.log in production builds
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },

  // ── Build checks bypass ────────────────────────────────────────────────
  typescript: {
    ignoreBuildErrors: true,
  },

  // ── Image optimization ─────────────────────────────────────────────────
  images: {
    // Use modern formats (avif > webp > jpg) for smallest file sizes
    formats: ["image/avif", "image/webp"],
    // Cache optimized images for 7 days
    minimumCacheTTL: 60 * 60 * 24 * 7,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.unsplash.com" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "ik.imagekit.io" },
    ],
  },

  // ── HTTP headers ───────────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Cache static assets aggressively
          { key: "X-DNS-Prefetch-Control", value: "on" },
          // Security headers
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: *",
              "connect-src 'self' https://firestore.googleapis.com https://www.googleapis.com https://identitytoolkit.googleapis.com https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
      {
        // Cache Next.js static chunks for 1 year (they have content hashes)
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Cache public assets (logo, images) for 7 days
        source: "/(.*)\\.(svg|png|ico|jpg|jpeg|webp|avif|woff2|woff)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;
