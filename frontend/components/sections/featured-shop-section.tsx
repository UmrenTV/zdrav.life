import { getFeaturedProducts } from '@/lib/data/data-source';
import { FeaturedShopSectionClient } from './featured-shop-section-client';
export async function FeaturedShopSection() {
  const products = await getFeaturedProducts(4);
  if (products.length === 0) return null;
  return <FeaturedShopSectionClient products={products} />;
}
