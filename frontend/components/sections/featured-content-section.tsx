import { getFeaturedPosts } from '@/lib/data/data-source';
import { FeaturedContentSectionClient } from './featured-content-section-client';
export async function FeaturedContentSection() {
  const posts = await getFeaturedPosts(3);
  if (posts.length === 0) return null;
  return <FeaturedContentSectionClient posts={posts} />;
}
