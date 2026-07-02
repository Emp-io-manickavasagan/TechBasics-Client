import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { submitToIndexNow } from "@/lib/indexnow";

/**
 * POST /api/revalidate
 *
 * Called by the admin app after a post is created, updated, or deleted.
 * Triggers Next.js on-demand ISR revalidation for the affected page(s).
 * Also notifies IndexNow (Bing, Yandex, etc.) for fast search engine pickup.
 *
 * Body: { secret: string; slug?: string; revalidateHome?: boolean; type?: 'URL_UPDATED' | 'URL_DELETED' }
 *
 * - slug           → revalidates /[slug] (the article page)
 * - revalidateHome → revalidates / (the homepage listing)
 * - type           → 'URL_UPDATED' or 'URL_DELETED'
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

    // Notify IndexNow (Bing, Yandex, etc.) — only for new/updated pages, not deletions
    let indexNowResult = null;
    if (slug && type !== "URL_DELETED") {
      const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.techbasics.online").replace(/\/+$/, "");
      indexNowResult = await submitToIndexNow(`${siteUrl}/${slug}`);
    }

    return NextResponse.json(
      {
        revalidated: true,
        paths: revalidated,
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
