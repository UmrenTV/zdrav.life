import { getLatestVideosDs } from '@/lib/data/data-source';
import { ContentShowcase } from './content-showcase';
import type { HomePageData, FeaturedContentItem, SectionConfig } from '@/types';

const DEFAULT_SECTION: SectionConfig = {
  heading: 'Latest Videos',
  subheading: 'Training tutorials, adventure vlogs, and deep dives.',
  viewAllLabel: 'View All',
  viewAllHref: '/videos',
};

export async function LatestVideosSection({ home }: { home?: HomePageData }) {
  const cfg = home?.sectionVideos ?? DEFAULT_SECTION;
  if (cfg.enableSection === false) return null;

  const count = cfg.latestCount ?? 5;
  const featuredOnly = cfg.featuredOnly ?? false;

  const videos = await getLatestVideosDs(count, featuredOnly);
  if (videos.length === 0) return null;

  const [first, ...rest] = videos;

  const toItem = (v: typeof first): FeaturedContentItem => ({
    type: 'video',
    id: v.id,
    slug: v.slug || v.id,
    title: v.title,
    subtitle: v.description,
    image: v.thumbnail,
    category: v.category,
    categoryHref: v.category ? `/videos?category=${encodeURIComponent(v.category)}` : undefined,
    tags: v.tags,
    publishedAt: v.publishedAt,
    info: v.duration ? `${v.duration} min long` : undefined,
    href: `/videos/${v.slug || v.id}`,
  });

  return (
    <ContentShowcase
      topPromoted={toItem(first)}
      items={rest.map(toItem)}
      section={{ ...DEFAULT_SECTION, ...cfg }}
      layout="right"
      bgClassName=""
    />
  );
}
