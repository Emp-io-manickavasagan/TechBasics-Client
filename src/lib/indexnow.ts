/**
 * Submits a URL to the IndexNow API (notifying Bing, Yandex, etc. of updates).
 * 
 * @param url The full URL of the page (e.g., https://www.techbasics.online/my-post)
 */
export async function submitToIndexNow(url: string) {
  const indexNowKey = process.env.INDEXNOW_API_KEY;
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.techbasics.online").replace(/\/+$/, "");

  if (!indexNowKey) {
    console.warn("[IndexNow] INDEXNOW_API_KEY not configured. Skipping IndexNow submission.");
    return { success: false, reason: "INDEXNOW_API_KEY not set in environment variables" };
  }

  try {
    const host = new URL(siteUrl).hostname;
    const keyLocation = `${siteUrl}/${indexNowKey}.txt`;

    console.log(`[IndexNow] Submitting URL notification to IndexNow: ${url} (Host: ${host}, KeyLocation: ${keyLocation})`);

    const response = await fetch("https://api.indexnow.org/IndexNow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host,
        key: indexNowKey,
        keyLocation,
        urlList: [url],
      }),
    });

    if (!response.ok) {
      console.error(`[IndexNow] Submission failed with status: ${response.status}`);
      return { success: false, status: response.status };
    }

    console.log(`[IndexNow] Successfully notified search engines for URL: ${url}`);
    return { success: true, status: response.status };
  } catch (error: any) {
    console.error("[IndexNow] Error during submission:", error.message);
    return { success: false, error: error.message };
  }
}
