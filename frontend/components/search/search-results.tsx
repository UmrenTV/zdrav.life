import Link from 'next/link';
import Image from 'next/image';
import { FileText, ShoppingBag, Video } from 'lucide-react';
import type { SearchResult } from '@/types';
import { formatDate, formatPrice } from '@/lib/utils';

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  typeFilter?: string;
}

const typeLabels: Record<SearchResult['type'], string> = {
  post: 'Article',
  product: 'Product',
  video: 'Video',
  adventure: 'Adventure',
};

const typeIcons = {
  post: FileText,
  product: ShoppingBag,
  video: Video,
  adventure: FileText,
};

export function SearchResults({ results, query }: SearchResultsProps) {
  if (!query || query.length < 2) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 text-muted-foreground">
        <p>Enter at least 2 characters to search.</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <p className="text-muted-foreground mb-2">No results found for &quot;{query}&quot;</p>
        <p className="text-sm text-muted-foreground">Try different keywords or browse Blog, Shop, or Videos.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <p className="text-sm text-muted-foreground mb-6">
        {results.length} result{results.length !== 1 ? 's' : ''} for &quot;{query}&quot;
      </p>
      <ul className="space-y-4">
        {results.map((item) => {
          const Icon = typeIcons[item.type];
          return (
            <li key={`${item.type}-${item.id}`}>
              <Link
                href={item.href}
                className="flex gap-4 p-4 rounded-xl border bg-card hover:border-primary/50 transition-colors"
              >
                {item.image && (
                  <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground mb-1">
                    <Icon className="h-3 w-3" />
                    {typeLabels[item.type]}
                    {item.category && ` · ${item.category}`}
                  </span>
                  <h2 className="font-heading font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                    {item.title}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {item.excerpt}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    {item.publishedAt && <span>{formatDate(item.publishedAt)}</span>}
                    {item.price !== undefined && (
                      <span className="font-medium text-foreground">{formatPrice(item.price)}</span>
                    )}
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
