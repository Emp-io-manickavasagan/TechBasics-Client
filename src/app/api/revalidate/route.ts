import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { submitToGoogleIndexing } from "@/lib/google-indexing";
import { submitToIndexNow } from "@/lib/indexnow";

/**
 * POST /api/revalidate
 *
 * Called by the admin app after a post is created, updated, or deleted.
 * Triggers Next.js on-demand ISR revalidation for the affected page(s).
 * Also notifies Google Indexing and IndexNow (Bing/Yandex) APIs.
 *
 * Body: { secret: string; slug?: string; revalidateHome?: boolean; type?: 'URL_UPDATED' | 'URL_DELETED' }
 *
 * - slug         → revalidates /[slug] (the article page)
 * - revalidateHome → revalidates / (the homepage listing)
 * - Both are typically sent together on any post change
 * - type         → Action type for Google Indexing ('URL_UPDATED' or 'URL_DELETED')
 */

// CORS headers — allow the admin app (different origin) to call this endpoint
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Handle CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret, slug, revalidateHome, type } = body;

    // Validate the secret
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json(
        { message: "Invalid secret." },
        { status: 401, headers: corsHeaders }
      );
    }

    const revalidated: string[] = [];

    // Revalidate the specific post page (use "layout" to bust all cached data)
    if (slug) {
      revalidatePath(`/${slug}`, "layout");
      revalidated.push(`/${slug}`);
    }

    // Revalidate the homepage (post list, recommended, all articles)
    if (revalidateHome) {
      revalidatePath("/", "layout");
      revalidated.push("/");
    }

    // Always revalidate the sitemap so new/updated posts appear immediately
    revalidatePath("/sitemap.xml");
    revalidated.push("/sitemap.xml");

    // Trigger search engine notifications
    let googleIndexingResult = null;
    let indexNowResult = null;

    if (slug) {
      const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.techbasics.online").replace(/\/+$/, "");
      const targetUrl = `${siteUrl}/${slug}`;
      const actionType = type === "URL_DELETED" ? "URL_DELETED" : "URL_UPDATED";

      // 1. Google Web Search Indexing API
      googleIndexingResult = await submitToGoogleIndexing(targetUrl, actionType);

      // 2. IndexNow (Bing, Yandex, etc.) - Only submit if the page isn't being deleted
      if (actionType !== "URL_DELETED") {
        indexNowResult = await submitToIndexNow(targetUrl);
      }
    }

    return NextResponse.json(
      {
        revalidated: true,
        paths: revalidated,
        googleIndexing: googleIndexingResult,
        indexNow: indexNowResult,
        timestamp: new Date().toISOString(),
      },
      { headers: corsHeaders }
    );
  } catch (err: any) {
    return NextResponse.json(
      { message: "Revalidation failed.", error: err.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
