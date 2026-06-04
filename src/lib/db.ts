import { db, isFirebaseConfigured } from "./firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  orderBy,
} from "firebase/firestore";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  tags: string[];
  category: string;
  createdAt: string;
  updatedAt: string;
  featuredImage: string;
  metaDescription: string;
  metaKeywords: string[];
  recommended?: boolean;
  visible?: boolean;
}

const LOCAL_KEY = "techbasics_local_posts";
const DB_TIMEOUT_MS = 5000;
const CACHE_TTL_MS = 15_000; // 15 second in-memory cache — keeps data fresh after admin edits

// ─── In-memory cache ───────────────────────────────────────────────────────
let postsCache: BlogPost[] | null = null;
let postsCacheTime = 0;

export const invalidateCache = () => {
  postsCache = null;
  postsCacheTime = 0;
};

// ─── Timeout helper ────────────────────────────────────────────────────────
const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> =>
  new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("Request timed out.")), ms);
    promise.then((r) => { clearTimeout(t); resolve(r); })
           .catch((e) => { clearTimeout(t); reject(e); });
  });

// ─── Local storage fallback ────────────────────────────────────────────────
const DEFAULT_POSTS: BlogPost[] = [
  {
    id: "why-we-built-techbasics",
    title: "Why We Built TechBasics",
    slug: "why-we-built-techbasics",
    excerpt: "The story behind our minimalist blog and our mission to explain complex tech concepts without the jargon.",
    content: `# Why We Built TechBasics\n\nIn a world filled with complex documentation and tech jargon, learning technology can feel overwhelming. We built TechBasics to solve this exact problem.\n\n## Our Mission\n\nOur goal is simple: **explain programming, AI, startups, and technology in plain English**.\n\n### What we cover:\n1. **Core Web Development**: Explaining HTML, CSS, React, and Next.js simply.\n2. **Artificial Intelligence**: Demystifying neural networks, LLMs, and prompt engineering.\n3. **Product & Startups**: How to build, launch, and grow digital products.\n\nWe believe that anyone can learn technology if it is explained without unnecessary complexity. Welcome to TechBasics!`,
    category: "Startups",
    tags: ["Startups", "TechBasics", "Minimalism"],
    createdAt: "2026-05-22",
    updatedAt: "2026-05-22",
    featuredImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    metaDescription: "The story behind our minimalist blog and our mission to explain complex tech concepts without the jargon.",
    metaKeywords: ["startups", "tech", "learning"],
    visible: false,
  },
  {
    id: "getting-started-with-ai",
    title: "Getting Started with AI and LLMs",
    slug: "getting-started-with-ai",
    excerpt: "A beginner-friendly guide to understanding artificial intelligence, large language models, and how to use them.",
    content: `# Getting Started with AI and LLMs\n\nArtificial Intelligence (AI) and Large Language Models (LLMs) are transforming how we interact with computers. But what are they, really?\n\n## Understanding the Basics\n\nAn LLM is a type of AI trained on massive amounts of text data. It learns patterns of language, allowing it to generate human-like text, write code, and answer questions.\n\n### How to Leverage AI:\n- **Automation**: Automate repetitive tasks like summarization and translation.\n- **Assistance**: Use AI tools as a brainstorming partner or coding assistant.\n- **Integration**: Add AI features directly to your web apps using APIs.\n\nAs AI continues to evolve, understanding how to write prompts and interact with these models becomes a core skill for any developer.`,
    category: "AI",
    tags: ["AI", "LLM", "Tech"],
    createdAt: "2026-05-21",
    updatedAt: "2026-05-21",
    featuredImage: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80",
    metaDescription: "A beginner-friendly guide to understanding artificial intelligence and large language models.",
    metaKeywords: ["ai", "llm", "technology"],
    visible: false,
  },
  {
    id: "mastering-nextjs-routing",
    title: "Mastering Next.js App Router",
    slug: "mastering-nextjs-routing",
    excerpt: "Understand the essentials of Next.js file-based routing, layout systems, and page components.",
    content: `# Mastering Next.js App Router\n\nNext.js has introduced the App Router, which simplifies route definition and layout management in React applications.\n\n## Key Concepts\n\nThe App Router is built on React Server Components and supports:\n\n### 1. File-based Routing\nFolders define routes, and special files define UI behaviors:\n- \`layout.tsx\`: Shared UI for a segment and its children.\n- \`page.tsx\`: Unique UI of a route, publically accessible.\n- \`loading.tsx\`: Loading UI for a route segment.\n\n### 2. Layout Nesting\nLayouts nest automatically. The root layout wraps your entire application, while child layouts wrap specific sub-routes.\n\nUsing Next.js makes building SEO-friendly, performance-oriented modern web apps a breeze.`,
    category: "Programming",
    tags: ["React", "Nextjs", "Frontend"],
    createdAt: "2026-05-20",
    updatedAt: "2026-05-20",
    featuredImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    metaDescription: "Understand the essentials of Next.js file-based routing, layout systems, and page components.",
    metaKeywords: ["nextjs", "react", "routing"],
    visible: false  },
  {
    id: "designing-minimal-ui",
    title: "Designing Minimal UI for Better Learning",
    slug: "designing-minimal-ui",
    excerpt: "How to use simple UI patterns, whitespace, and typography to make technical content easier to read.",
    content: `# Designing Minimal UI for Better Learning\n\nMinimal user interfaces help readers focus on the ideas instead of the decoration. This article explores basic UI principles that support clear technical writing.\n\n## Key principles\n- White space creates breathing room.\n- Intentional typography improves scanability.\n- Simple navigation helps users find the next idea quickly.\n\nDesign is not about removing features, it is about removing friction so information becomes easier to absorb.`,
    category: "Design",
    tags: ["Design", "UI", "UX"],
    createdAt: "2026-05-19",
    updatedAt: "2026-05-19",
    featuredImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    metaDescription: "Learn minimal UI strategies that make technical blog content easier to understand and more approachable.",
    metaKeywords: ["design", "ui", "ux"],
    visible: false,
  },
  {
    id: "building-your-first-api",
    title: "Building Your First API with Node.js",
    slug: "building-your-first-api",
    excerpt: "A practical walkthrough for building a REST API using Node.js and simple server patterns.",
    content: `# Building Your First API with Node.js\n\nAPIs are the backend glue that powers web apps and mobile clients. This guide walks through building a simple, maintainable REST API with Node.js.\n\n## What you need\n- Routing that maps endpoints to logic.\n- Request parsing and validation.\n- Clear response formats and error handling.\n\nBy the end, you'll have a small server that can serve data reliably and is easy to extend.`,
    category: "Backend",
    tags: ["API", "Nodejs", "Backend"],
    createdAt: "2026-05-18",
    updatedAt: "2026-05-18",
    featuredImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    metaDescription: "Practical guide to building a clean and simple REST API with Node.js for beginners.",
    metaKeywords: ["api", "nodejs", "backend"],
    visible: false,
  },
  {
    id: "product-launch-checklist",
    title: "Product Launch Checklist for Early Startups",
    slug: "product-launch-checklist",
    excerpt: "A concise checklist for launching your first product with confidence and clarity.",
    content: `# Product Launch Checklist for Early Startups\n\nLaunching a product can feel overwhelming, but a simple checklist keeps your team aligned. This article covers the key steps for a strong launch.\n\n## Core launch items\n- Validate the problem with real users.\n- Create clear messaging and positioning.\n- Make your product easy to access and understand.\n\nA great launch is more than marketing — it is a well-prepared first experience for your audience.`,
    category: "Startups",
    tags: ["Startup", "Launch", "Product"],
    createdAt: "2026-05-17",
    updatedAt: "2026-05-17",
    featuredImage: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=800&q=80",
    metaDescription: "Use this quick startup launch checklist to prepare your product, messaging, and first user experience.",
    metaKeywords: ["startup", "launch", "product"],
    visible: false,  },
];

const readLocal = (): BlogPost[] => {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(DEFAULT_POSTS));
      return DEFAULT_POSTS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_POSTS;
  }
};

// ─── getPosts ──────────────────────────────────────────────────────────────
export const getPosts = async (): Promise<BlogPost[]> => {
  // Return from cache if still fresh
  if (postsCache && Date.now() - postsCacheTime < CACHE_TTL_MS) {
    return postsCache;
  }

  if (isFirebaseConfigured && db) {
    // Attempt 1: ordered query (needs Firestore index)
    try {
      const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
      const snap = await withTimeout(getDocs(q), DB_TIMEOUT_MS);
      const results = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as BlogPost[];
      postsCache = results;
      postsCacheTime = Date.now();
      return results;
    } catch (e: any) {
      // Attempt 2: unordered (no index required) — sort client-side
      if (
        e?.code === "failed-precondition" ||
        e?.code === "permission-denied" ||
        e?.message?.includes("index")
      ) {
        try {
          const snap2 = await withTimeout(getDocs(collection(db, "posts")), DB_TIMEOUT_MS);
          const results2 = snap2.docs
            .map((d) => ({ id: d.id, ...d.data() }) as BlogPost)
            .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
          postsCache = results2;
          postsCacheTime = Date.now();
          return results2;
        } catch {
          // fall through to local
        }
      }
    }
  }

  // Local storage fallback
  const local = readLocal();
  return local.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
};

// ─── getPostBySlug ─────────────────────────────────────────────────────────
// Uses cache first, then a direct getDoc (O(1)) instead of a full collection scan.
export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  // Check cache first
  if (postsCache && Date.now() - postsCacheTime < CACHE_TTL_MS) {
    return postsCache.find((p) => p.slug === slug || p.id === slug) ?? null;
  }

  if (isFirebaseConfigured && db) {
    // Direct document lookup by ID (slug == document ID)
    try {
      const snap = await withTimeout(getDoc(doc(db, "posts", slug)), DB_TIMEOUT_MS);
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as BlogPost;
      }
    } catch {
      // fall through to full list
    }

    // If direct lookup missed (slug ≠ doc ID), populate cache and search
    try {
      const posts = await getPosts();
      return posts.find((p) => p.slug === slug || p.id === slug) ?? null;
    } catch {
      // fall through
    }
  }

  const local = readLocal();
  return local.find((p) => p.slug === slug || p.id === slug) ?? null;
};
