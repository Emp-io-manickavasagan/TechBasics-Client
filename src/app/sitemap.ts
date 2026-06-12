import { MetadataRoute } from 'next';
import { getPostsServer } from '@/lib/db';

// Always fetch fresh data — never use a stale build-time snapshot.
// The Firestore REST call inside getPostsServer uses cache: "no-store",
// so every sitemap request hits Firestore directly and returns current posts.
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.techbasics.online')
    .trim()
    .replace(/\/+$/, '');

  try {
    const posts = await getPostsServer();

    const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${baseUrl}/${post.slug}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1.0,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/privacy-policy`,
        lastModified: new Date(),
        changeFrequency: 'yearly' as const,
        priority: 0.3,
      },
      {
        url: `${baseUrl}/terms-of-service`,
        lastModified: new Date(),
        changeFrequency: 'yearly' as const,
        priority: 0.3,
      },
      ...postEntries,
    ];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1.0,
      },
    ];
  }
}
