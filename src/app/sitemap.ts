import { MetadataRoute } from 'next';
import { getPosts } from '@/lib/db';

// Revalidate every hour — so Google sees new posts quickly after publishing
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.techbasics.online')
    .trim()
    .replace(/\/+$/, '');

  try {
    const posts = await getPosts();

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
        url: `${baseUrl}/privacy`,
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