import { NextResponse } from "next/server";
import { getPostsServer } from "@/lib/db";

// Always serve fresh posts — same approach as sitemap.ts
export const dynamic = "force-dynamic";

const SITE_URL = "https://www.techbasics.online";
const SITE_TITLE = "TechBasics — Demystifying Tech, One Byte at a Time";
const SITE_DESCRIPTION =
  "A minimalist tech blog covering Next.js, React, Firebase, Tailwind CSS, and modern web development fundamentals.";
const SITE_LANGUAGE = "en-us";
const SITE_AUTHOR = "TechBasics";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await getPostsServer();

  // Only include visible posts in the feed
  const visiblePosts = posts.filter((p) => p.visible !== false);

  const items = visiblePosts
    .map((post) => {
      const postUrl = `${SITE_URL}/${post.slug}`;
      const pubDate = new Date(post.createdAt).toUTCString();
      const categories = post.tags
        .map((tag) => `    <category>${escapeXml(tag)}</category>`)
        .join("\n");

      return `  <item>
    <title>${escapeXml(post.title)}</title>
    <link>${postUrl}</link>
    <guid isPermaLink="true">${postUrl}</guid>
    <description>${escapeXml(post.excerpt || post.metaDescription || "")}</description>
    <pubDate>${pubDate}</pubDate>
    <author>noreply@techbasics.online (${SITE_AUTHOR})</author>
${categories}
  </item>`;
    })
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>${SITE_LANGUAGE}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${SITE_URL}/logo.png</url>
      <title>${escapeXml(SITE_TITLE)}</title>
      <link>${SITE_URL}</link>
    </image>
${items}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      // Cache for 1 hour on CDN, but always revalidate in background
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
    },
  });
}
