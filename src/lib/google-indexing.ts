import crypto from "crypto";

const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
// Replace literal '\n' sequences with actual newline characters
const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

/**
 * Exchanges the service account JWT for a Google OAuth2 access token.
 */
async function getGoogleAccessToken(): Promise<string> {
  if (!clientEmail || !privateKey) {
    throw new Error("Google Indexing API credentials are not set in environment variables.");
  }

  const header = { alg: "RS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);

  const claim = {
    iss: clientEmail,
    scope: "https://www.googleapis.com/auth/indexing",
    aud: "https://www.googleapis.com/oauth2/v4/token",
    exp: now + 3600, // Token valid for 1 hour
    iat: now,
  };

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString("base64url");
  const encodedClaim = Buffer.from(JSON.stringify(claim)).toString("base64url");
  const tokenInput = `${encodedHeader}.${encodedClaim}`;

  const signature = crypto
    .createSign("RSA-SHA256")
    .update(tokenInput)
    .sign(privateKey, "base64url");

  const signedJwt = `${tokenInput}.${signature}`;

  const tokenRes = await fetch("https://www.googleapis.com/oauth2/v4/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: signedJwt,
    }),
  });

  if (!tokenRes.ok) {
    const errorText = await tokenRes.text();
    throw new Error(`Failed to obtain Google access token: ${tokenRes.status} ${errorText}`);
  }

  const data = await tokenRes.json();
  return data.access_token;
}

/**
 * Notifies Google of an updated or deleted URL using the Indexing API.
 * 
 * @param url The full URL of the page (e.g., https://www.techbasics.online/my-post)
 * @param type Either 'URL_UPDATED' (new/edited content) or 'URL_DELETED'
 */
export async function submitToGoogleIndexing(
  url: string,
  type: "URL_UPDATED" | "URL_DELETED" = "URL_UPDATED"
) {
  try {
    if (!clientEmail || !privateKey) {
      console.warn("[Google Indexing] Credentials not configured. Skipping Google indexing.");
      return { success: false, reason: "Credentials not configured" };
    }

    console.log(`[Google Indexing] Requesting access token for service account: ${clientEmail}`);
    const accessToken = await getGoogleAccessToken();

    console.log(`[Google Indexing] Submitting ${type} notification to Google for URL: ${url}`);
    const response = await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        url,
        type,
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      console.error("[Google Indexing] API Error:", result);
      return { success: false, error: result };
    }

    console.log(`[Google Indexing] Success for URL: ${url}`);
    return { success: true, result };
  } catch (error: any) {
    console.error("[Google Indexing] Error during submission:", error.message);
    return { success: false, error: error.message };
  }
}
