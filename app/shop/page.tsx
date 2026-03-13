import { Suspense } from 'react';
import { getPaginatedProducts, getAllProductCategories } from '@/lib/data/services';
import { ShopHero } from '@/components/shop/shop-hero';
import { ProductGrid } from '@/components/shop/product-grid';
import { ProductFilters } from '@/components/shop/product-filters';
import { Pagination } from '@/components/ui/pagination';
import { generateMetadata } from '@/lib/seo/metadata';

export const metadata = generateMetadata({
  title: 'Shop',
  description: 'Premium apparel, digital guides, and gear for the pursuit of vitality. Engineer your vitality with ZdravLife merchandise.',
  ogType: 'website',
});

interface ShopPageProps {
  searchParams: {
    page?: string;
    category?: string;
    sort?: 'price-asc' | 'price-desc' | 'newest' | 'popular';
  };
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
                    baseUrl="/shop"
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
