import { MetadataRoute } from 'next';
import { getPosts } from '@/lib/db';

export const revalidate = 604800; // Revalidate every 7 days (604800 seconds)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.techbasics.online';

  try {
    // Fetch all posts from the database
    const posts = await getPosts();

    // Generate sitemap entries for each post
    const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${baseUrl}/${post.slug}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.createdAt),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

    // Combine all entries
    const sitemap: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1.0,
      },
      {
        url: `${baseUrl}/privacy`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      },
      ...postEntries,
    ];

    return sitemap;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return a basic sitemap if there's an error
    return [
      {
        url: 'https://www.techbasics.online',
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1.0,
      },
    ];
  }
}
