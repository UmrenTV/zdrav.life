import { getLatestPosts } from '@/lib/data/data-source';
import { FeaturedBlogSectionClient } from './featured-blog-section-client';
import type { HomePageData } from '@/types';

export async function FeaturedBlogSection({ home }: { home?: HomePageData }) {
  const posts = await getLatestPosts(3);
  if (posts.length === 0) return null;
  return <FeaturedBlogSectionClient posts={posts} section={home?.sectionBlog} />;
}
