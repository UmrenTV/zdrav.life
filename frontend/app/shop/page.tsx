import { Suspense } from 'react';
import { getPaginatedProducts, getAllProductCategories, getSiteConfig } from '@/lib/data/data-source';
import { ShopHero } from '@/components/shop/shop-hero';
import { ProductGrid } from '@/components/shop/product-grid';
import { ProductFilters } from '@/components/shop/product-filters';
import { Pagination } from '@/components/ui/pagination';
import { generateMetadata as genMeta, buildListingPaginationUrls, siteUrl } from '@/lib/seo/metadata';
import type { Metadata } from 'next';

interface ShopPageProps {
  searchParams: {
    page?: string;
    category?: string;
    sort?: 'price-asc' | 'price-desc' | 'newest' | 'popular';
  };
}

export async function generateMetadata({ searchParams }: ShopPageProps): Promise<Metadata> {
  const page = parseInt(searchParams.page || '1');
  const [config, { pagination }] = await Promise.all([
    getSiteConfig(),
    getPaginatedProducts(page, 12, { category: searchParams.category, sortBy: searchParams.sort }),
  ]);
  const urls = buildListingPaginationUrls('/shop', page, pagination.totalPages, {
    category: searchParams.category,
    sort: searchParams.sort,
  });
  const baseUrl = (config?.url || siteUrl).replace(/\/$/, '');
  return genMeta(
    {
      title: 'Shop',
      description:
        'Premium apparel, digital guides, and gear for the pursuit of vitality. Engineer your vitality with ZdravLife merchandise.',
      ogType: 'website',
      canonicalUrl: urls.canonicalPath,
      prevUrl: urls.prevPath ? `${baseUrl}${urls.prevPath}` : undefined,
      nextUrl: urls.nextPath ? `${baseUrl}${urls.nextPath}` : undefined,
    },
    config
  );
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const page = parseInt(searchParams.page || '1');
  const category = searchParams.category;
  const sortBy = searchParams.sort;

  const [{ products, pagination }, categories] = await Promise.all([
    getPaginatedProducts(page, 12, {
      category,
      sortBy,
    }),
    getAllProductCategories(),
  ]);

  const query = new URLSearchParams();
  if (category) query.set('category', category);
  if (sortBy) query.set('sort', sortBy);
  const baseUrl = query.toString() ? `/shop?${query.toString()}` : '/shop';

  return (
    <>
      <ShopHero />
      
      <div className="section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24">
                <Suspense fallback={<div className="h-64 bg-muted/50 animate-pulse rounded-xl" />}>
                  <ProductFilters 
                    categories={categories}
                    activeCategory={category}
                    activeSort={sortBy}
                  />
                </Suspense>
              </div>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Suspense fallback={<div className="h-96 bg-muted/50 animate-pulse rounded-xl" />}>
                <ProductGrid products={products} />
              </Suspense>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-12">
                  <Pagination 
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    baseUrl={baseUrl}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
