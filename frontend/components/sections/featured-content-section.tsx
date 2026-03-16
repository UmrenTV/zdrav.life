import { getFeaturedPosts } from '@/lib/data/data-source';
import { ContentShowcase } from './content-showcase';
import type { HomePageData, FeaturedContentItem } from '@/types';

export async function FeaturedContentSection({ home }: { home?: HomePageData }) {
  if (home?.sectionFeaturedContent?.enableSection === false) return null;

  const topPromoted = home?.topPromoted;
  const featuredContent = home?.featuredContent;

  if (topPromoted || (featuredContent && featuredContent.length > 0)) {
    return (
      <ContentShowcase
        topPromoted={topPromoted}
        items={featuredContent ?? []}
        section={home?.sectionFeaturedContent}
      />
    );
  }

  const posts = await getFeaturedPosts(3);
  if (posts.length === 0) return null;

  const toTagNames = (tags: { name: string }[]): string[] =>
    tags.map((t) => t.name);

  const fallbackTop: FeaturedContentItem = {
    type: 'article',
    id: posts[0].id,
    slug: posts[0].slug,
    title: posts[0].title,
    subtitle: posts[0].excerpt,
    image: posts[0].coverImage,
    category: posts[0].category.name,
    tags: toTagNames(posts[0].tags),
    publishedAt: posts[0].publishedAt,
    info: posts[0].readingTime ? `${posts[0].readingTime} min read` : undefined,
    href: `/blog/${posts[0].slug}`,
  };

  const fallbackItems: FeaturedContentItem[] = posts.slice(1).map((post) => ({
    type: 'article' as const,
    id: post.id,
    slug: post.slug,
    title: post.title,
    subtitle: post.excerpt,
    image: post.coverImage,
    category: post.category.name,
    tags: toTagNames(post.tags),
    publishedAt: post.publishedAt,
    info: post.readingTime ? `${post.readingTime} min read` : undefined,
    href: `/blog/${post.slug}`,
  }));

  return (
    <ContentShowcase
      topPromoted={fallbackTop}
      items={fallbackItems}
      section={home?.sectionFeaturedContent}
    />
  );
}
