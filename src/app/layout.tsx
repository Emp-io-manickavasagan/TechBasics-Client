import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Suspense } from "react";
import GoogleAnalyticsTracker from "./components/GoogleAnalyticsTracker";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "TechBasics — Demystifying Tech, One Byte at a Time",
    template: "%s | TechBasics",
  },
  description:
    "TechBasics is a minimalist tech blog covering Next.js, React, Firebase, Tailwind CSS, and modern web development fundamentals.",
  keywords: ["TechBasics", "Web Development", "Next.js", "React", "Firebase", "Tailwind CSS"],
  metadataBase: new URL("https://www.techbasics.online"),
  openGraph: {
    title: "TechBasics — Demystifying Tech, One Byte at a Time",
    description:
      "A minimalist tech blog covering Next.js, React, Firebase, and modern web development.",
    url: "https://www.techbasics.online",
    siteName: "TechBasics",
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/icon.ico",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  verification: {
    google: "KViTSEA63srf0fJc-cIaD318x-wQMt-rKnrqaOOn8HE",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        {/* RSS feed autodiscovery — lets browsers and feed readers find the feed */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="TechBasics RSS Feed"
          href="https://www.techbasics.online/feed.xml"
        />
        {/* Preconnect to Firebase & Google APIs for faster first Firestore call */}
        <link rel="preconnect" href="https://firestore.googleapis.com" />
        <link rel="preconnect" href="https://www.googleapis.com" />
        <link rel="preconnect" href="https://identitytoolkit.googleapis.com" />
        <link rel="dns-prefetch" href="https://firestore.googleapis.com" />
        {/* Preconnect to Unsplash CDN for featured images */}
        <link rel="preconnect" href="https://images.unsplash.com" />
      </head>
      <body className={`${inter.className} min-h-full flex flex-col bg-slate-50/50`}>
        <Suspense fallback={null}>
          <GoogleAnalyticsTracker />
        </Suspense>
        {children}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-LVXR56QPFG"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-LVXR56QPFG');
          `}
        </Script>
      </body>
    </html>
  );
}
