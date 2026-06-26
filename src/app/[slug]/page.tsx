import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import MonatagAd from "../components/MonatagAd";
import {
  ArrowLeft,
  Calendar,
  Tag,
  Folder,
  Bookmark,
} from "lucide-react";
import { getPostsServer, getPostBySlugServer } from "../../lib/db-server";
import { ScrollProgressBar, CopyLinkButton, BackToTopButton } from "../components/PostInteractions";
import MarkdownRenderer from "../components/MarkdownRenderer";
import TableOfContents from "../components/TableOfContents";
import FaqAccordion from "../components/FaqAccordion";

// ─── Static Site Generation ────────────────────────────────────────────────
// Revalidate every 60 seconds (ISR) — pages are generated at build time via
// generateStaticParams, then refreshed frequently + on-demand from admin.
export const revalidate = 60;

// Allow dynamically-created post slugs (not just those from generateStaticParams)
export const dynamicParams = true;

/**
 * generateStaticParams — Next.js App Router equivalent of getStaticPaths.
 * Fetches all published blog post slugs from Firebase at build time so that
 * each blog post page is pre-rendered as static HTML.
 */
export async function generateStaticParams() {
  const posts = await getPostsServer();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

/**
 * generateMetadata — Next.js App Router equivalent of per-page <head> metadata.
 * Sets the canonical tag to the CURRENT blog post URL (not the homepage),
 * along with proper title, description, OpenGraph, and structured data.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlugServer(slug);

  if (!post) {
    return {
      title: "Article Not Found",
      description: "The requested article could not be found.",
    };
  }

  const baseUrl = "https://www.techbasics.online";
  const postUrl = `${baseUrl}/${post.slug}`;

  return {
    title: post.title,
    description: post.metaDescription || post.excerpt,
    keywords: post.metaKeywords,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.title,
      description: post.metaDescription || post.excerpt,
      url: postUrl,
      siteName: "TechBasics",
      type: "article",
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      ...(post.featuredImage && {
        images: [{ url: post.featuredImage, alt: post.title }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.metaDescription || post.excerpt,
      ...(post.featuredImage && { images: [post.featuredImage] }),
    },
    other: {
      "article:published_time": post.createdAt,
      "article:modified_time": post.updatedAt,
    },
  };
}

// ─── Page Component (Server Component — no "use client") ───────────────────
interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlugServer(slug);

  if (!post) {
    notFound();
  }

  const allPosts = await getPostsServer();

  const parseLocalDate = (dateStr: string): number => {
    if (!dateStr) return 0;
    if (dateStr.includes("T")) return new Date(dateStr).getTime();
    return new Date(dateStr + "T00:00:00").getTime();
  };

  const sortedPosts = [...allPosts].sort((a, b) => {
    return parseLocalDate(b.createdAt) - parseLocalDate(a.createdAt);
  });

  const recommendedPosts = sortedPosts.filter(p => p.slug !== post.slug && p.visible !== false && p.recommended).slice(0, 3);

  const baseUrl = "https://www.techbasics.online";
  const postUrl = `${baseUrl}/${post.slug}`;

  // JSON-LD Structured Data for BlogPosting
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription || post.excerpt,
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: "TechBasics",
    },
    publisher: {
      "@type": "Organization",
      name: "TechBasics",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
    ...(post.featuredImage && { image: post.featuredImage }),
  };

  // Breadcrumb JSON-LD
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: post.title,
        item: postUrl,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Scroll Progress Bar (client component) */}
      <ScrollProgressBar />

      {/* Back to Top Button (client component) */}
      <BackToTopButton />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-[1750px] mx-auto px-3 sm:px-6 xl:px-16 h-14 sm:h-20 flex items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2 text-slate-500 hover:text-indigo-600 font-semibold text-sm transition-all group flex-shrink-0">
            <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Back to Articles</span>
          </Link>

          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
            <Image
              src="/logo.svg"
              alt="TechBasics Logo"
              width={32}
              height={32}
              className="object-contain bg-slate-50 p-1 border border-slate-100 rounded-lg shadow-sm"
            />
            <span className="text-sm font-bold tracking-tight text-slate-900 hidden xs:inline sm:inline">TechBasics</span>
          </Link>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Copy link button (client component) */}
            <CopyLinkButton />
          </div>
        </div>
      </header>

      {/* Main Container for TOC + Article */}
      <div className="max-w-[1750px] mx-auto px-3 sm:px-6 xl:px-16 py-6 sm:py-10 flex flex-col xl:flex-row gap-6 lg:gap-10 w-full relative">
        {/* Table of Contents (Left Sidebar) */}
        <aside className="hidden xl:block w-52 flex-shrink-0 self-start sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-hide">
          <TableOfContents content={post.content} faqContent={post.mostPeopleAsked} />
        </aside>

        {/* Article Content (Middle Column) */}
        <article className="flex-1 min-w-0 space-y-6 sm:space-y-8">
          {/* Outer Box Enclosing Header Card and Main Content Card */}
          <div className="xl:border xl:border-slate-200/80 xl:bg-slate-100/40 xl:rounded-[2rem] xl:p-6 space-y-6 sm:space-y-8">
            
            {/* Box 1: Header Card (Title, Meta description, Featured Image) */}
            <div className="bg-white border border-slate-100 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm space-y-5">
              {/* Meta Header */}
              <div className="space-y-4 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
                    <Folder className="h-3 w-3" />
                    {post.category}
                  </span>
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-300" />
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  {post.title}
                </h1>

                <p className="text-base sm:text-lg text-slate-500 leading-relaxed font-light italic border-l-4 border-indigo-100 pl-3 sm:pl-4 py-1">
                  {post.metaDescription || post.excerpt}
                </p>
              </div>

              {/* Featured Image */}
              {post.featuredImage && (
                <div className="relative h-[250px] sm:h-[400px] w-full overflow-hidden rounded-2xl border border-slate-100 shadow-md group bg-slate-900 flex items-center justify-center">
                  {/* Blurred Background Layer */}
                  <img
                    src={post.featuredImage}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover opacity-50 blur-2xl scale-110"
                    aria-hidden="true"
                  />
                  {/* Main Crisp Image */}
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    fetchPriority="high"
                    decoding="async"
                    className="relative z-10 w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 p-4 drop-shadow-2xl"
                  />
                </div>
              )}


            </div>

            {/* Table of Contents (Mobile Dropdown - visible below xl breakpoint) */}
            <div className="xl:hidden">
              <TableOfContents content={post.content} faqContent={post.mostPeopleAsked} isMobileDropdown={true} />
            </div>

            {/* Monetag Ad — between featured image and content */}
            <MonatagAd />

            {/* Box 2: Main Blog Content */}
            <div className="bg-white border border-slate-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-10 shadow-sm overflow-hidden">
              <MarkdownRenderer content={post.content} />
            </div>

          </div>

          {/* Box 3: FAQ */}
          {post.mostPeopleAsked && post.mostPeopleAsked.trim() && (
            <div id="most-people-asked" className="bg-white border border-slate-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm">
              <FaqAccordion content={post.mostPeopleAsked} />
            </div>
          )}

          {/* Footer info & tags */}
          <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-slate-200">
            <div className="flex items-start sm:items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-400 font-medium mt-1 sm:mt-0">Tags:</span>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {post.tags && post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-slate-100 border border-slate-200/50 text-[11px] sm:text-xs font-medium text-slate-600"
                  >
                    <Tag className="h-3 w-3 text-slate-400" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              ← View all articles
            </Link>
          </div>

          {/* Mobile-only Author Bio & Recommended Posts (stacked below FAQ) */}
          <div className="xl:hidden w-full flex flex-col gap-6 mt-10">
            {/* Author Bio Box */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 sm:p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-base sm:text-lg select-none">
                  M
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-bold text-slate-900">Manickavasagan</span>
                    <span className="text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-semibold">Author</span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed">
                    CS student and builder writing about tech, startups, AI, and productivity. Built a SaaS that didn&apos;t ship — walked away with real product experience instead. Sharing everything learned along the way.
                  </p>
                </div>
              </div>
            </div>

            {/* Recommended Posts Box */}
            {recommendedPosts.length > 0 && (
              <div className="bg-white border border-slate-100 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col gap-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Bookmark className="h-4 w-4 text-indigo-500" />
                  Recommended Posts
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {recommendedPosts.map((rec) => (
                    <Link key={rec.id} href={`/${rec.slug}`} className="group block space-y-2">
                      {rec.featuredImage && (
                        <div className="w-full h-28 sm:h-32 rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
                          <img src={rec.featuredImage} alt={rec.title} loading="lazy" decoding="async" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                        </div>
                      )}
                      <h4 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 text-xs sm:text-sm leading-snug">{rec.title}</h4>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Right Sidebar (PC Layout) */}
        <aside className="hidden xl:flex flex-col gap-6 w-72 flex-shrink-0 self-start sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-hide">
          {/* Author Bio Box */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-base select-none">
                M
              </div>
              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900">Manickavasagan</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-semibold">Author</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  CS student and builder writing about tech, startups, AI, and productivity. Built a SaaS that didn&apos;t ship — walked away with real product experience.
                </p>
              </div>
            </div>
          </div>

          {/* Recommended Posts Box */}
          {recommendedPosts.length > 0 && (
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Bookmark className="h-4 w-4 text-indigo-500" />
                Recommended Posts
              </h3>
              <div className="space-y-4">
                {recommendedPosts.map((rec) => (
                  <Link key={rec.id} href={`/${rec.slug}`} className="group block space-y-2">
                    {rec.featuredImage && (
                      <div className="w-full h-28 rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
                        <img src={rec.featuredImage} alt={rec.title} loading="lazy" decoding="async" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <h4 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 text-xs leading-snug">{rec.title}</h4>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 mt-12 sm:mt-20 border-t border-slate-800 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-white font-bold tracking-tight text-lg">TechBasics</span>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold px-2 py-0.5 rounded bg-slate-800">
                v1.0.0
              </span>
            </div>
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} TechBasics.online. All rights reserved.
            </p>
          </div>
          <div className="flex gap-6 text-xs font-medium">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
