import { getLatestProductsDs } from '@/lib/data/data-source';
import { ContentShowcase } from './content-showcase';
import type { HomePageData, FeaturedContentItem, SectionConfig } from '@/types';

const DEFAULT_SECTION: SectionConfig = {
  heading: 'Shop the Brand',
  subheading: 'Premium apparel, digital guides, and gear for the pursuit of vitality.',
  viewAllLabel: 'View All',
  viewAllHref: '/shop',
};

export async function LatestShopSection({ home }: { home?: HomePageData }) {
  const cfg = home?.sectionShop ?? DEFAULT_SECTION;
  if (cfg.enableSection === false) return null;

  const count = cfg.latestCount ?? 5;
  const featuredOnly = cfg.featuredOnly ?? false;

  const products = await getLatestProductsDs(count, featuredOnly);
  if (products.length === 0) return null;

  const [first, ...rest] = products;

  const toItem = (p: typeof first): FeaturedContentItem => {
    const primaryImage = p.images.find((img) => img.isPrimary) || p.images[0];
    const price = p.price != null ? `${p.currency} ${p.price.toFixed(2)}` : undefined;
    return {
      type: 'product',
      id: p.id,
      slug: p.slug,
      title: p.title,
      subtitle: p.shortDescription,
      image: primaryImage?.url ?? '',
      category: p.category.name,
      categoryHref: p.category.slug ? `/shop?category=${p.category.slug}` : undefined,
      tags: p.tags,
      publishedAt: p.createdAt,
      info: price,
      href: `/shop/${p.slug}`,
    };
  };

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
