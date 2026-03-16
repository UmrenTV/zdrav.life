import { getLatestPosts } from '@/lib/data/data-source';
import { ContentShowcase } from './content-showcase';
import type { HomePageData, FeaturedContentItem, SectionConfig } from '@/types';

const DEFAULT_SECTION: SectionConfig = {
  heading: 'From the Journal',
  subheading: 'Thoughts on training, nutrition, discipline, and the pursuit of excellence.',
  viewAllLabel: 'Read All',
  viewAllHref: '/blog',
};

export async function LatestBlogSection({ home }: { home?: HomePageData }) {
  const cfg = home?.sectionBlog ?? DEFAULT_SECTION;
  if (cfg.enableSection === false) return null;

  const count = cfg.latestCount ?? 5;
  const featuredOnly = cfg.featuredOnly ?? false;

  const posts = await getLatestPosts(count, featuredOnly);
  if (posts.length === 0) return null;

  const [first, ...rest] = posts;

  const toItem = (p: typeof first): FeaturedContentItem => ({
    type: 'article',
    id: p.id,
    slug: p.slug,
    title: p.title,
    subtitle: p.excerpt,
    image: p.coverImage,
    category: p.category.name,
    categoryHref: p.category.slug ? `/blog?category=${p.category.slug}` : undefined,
    tags: p.tags.map((t) => t.name),
    publishedAt: p.publishedAt,
    info: p.readingTime ? `${p.readingTime} min read` : undefined,
    href: `/blog/${p.slug}`,
  });

  return (
    <ContentShowcase
      topPromoted={toItem(first)}
      items={rest.map(toItem)}
      section={{ ...DEFAULT_SECTION, ...cfg }}
      layout="left"
      clickBehavior="link"
      bgClassName="bg-muted/30"
    />
  );
}
