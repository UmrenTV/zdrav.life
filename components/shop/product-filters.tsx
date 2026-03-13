'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { ProductCategory } from '@/types';

interface ProductFiltersProps {
  categories: ProductCategory[];
  activeCategory?: string;
  activeSort?: string;
}

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

export function ProductFilters({
  categories,
  activeCategory,
  activeSort,
}: ProductFiltersProps) {
  const buildUrl = (params: Record<string, string | undefined>) => {
    const url = new URL('/shop', window.location.origin);
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
    });
    return url.pathname + url.search;
  };

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-heading font-semibold mb-3">Categories</h3>
        <div className="space-y-1">
          <Link
            href="/shop"
            className={cn(
              'block px-3 py-2 rounded-lg text-sm transition-colors',
              !activeCategory
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            )}
          >
            All Products
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={buildUrl({ category: category.slug, sort: activeSort })}
              className={cn(
                'flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
                activeCategory === category.slug
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              )}
            >
              <span>{category.name}</span>
              <span
                className={cn(
                  'text-xs',
                  activeCategory === category.slug
                    ? 'text-primary-foreground/70'
                    : 'text-muted-foreground'
                )}
              >
                {category.productCount}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <h3 className="font-heading font-semibold mb-3">Sort By</h3>
        <div className="space-y-1">
          {sortOptions.map((option) => (
            <Link
              key={option.value}
              href={buildUrl({ category: activeCategory, sort: option.value })}
              className={cn(
                'block px-3 py-2 rounded-lg text-sm transition-colors',
                activeSort === option.value
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              )}
            >
              {option.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
