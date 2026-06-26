import { Metadata } from "next";
import { getPostsServer } from "../lib/db-server";
import HomeClient from "./HomeClient";

export const revalidate = 60;

export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.techbasics.online",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "TechBasics",
  url: "https://www.techbasics.online",
  description: "TechBasics is a minimalist tech blog covering Next.js, React, Firebase, Tailwind CSS, and modern web development fundamentals.",
  publisher: {
    "@type": "Organization",
    name: "TechBasics",
    logo: {
      "@type": "ImageObject",
      url: "https://www.techbasics.online/logo.png",
    },
  },
};

export default async function Home() {
  const posts = await getPostsServer();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <HomeClient initialPosts={posts} />
    </>
  );
}
