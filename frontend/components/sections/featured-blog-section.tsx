import { getLatestPosts } from '@/lib/data/data-source';
import { FeaturedBlogSectionClient } from './featured-blog-section-client';
export async function FeaturedBlogSection() {
  const posts = await getLatestPosts(3);
  if (posts.length === 0) return null;
  return <FeaturedBlogSectionClient posts={posts} />;
}
