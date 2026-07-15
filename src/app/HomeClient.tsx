"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { getPosts, BlogPost } from "../lib/db";
import { Category } from "../lib/db-server";
import {
  Search,
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
  Bookmark,
  ArrowRight,
} from "lucide-react";

const CURRENT_YEAR = new Date().getFullYear();

// ─── Helpers ────────────────────────────────────────────────────────────────
const parseLocalDate = (dateStr: string): number => {
  if (!dateStr) return 0;
  if (dateStr.includes("T")) return new Date(dateStr).getTime();
  return new Date(dateStr + "T00:00:00").getTime();
};

// ─── Post Card (shared) ──────────────────────────────────────────────────────
function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/${post.slug}`}
      className="group flex flex-col bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:border-indigo-100 transition-all duration-200 h-full"
    >
      <div className="relative w-full h-44 bg-slate-100 flex-shrink-0 overflow-hidden">
        {post.featuredImage ? (
          <img
            src={post.featuredImage}
            alt={post.title}
            loading="lazy"
            decoding="async"
            className="object-contain bg-white w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
            <BookOpen className="h-8 w-8 text-slate-300" />
          </div>
        )}
        <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm border border-slate-100 text-indigo-700 text-[10px] font-bold shadow-sm">
          <FolderIcon className="h-3 w-3" />
          {post.category}
        </span>
      </div>
      <div className="flex flex-col flex-1 p-4 space-y-2">
        <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
          {post.title}
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 flex-1">
          {post.excerpt}
        </p>
        <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 pt-1">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />5 min read
          </span>
          {post.tags &&
            post.tags.slice(0, 2).map((t) => (
              <span
                key={t}
                className="px-1.5 py-0.5 bg-slate-50 border border-slate-100 rounded font-medium text-slate-500"
              >
                #{t}
              </span>
            ))}
        </div>
      </div>
    </Link>
  );
}

// ─── Category Card ────────────────────────────────────────────────────────────
// One box per category: category cover image + name bar + post count.
function CategoryCard({
  category,
  postCount,
  onCategoryClick,
}: {
  category: Category;
  postCount: number;
  onCategoryClick: (cat: string) => void;
}) {
  return (
    <button
      onClick={() => onCategoryClick(category.name)}
      className="group flex flex-col bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-lg hover:border-indigo-100 transition-all duration-200 text-left w-full"
    >
      {/* Category cover image */}
      <div className="relative w-full h-32 bg-slate-100 overflow-hidden">
        {category.image ? (
          <img
            src={category.image}
            alt={category.name}
            loading="lazy"
            decoding="async"
            className="object-contain bg-white w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-100 via-indigo-50 to-slate-100 flex items-center justify-center">
            <span className="text-5xl font-extrabold text-indigo-300 select-none uppercase leading-none">
              {category.name.charAt(0)}
            </span>
          </div>
        )}
        {/* Post count badge */}
        <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm border border-slate-100 text-slate-700 text-[10px] font-bold shadow-sm">
          {postCount} post{postCount !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Category name footer bar */}
      <div className="w-full px-4 py-3 bg-white border-t border-slate-100 flex items-center justify-between group-hover:bg-indigo-50/40 transition-colors">
        <span className="flex items-center gap-2 font-bold text-slate-900 text-sm group-hover:text-indigo-700 transition-colors">
          <FolderIcon className="h-4 w-4 text-indigo-400 group-hover:text-indigo-600 transition-colors" />
          {category.name}
        </span>
        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
      </div>
    </button>
  );
}

// ─── Recommendation Section ──────────────────────────────────────────────────
function RecommendationSection({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-5">
      <div className="flex items-center gap-2">
        <Bookmark className="h-5 w-5 text-indigo-500" />
        <h2 className="text-lg font-bold text-slate-900">Recommended Reads</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts.map((post) => (
          <Link
            href={`/${post.slug}`}
            key={post.id}
            className="group flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all duration-200"
          >
            {post.featuredImage ? (
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  loading="lazy"
                  decoding="async"
                  className="object-contain bg-white w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-lg bg-slate-100 flex-shrink-0 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-slate-300" />
              </div>
            )}
            <div className="flex-1 min-w-0 space-y-1">
              <h3 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                {post.title}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {post.excerpt.slice(0, 90)}
                {post.excerpt.length > 90 ? "…" : ""}
              </p>
              <span className="inline-flex items-center gap-1 text-[10px] text-slate-400">
                <Clock className="h-3 w-3" />5 min read
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function HomeClient({
  initialPosts,
  initialCategories,
}: {
  initialPosts: BlogPost[];
  initialCategories: Category[];
}) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [categories] = useState<Category[]>(initialCategories);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const allTags = posts.reduce<string[]>((acc, post) => {
    if (post.tags) post.tags.forEach((t) => { if (!acc.includes(t)) acc.push(t); });
    return acc;
  }, []);

  const handleOutsideClick = useCallback((e: MouseEvent) => {
    if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
      setFilterOpen(false);
    }
  }, []);

  useEffect(() => {
    if (filterOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setFilterOpen(false);
      };
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

  const visiblePosts = posts.filter((p) => p.visible !== false);

  const sortedPosts = [...visiblePosts].sort((a, b) => {
    const da = parseLocalDate(a.createdAt);
    const db = parseLocalDate(b.createdAt);
    return sortOrder === "newest" ? db - da : da - db;
  });

  const filterActive =
    searchQuery.trim() !== "" ||
    selectedCategory !== "All" ||
    selectedTag !== "All" ||
    sortOrder !== "newest";

  const filteredPosts = sortedPosts.filter((post) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.content.toLowerCase().includes(q) ||
      post.category.toLowerCase().includes(q) ||
      (post.tags && post.tags.some((tag) => tag.toLowerCase().includes(q)));
    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;
    const matchesTag =
      selectedTag === "All" ||
      (post.tags && post.tags.includes(selectedTag));
    return matchesSearch && matchesCategory && matchesTag;
  });

  // Posts grouped by category name (for default view)
  // If no Firestore categories exist yet, derive them from the posts themselves
  const displayCategories: Category[] = categories.length > 0
    ? categories
    : Array.from(new Set(sortedPosts.map((p) => p.category).filter(Boolean))).map((name) => ({
        id: name.toLowerCase().replace(/\s+/g, "-"),
        name,
        image: "",
        createdAt: "",
      }));

  const postsByCategory = displayCategories.reduce<Record<string, BlogPost[]>>(
    (acc, cat) => {
      acc[cat.name] = sortedPosts.filter((p) => p.category === cat.name);
      return acc;
    },
    {}
  );

  // Recommended posts
  const recommendedPosts = sortedPosts
    .filter((p) => p.recommended)
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative h-12 w-12 flex items-center justify-center rounded-2xl overflow-hidden shadow-inner group-hover:scale-105 transition-transform duration-300">
              <Image
                src="/logo.svg"
                alt="TechBasics Logo"
                width={40}
                height={40}
                className="object-contain rounded-lg"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                TechBasics
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">
                Knowledge Hub
              </span>
            </div>
          </Link>

          {/* Search */}
          <div className="hidden sm:flex flex-1 max-w-sm relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
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

          {/* Filter button */}
          <div className="relative shrink-0" ref={filterRef}>
            <button
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
                <span
                  className={`flex items-center justify-center h-5 w-5 rounded-full text-[10px] font-bold ${
                    filterOpen ? "bg-white text-indigo-600" : "bg-indigo-600 text-white"
                  }`}
                >
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${filterOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Filter dropdown */}
            {filterOpen && (
              <div
                role="dialog"
                aria-label="Filter articles"
                className="absolute right-0 top-[calc(100%+10px)] w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-slate-200/60 overflow-hidden animate-fade-in"
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/70">
                  <span className="flex items-center gap-2 text-sm font-bold text-slate-800">
                    <SlidersHorizontal className="h-4 w-4 text-indigo-500" />
                    Filter Articles
                  </span>
                  <div className="flex items-center gap-2">
                    {activeFilterCount > 0 && (
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedCategory("All");
                          setSelectedTag("All");
                          setSortOrder("newest");
                        }}
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
                      {["All", ...displayCategories.map((c) => c.name)].map((cat) => (
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
                  {/* Tags */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <TagIcon className="h-3.5 w-3.5 text-indigo-400" />
                      Popular Tags
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {["All", ...allTags].map((tag) => (
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
                  {/* Sort */}
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

      {/* ── Hero Section ───────────────────────────────────────────────────── */}
      {!loading && posts.length === 0 ? (
        <section className="bg-white border-b border-slate-100 py-20 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
              <BookOpen className="h-3.5 w-3.5" />
              TechBasics
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              No Articles Yet
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              There are no blog posts published yet. Check back soon for concise, jargon-free explanations about AI, programming, startups, and technology.
            </p>
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
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              TechBasics is a minimalist blog for people learning tech. We explain AI, programming, startups, and technology—without the jargon.
            </p>
          </div>
        </section>
      )}

      {/* ── Main Content ───────────────────────────────────────────────────── */}
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 space-y-14">

        {/* Database error */}
        {error && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-bold text-amber-900 text-sm">Database Not Connected</h3>
              <p className="text-amber-700 text-sm leading-relaxed">
                Firebase is not configured. Please check your connection and try again.
              </p>
            </div>
          </div>
        )}

        {/* ── FILTERED VIEW ──────────────────────────────────────────────── */}
        {filterActive ? (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Search Results</h2>
                <p className="text-sm text-slate-500">
                  {filteredPosts.length} article{filteredPosts.length !== 1 ? "s" : ""} matching your search or filters.
                </p>
              </div>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setSelectedTag("All");
                  setSortOrder("newest");
                }}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition shrink-0"
              >
                Clear filters
              </button>
            </div>

            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
                    <div className="h-44 bg-slate-200" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 w-3/4 bg-slate-200 rounded" />
                      <div className="h-3 w-full bg-slate-200 rounded" />
                      <div className="h-3 w-5/6 bg-slate-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && filteredPosts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}

            {!loading && filteredPosts.length === 0 && (
              <div className="bg-white text-center py-20 px-6 rounded-2xl border border-slate-100 shadow-sm max-w-xl mx-auto space-y-4">
                <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <SlidersHorizontal className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No Articles Found</h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto">
                  No articles match your current filters. Try adjusting your search.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                    setSelectedTag("All");
                    setSortOrder("newest");
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition-all shadow-md shadow-indigo-100"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </section>
        ) : (
          /* ── DEFAULT VIEW ────────────────────────────────────────────────
             1. Blogs grouped by Category
             2. Recommendation Blog
          ─────────────────────────────────────────────────────────────────── */
          <div className="space-y-12">
            {/* Loading skeleton */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((s) => (
                  <div key={s} className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
                    <div className="p-4">
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        {[1,2,3,4,5,6].map((i) => (
                          <div key={i} className="aspect-[3/2] bg-slate-200 rounded-lg" />
                        ))}
                      </div>
                      <div className="h-3 w-32 bg-slate-200 rounded mx-auto" />
                    </div>
                    <div className="h-10 bg-slate-100 border-t border-slate-100" />
                  </div>
                ))}
              </div>
            )}

            {/* Recommendation Blog Section */}
            {!loading && recommendedPosts.length > 0 && (
              <RecommendationSection posts={recommendedPosts} />
            )}

            {/* Category cards */}
            {!loading && displayCategories.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <span className="w-1 h-6 rounded-full bg-indigo-600 inline-block" />
                  <h2 className="text-lg font-bold text-slate-900">Browse by Category</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {displayCategories.map((cat) => (
                    <CategoryCard
                      key={cat.id}
                      category={cat}
                      postCount={postsByCategory[cat.name]?.length ?? 0}
                      onCategoryClick={(c) => {
                        setSelectedCategory(c);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && visiblePosts.length === 0 && (
              <div className="bg-white text-center py-20 px-6 rounded-2xl border border-slate-100 shadow-sm max-w-xl mx-auto space-y-4">
                <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No Articles Yet</h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto">
                  Check back soon — articles are on their way!
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="bg-slate-900 text-slate-400 mt-20 border-t border-slate-800 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2">
            <span className="text-white font-bold tracking-tight text-lg">TechBasics</span>
            <p className="text-xs text-slate-500">
              © {CURRENT_YEAR} TechBasics.online. All rights reserved.
            </p>
            <p className="text-xs text-slate-500">
              Email:{" "}
              <a
                href="mailto:emp.ccreator@gmail.com"
                className="text-slate-300 hover:text-white transition-colors"
              >
                emp.ccreator@gmail.com
              </a>
            </p>
          </div>
          <div className="flex flex-col items-center sm:items-end gap-4">
            <a
              href="http://www.blogarama.com/fashion-blogs/1351624-blog/"
              title="Blogarama.com - Follow me on Blogarama"
              target="_blank"
              className="text-slate-400 hover:text-white transition-colors text-xs"
            >
              Blogarama &#8211; Blog Directory
            </a>
            <div className="flex gap-6 text-xs font-medium">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <Link href="/about" className="hover:text-white transition-colors">About</Link>
              <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
