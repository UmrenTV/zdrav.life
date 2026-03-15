import { Suspense } from 'react';
import { searchContent, getSiteConfig } from '@/lib/data/data-source';
import { generateMetadata as genMeta } from '@/lib/seo/metadata';
import { SearchForm } from '@/components/search/search-form';
import { SearchResults } from '@/components/search/search-results';

export async function generateMetadata() {
  const config = await getSiteConfig();
  return genMeta(
    {
      title: 'Search',
      description: 'Search across blog posts, products, and videos on ZdravLife.',
      noIndex: true,
    },
    config
  );
}

interface SearchPageProps {
  searchParams: { q?: string; type?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = (searchParams.q || '').trim();
  const typeFilter = searchParams.type;

  const results = query.length >= 2 ? await searchContent(query) : [];

  return (
    <div className="pt-24 pb-16">
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-2xl mx-auto text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 mb-6">
            Discover
          </span>
          <h1 className="text-heading-1 font-heading font-bold mb-6">
            Search
          </h1>
          <p className="text-muted-foreground mb-8">
            Find articles, products, and videos across ZdravLife.
          </p>
          <SearchForm initialQuery={query} initialType={typeFilter} />
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense key={query} fallback={<div className="h-64 bg-muted/50 animate-pulse rounded-xl" />}>
          <SearchResults results={results} query={query} typeFilter={typeFilter} />
        </Suspense>
      </section>
    </div>
  );
}
