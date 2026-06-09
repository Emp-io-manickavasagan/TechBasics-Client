"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { getPosts, BlogPost } from "../lib/db";
import {
  Search,
  Calendar,
  Tag as TagIcon,
  Folder as FolderIcon,
  Clock,
  SlidersHorizontal,
  ArrowUpDown,
  BookOpen,
  AlertTriangle,
  ChevronDown,
  X,
  Filter,
} from "lucide-react";

const CURRENT_YEAR = new Date().getFullYear();

export default function HomeClient({ initialPosts }: { initialPosts: BlogPost[] }) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [categories, setCategories] = useState<string[]>(() => {
    const cats = Array.from(new Set(initialPosts.map((p) => p.category).filter(Boolean)));
    return ["All", ...cats];
  });
  const [tags, setTags] = useState<string[]>(() => {
    const allTags = initialPosts.reduce<string[]>((acc, post) => {
      if (post.tags) post.tags.forEach((t) => { if (!acc.includes(t)) acc.push(t); });
      return acc;
    }, []);
    return ["All", ...allTags];
  });
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or Escape
  const handleOutsideClick = useCallback((e: MouseEvent) => {
    if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
      setFilterOpen(false);
    }
  }, []);

  useEffect(() => {
    if (filterOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") setFilterOpen(false); };
      document.addEventListener("keydown", onKeyDown);
      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
        document.removeEventListener("keydown", onKeyDown);
      };
    }
  }, [filterOpen, handleOutsideClick]);

  const activeFilterCount = [
    selectedCategory !== "All",
    selectedTag !== "All",
    sortOrder !== "newest",
  ].filter(Boolean).length;



  // Parse a date string (YYYY-MM-DD or ISO) safely in LOCAL time to avoid
  // UTC-midnight timezone shifts (e.g. IST +05:30 turns May 23 into May 22).
  const parseLocalDate = (dateStr: string): number => {
    if (!dateStr) return 0;
    // If it's already a full ISO string (contains 'T'), use it as-is.
    if (dateStr.includes("T")) return new Date(dateStr).getTime();
    // Otherwise append a local midnight time to avoid UTC offset problems.
    return new Date(dateStr + "T00:00:00").getTime();
  };

  const visiblePosts = posts.filter((post) => post.visible !== false);

  const filteredPosts = visiblePosts
    .filter((post) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.content.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q) ||
        (post.tags && post.tags.some((tag) => tag.toLowerCase().includes(q)));
      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
      const matchesTag = selectedTag === "All" || (post.tags && post.tags.includes(selectedTag));
      return matchesSearch && matchesCategory && matchesTag;
    })
    .sort((a, b) => {
      const da = parseLocalDate(a.createdAt);
      const db = parseLocalDate(b.createdAt);
      return sortOrder === "newest" ? db - da : da - db;
    });

  const filterActive =
    searchQuery.trim() !== "" ||
    selectedCategory !== "All" ||
    selectedTag !== "All" ||
    sortOrder !== "newest";

  const sortedVisiblePosts = [...visiblePosts].sort((a, b) => {
    const da = parseLocalDate(a.createdAt);
    const db = parseLocalDate(b.createdAt);
    return db - da;
  });

  const topFive = sortedVisiblePosts.slice(0, 5);
  const recommendedPosts = sortedVisiblePosts.filter((p) => (p as any).recommended).slice(0, 5);
  const allArticlesPosts = sortedVisiblePosts;

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "TechBasics",
            "url": "https://www.techbasics.online",
            "description": "TechBasics is a minimalist tech blog covering Next.js, React, Firebase, Tailwind CSS, and modern web development fundamentals.",
            "publisher": {
              "@type": "Organization",
              "name": "TechBasics",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.techbasics.online/logo.png"
              }
            }
          })
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="w-full lg:w-[60%] max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-12 w-12 flex items-center justify-center rounded-2xl overflow-hidden shadow-inner group-hover:scale-105 transition-transform duration-300">
              <Image src="/logo.svg" alt="TechBasics Logo" width={40} height={40} className="object-contain rounded-lg" priority />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">TechBasics</span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">Knowledge Hub</span>
            </div>
          </Link>

          {/* Navbar Search Bar */}
          <div className="hidden sm:flex flex-1 max-w-md mx-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              id="navbar-search-input"
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-9 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Navbar Filter Dropdown */}
          <div className="relative" ref={filterRef}>
            <button
              id="navbar-filter-btn"
              onClick={() => setFilterOpen((o) => !o)}
              aria-expanded={filterOpen}
              aria-haspopup="true"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                filterOpen
                  ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200"
                  : "bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50"
              }`}
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && (
                <span className={`flex items-center justify-center h-5 w-5 rounded-full text-[10px] font-bold ${
                  filterOpen ? "bg-white text-indigo-600" : "bg-indigo-600 text-white"
                }`}>
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${filterOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Panel */}
            {filterOpen && (
              <div
                role="dialog"
                aria-label="Filter articles"
                className="absolute right-0 top-[calc(100%+10px)] w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-slate-200/60 overflow-hidden animate-fade-in"
              >
                {/* Panel Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/70">
                  <span className="flex items-center gap-2 text-sm font-bold text-slate-800">
                    <SlidersHorizontal className="h-4 w-4 text-indigo-500" />
                    Filter Articles
                  </span>
                  <div className="flex items-center gap-2">
                    {activeFilterCount > 0 && (
                      <button
                        onClick={() => { setSearchQuery(""); setSelectedCategory("All"); setSelectedTag("All"); setSortOrder("newest"); }}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors px-2 py-1 rounded-lg hover:bg-indigo-50"
                      >
                        Reset all
                      </button>
                    )}
                    <button
                      onClick={() => setFilterOpen(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">

                  {/* Categories */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <FolderIcon className="h-3.5 w-3.5 text-indigo-400" />
                      Categories
                    </label>
                    <div className="flex flex-col gap-1">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                            selectedCategory === cat
                              ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Popular Tags */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <TagIcon className="h-3.5 w-3.5 text-indigo-400" />
                      Popular Tags
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setSelectedTag(tag)}
                          className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                            selectedTag === tag
                              ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sort By */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <ArrowUpDown className="h-3.5 w-3.5 text-indigo-400" />
                      Sort By
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(["newest", "oldest"] as const).map((order) => (
                        <button
                          key={order}
                          onClick={() => setSortOrder(order)}
                          className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                            sortOrder === order
                              ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {order === "newest" ? "⬇ Newest" : "⬆ Oldest"}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Panel Footer */}
                <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {filteredPosts.length} article{filteredPosts.length !== 1 ? "s" : ""} found
                  </span>
                  <button
                    onClick={() => setFilterOpen(false)}
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-indigo-200"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Hero / No-Blog Message */}
      {!loading && posts.length === 0 ? (
        <section className="bg-white border-b border-slate-100 py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-4">
              <BookOpen className="h-3.5 w-3.5" />
              TechBasics
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight mb-4">
              No Articles Yet
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed mb-6">
              There are no blog posts published yet. Check back soon for concise, jargon-free explanations about AI, programming, startups, and technology.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link href="/privacy-policy" className="px-4 py-2 text-sm font-semibold rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 transition-colors">Privacy</Link>
              <Link href="/" className="px-4 py-2 text-sm font-semibold rounded-xl bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors">Refresh</Link>
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-white border-b border-slate-100 py-16 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
              <BookOpen className="h-3.5 w-3.5" />
              Tech Explained Simply.
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Tech Explained Simply.
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed whitespace-pre-line">
              TechBasics is a minimalist blog for people learning tech. We explain AI, programming, startups, and technology—without the jargon.
            </p>
          </div>
        </section>
      )}

      {/* (Removed duplicate hero filter — navbar filter retained) */}

      {/* Main */}
      <main className="w-full lg:w-[60%] max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
        <section className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Latest Articles (Top 5) */}
          <div className="lg:col-span-2 space-y-6">
            {filterActive && filteredPosts.length > 0 && (
              <section className="bg-slate-50 rounded-3xl border border-slate-200 p-6 mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Search Results</h2>
                    <p className="text-sm text-slate-500">Showing articles that match your search or selected filters.</p>
                  </div>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("All");
                      setSelectedTag("All");
                      setSortOrder("newest");
                    }}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
                  >
                    Clear filters
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {filteredPosts.map((post) => (
                    <Link
                      href={`/${post.slug}`}
                      key={post.id}
                      className="block bg-white rounded-3xl border border-slate-100 p-6 hover:shadow-lg transition-shadow duration-200"
                    >
                      <div className="flex flex-col sm:flex-row items-start gap-5">
                        {post.featuredImage ? (
                          <div className="w-full sm:w-36 h-28 rounded-3xl overflow-hidden bg-slate-100 flex-shrink-0">
                            <img src={post.featuredImage} alt={post.title} loading="lazy" decoding="async" className="object-cover w-full h-full" />
                          </div>
                        ) : (
                          <div className="w-full sm:w-36 h-28 rounded-3xl bg-slate-100 flex-shrink-0" />
                        )}
                        <div className="flex-1 space-y-3">
                          <h3 className="text-2xl font-bold text-slate-900 line-clamp-2">{post.title}</h3>
                          <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">{post.excerpt}</p>
                          <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                            <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />5 min read</span>
                            {post.tags && post.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-[10px] font-medium text-slate-500">#{tag}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
            <h2 className="text-xl font-bold text-slate-900">Latest Articles (Top 5)</h2>

            {/* Loading skeletons */}
            {loading && !error && (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 animate-pulse">
                    <div className="h-4 w-28 bg-slate-200 rounded" />
                    <div className="h-6 w-3/4 bg-slate-200 rounded" />
                    <div className="h-4 w-full bg-slate-200 rounded" />
                    <div className="h-4 w-5/6 bg-slate-200 rounded" />
                  </div>
                ))}
              </div>
            )}

            {/* Top 5 compact list */}
            {!loading && !error && topFive.length > 0 && (
              <div className="space-y-4">
                {topFive.map((post) => (
                  <article key={post.id} className="group bg-white rounded-3xl border border-slate-100 hover:shadow-lg p-6 min-h-[190px] flex flex-col sm:flex-row items-start gap-6">
                    {post.featuredImage ? (
                      <div className="w-full sm:w-44 h-36 overflow-hidden rounded-3xl flex-shrink-0 bg-slate-100">
                        <img src={post.featuredImage} alt={post.title} loading="lazy" decoding="async" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    ) : (
                      <div className="w-full sm:w-44 h-36 rounded-3xl bg-slate-100 flex-shrink-0" />
                    )}

                    <div className="flex-1 space-y-3">
                      <Link href={`/${post.slug}`} className="block">
                        <h3 className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">{post.title}</h3>
                      </Link>
                      <p className="text-slate-500 text-sm line-clamp-3">{post.excerpt}</p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />5 min read</span>
                        {post.tags && post.tags.slice(0,3).map((t) => (
                          <span key={t} className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-[10px] font-medium text-slate-500">#{t}</span>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Empty state when no posts */}
            {!loading && !error && filteredPosts.length === 0 && (
              <div className="bg-white text-center py-20 px-6 rounded-2xl border border-slate-100 shadow-sm max-w-xl mx-auto space-y-4">
                <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <SlidersHorizontal className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No Articles Found</h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto">
                  {posts.length === 0
                    ? "No articles have been published yet. Check back soon!"
                    : "No articles match your current filters. Try adjusting your search."}
                </p>
                {posts.length > 0 && (
                  <button
                    onClick={() => { setSearchQuery(""); setSelectedCategory("All"); setSelectedTag("All"); setSortOrder("newest"); }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition-all shadow-md shadow-indigo-100"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right: Recommended sidebar */}
          <aside className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Recommended</h3>
            <div className="grid grid-cols-1 gap-4">
              {recommendedPosts.length === 0 && (
                <div className="bg-white rounded-3xl border border-slate-100 p-6 text-sm text-slate-500">
                  No recommended articles yet.
                </div>
              )}
              {recommendedPosts.map((p) => (
                <Link
                  href={`/${p.slug}`}
                  key={p.id}
                  className="block bg-white rounded-3xl border border-slate-100 p-6 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    {p.featuredImage ? (
                      <div className="w-full sm:w-28 h-24 rounded-3xl overflow-hidden bg-slate-100 flex-shrink-0">
                        <img src={p.featuredImage} alt={p.title} loading="lazy" decoding="async" className="object-cover w-full h-full" />
                      </div>
                    ) : (
                      <div className="w-full sm:w-28 h-24 rounded-3xl bg-slate-100 flex-shrink-0" />
                    )}
                    <div className="flex-1 space-y-3">
                      <div className="font-semibold text-slate-900 text-lg line-clamp-2">{p.title}</div>
                      <div className="text-sm text-slate-500 leading-relaxed line-clamp-3">{p.excerpt.slice(0, 120)}{p.excerpt.length > 120 ? '...' : ''}</div>
                      <div className="flex flex-wrap gap-1">
                        {p.tags && p.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-[10px] font-medium text-slate-500">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        </div>

          {/* Firebase not configured error */}
          {error && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="font-bold text-amber-900 text-sm">Database Not Connected</h3>
                <p className="text-amber-700 text-sm leading-relaxed">Firebase is not configured. Please check your connection and try again.</p>
              </div>
            </div>
          )}

          {/* Loading skeletons */}
          {loading && !error && (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 animate-pulse">
                  <div className="h-4 w-28 bg-slate-200 rounded" />
                  <div className="h-6 w-3/4 bg-slate-200 rounded" />
                  <div className="h-4 w-full bg-slate-200 rounded" />
                  <div className="h-4 w-5/6 bg-slate-200 rounded" />
                </div>
              ))}
            </div>
          )}

          {/* (Removed duplicate empty-state — handled in left column) */}

        </section>
      </main>

      {/* All Articles (divider above footer) */}
      <section className="w-full lg:w-[60%] max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 border-t border-slate-200 pt-8">
        <h3 className="text-lg font-bold text-slate-900 mb-4">All Articles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {allArticlesPosts.map((p) => (
            <Link key={p.id} href={`/${p.slug}`} className="block bg-white rounded-3xl border border-slate-100 p-8 hover:shadow-xl transition-shadow duration-200 h-full">
              <div className="flex flex-col sm:flex-row items-start gap-5">
                {p.featuredImage ? (
                  <div className="w-full sm:w-32 h-28 rounded-3xl overflow-hidden bg-slate-100 flex-shrink-0">
                    <img src={p.featuredImage} alt={p.title} loading="lazy" decoding="async" className="object-cover w-full h-full" />
                  </div>
                ) : (
                  <div className="w-full sm:w-32 h-28 rounded-3xl bg-slate-100 flex-shrink-0" />
                )}
                <div className="flex-1 space-y-3">
                  <div className="font-semibold text-slate-900 text-xl line-clamp-2">{p.title}</div>
                  <div className="text-sm text-slate-500 leading-relaxed">{p.excerpt.slice(0, 130)}{p.excerpt.length > 130 ? '...' : ''}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 mt-20 border-t border-slate-800 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2">
            <span className="text-white font-bold tracking-tight text-lg">TechBasics</span>
            <p className="text-xs text-slate-500">© {CURRENT_YEAR} TechBasics.online. All rights reserved.</p>
            <p className="text-xs text-slate-500">
              Email: <a href="mailto:emp.ccreator@gmail.com" className="text-slate-300 hover:text-white transition-colors">emp.ccreator@gmail.com</a>
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
