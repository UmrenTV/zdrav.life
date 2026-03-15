'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PostCategory, Tag } from '@/types';

interface BlogFiltersProps {
  categories: PostCategory[];
  tags: Tag[];
  activeCategory?: string;
  activeTag?: string;
}

export function BlogFilters({
  categories,
  tags,
  activeCategory,
  activeTag,
}: BlogFiltersProps) {
  const [showAllTags, setShowAllTags] = useState(false);
  const displayedTags = showAllTags ? tags : tags.slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Active Filters */}
      {(activeCategory || activeTag) && (
        <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Active Filters</span>
            <Link
              href="/blog"
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              Clear all
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeCategory && (
              <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                Category: {categories.find((c) => c.slug === activeCategory)?.name}
              </span>
            )}
            {activeTag && (
              <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                Tag: {tags.find((t) => t.slug === activeTag)?.name}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Categories */}
      <div>
        <h3 className="font-heading font-semibold mb-3">Categories</h3>
        <div className="space-y-1">
          <Link
            href="/blog"
            className={cn(
              'block px-3 py-2 rounded-lg text-sm transition-colors',
              !activeCategory
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            )}
          >
            All Categories
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/blog?category=${category.slug}`}
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
                {category.postCount}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <h3 className="font-heading font-semibold mb-3">Popular Tags</h3>
        <div className="flex flex-wrap gap-2">
          {displayedTags.map((tag) => (
            <Link
              key={tag.id}
              href={`/blog?tag=${tag.slug}`}
              className={cn(
                'px-3 py-1 rounded-full text-xs transition-colors',
                activeTag === tag.slug
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              )}
            >
              {tag.name}
            </Link>
          ))}
        </div>
        {tags.length > 10 && (
          <button
            onClick={() => setShowAllTags(!showAllTags)}
            className="mt-3 text-xs text-primary hover:underline flex items-center gap-1"
          >
            {showAllTags ? 'Show less' : `Show all ${tags.length} tags`}
            <ChevronDown
              className={cn(
                'h-3 w-3 transition-transform',
                showAllTags && 'rotate-180'
              )}
            />
          </button>
        )}
      </div>
    </div>
  );
}
