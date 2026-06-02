import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/revalidate
 *
 * Called by the admin app after a post is created, updated, or deleted.
 * Triggers Next.js on-demand ISR revalidation for the affected page(s).
 *
 * Body: { secret: string; slug?: string; revalidateHome?: boolean }
 *
 * - slug         → revalidates /[slug] (the article page)
 * - revalidateHome → revalidates / (the homepage listing)
 * - Both are typically sent together on any post change
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret, slug, revalidateHome } = body;

    // Validate the secret
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ message: "Invalid secret." }, { status: 401 });
    }

    const revalidated: string[] = [];

    // Revalidate the specific post page
    if (slug) {
      revalidatePath(`/${slug}`);
      revalidated.push(`/${slug}`);
    }

    // Revalidate the homepage (post list, recommended, all articles)
    if (revalidateHome) {
      revalidatePath("/");
      revalidated.push("/");
    }

    return NextResponse.json({
      revalidated: true,
      paths: revalidated,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { message: "Revalidation failed.", error: err.message },
      { status: 500 }
    );
  }
}
