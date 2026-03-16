import { getFeaturedProducts } from '@/lib/data/data-source';
import { FeaturedShopSectionClient } from './featured-shop-section-client';
import type { HomePageData } from '@/types';

export async function FeaturedShopSection({ home }: { home?: HomePageData }) {
  const products = await getFeaturedProducts(4);
  if (products.length === 0) return null;
  return <FeaturedShopSectionClient products={products} section={home?.sectionShop} />;
}
