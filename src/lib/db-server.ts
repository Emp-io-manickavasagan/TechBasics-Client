import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, getDoc, query, orderBy } from "firebase/firestore";

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
  mostPeopleAsked?: string;
}

// ─── Firebase config (from environment variables) ──────────────────────────
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const isConfigured = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.authDomain
);

function getDb() {
  if (!isConfigured) return null;
  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    return getFirestore(app);
  } catch {
    return null;
  }
}

const DB_TIMEOUT_MS = 8000;

const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> =>
  new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("Request timed out.")), ms);
    promise
      .then((r) => { clearTimeout(t); resolve(r); })
      .catch((e) => { clearTimeout(t); reject(e); });
  });

// ─── Server-safe getPosts (no localStorage) ────────────────────────────────
export const getPostsServer = async (): Promise<BlogPost[]> => {
  const db = getDb();
  if (!db) return [];

  try {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const snap = await withTimeout(getDocs(q), DB_TIMEOUT_MS);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as BlogPost[];
  } catch (e: any) {
    // Fallback: unordered query if index is missing
    if (
      e?.code === "failed-precondition" ||
      e?.code === "permission-denied" ||
      e?.message?.includes("index")
    ) {
      try {
        const snap2 = await withTimeout(getDocs(collection(db, "posts")), DB_TIMEOUT_MS);
        return snap2.docs
          .map((d) => ({ id: d.id, ...d.data() }) as BlogPost)
          .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
      } catch {
        return [];
      }
    }
    console.error("Error fetching posts (server):", e);
    return [];
  }
};

// ─── Server-safe getPostBySlug (no localStorage) ──────────────────────────
export const getPostBySlugServer = async (slug: string): Promise<BlogPost | null> => {
  const db = getDb();
  if (!db) return null;

  // Direct document lookup first (slug == doc ID)
  try {
    const snap = await withTimeout(getDoc(doc(db, "posts", slug)), DB_TIMEOUT_MS);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as BlogPost;
    }
  } catch {
    // fall through to full list search
  }

  // If direct lookup missed, search all posts
  try {
    const posts = await getPostsServer();
    return posts.find((p) => p.slug === slug || p.id === slug) ?? null;
  } catch {
    return null;
  }
};
