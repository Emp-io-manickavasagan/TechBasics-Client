"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPostBySlug, BlogPost } from "../../lib/db";
import { 
  ArrowLeft, 
  Calendar, 
  Tag, 
  Folder, 
  Clock, 
  Bookmark, 
  Share2, 
  Check, 
  Link as LinkIcon 
} from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function PostPage({ params }: PageProps) {
  const { slug } = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    async function loadPost() {
      try {
        const fetched = await getPostBySlug(slug);
        setPost(fetched);
        
        // Dynamic SEO Update (Frontend Safe)
        if (fetched) {
          document.title = `${fetched.title} | TechBasics`;
          
          // Update or create meta description
          let metaDesc = document.querySelector('meta[name="description"]');
          if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
          }
          metaDesc.setAttribute('content', fetched.metaDescription || fetched.excerpt);

          // Update or create meta keywords
          if (fetched.metaKeywords && fetched.metaKeywords.length > 0) {
            let metaKeys = document.querySelector('meta[name="keywords"]');
            if (!metaKeys) {
              metaKeys = document.createElement('meta');
              metaKeys.setAttribute('name', 'keywords');
              document.head.appendChild(metaKeys);
            }
            metaKeys.setAttribute('content', fetched.metaKeywords.join(', '));
          }
        }
      } catch (err) {
        console.error("Error fetching post:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [slug]);

  // Handle Reading Progress Scroll indicator
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.pageYOffset / totalHeight) * 100;
        setReadingProgress(progress);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4 animate-pulse">
          <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-500">Loading Article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 text-center space-y-6">
        <div className="h-20 w-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center shadow-inner border border-rose-100">
          <Bookmark className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">Article Not Found</h1>
          <p className="text-slate-500 text-sm max-w-sm">
            We couldn't locate the blog post you're looking for. It may have been renamed, moved, or deleted.
          </p>
        </div>
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-indigo-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-100 z-50">
        <div 
          className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-75"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-semibold text-sm transition-all group">
            <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-0.5 transition-transform" />
            Back to Articles
          </Link>

          <Link href="/" className="flex items-center gap-2.5">
            <Image 
              src="/logo.svg" 
              alt="TechBasics Logo" 
              width={32} 
              height={32} 
              className="object-contain bg-slate-50 p-1 border border-slate-100 rounded-lg shadow-sm"
            />
            <span className="text-sm font-bold tracking-tight text-slate-900">TechBasics</span>
          </Link>

          <div className="flex items-center gap-2">
            <button 
              onClick={handleCopyLink}
              className="p-2 border border-slate-200 hover:border-slate-300 rounded-xl bg-white text-slate-500 hover:text-slate-800 shadow-sm transition-all flex items-center gap-1.5 text-xs font-semibold"
              title="Copy link"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5" />
                  Share
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <article className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        
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
                day: "numeric"
              })}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            {post.title}
          </h1>

          <p className="text-lg text-slate-500 leading-relaxed font-light italic border-l-4 border-indigo-100 pl-4 py-1">
            {post.excerpt}
          </p>
        </div>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="relative h-[250px] sm:h-[400px] w-full overflow-hidden rounded-3xl border border-slate-100 shadow-lg">
            <img 
              src={post.featuredImage} 
              alt={post.title} 
              className="object-cover w-full h-full"
            />
          </div>
        )}

        {/* Content Area */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-10 shadow-sm">
          <div className="prose prose-slate max-w-none">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({node, ...props}) => <h1 className="text-3xl font-extrabold text-slate-900 mt-8 mb-4 border-b border-slate-100 pb-2" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3" {...props} />,
                p: ({node, ...props}) => <p className="text-slate-600 leading-8 mb-6 text-[15px] sm:text-[16px]" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-6 text-slate-600 space-y-2 text-[15px]" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-6 text-slate-600 space-y-2 text-[15px]" {...props} />,
                li: ({node, ...props}) => <li className="leading-relaxed" {...props} />,
                blockquote: ({node, ...props}) => (
                  <blockquote className="border-l-4 border-indigo-600 bg-slate-50/50 rounded-r-xl px-4 py-3 italic text-slate-500 my-6" {...props} />
                ),
                code: ({node, inline, className, children, ...props}: any) => {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <pre className="bg-slate-900 text-slate-100 p-5 rounded-2xl overflow-x-auto my-6 text-[13px] font-mono leading-relaxed shadow-inner border border-slate-800">
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                  ) : (
                    <code className="bg-indigo-50 text-indigo-700 font-semibold px-1.5 py-0.5 rounded text-[13px] font-mono" {...props}>
                      {children}
                    </code>
                  );
                },
                a: ({node, ...props}) => <a className="text-indigo-600 hover:text-indigo-800 font-semibold underline underline-offset-4" {...props} />,
                hr: ({node, ...props}) => <hr className="my-8 border-slate-100" {...props} />,
                img: ({node, ...props}) => <img className="rounded-2xl max-w-full h-auto mx-auto shadow my-6" {...props} />
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Footer info & tags */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Tags:</span>
            <div className="flex flex-wrap gap-2">
              {post.tags && post.tags.map(tag => (
                <span 
                  key={tag} 
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200/50 text-xs font-medium text-slate-600"
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

      </article>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 mt-20 border-t border-slate-800 py-12">
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
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
