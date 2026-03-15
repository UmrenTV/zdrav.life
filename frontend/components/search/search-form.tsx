'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchFormProps {
  initialQuery?: string;
  initialType?: string;
}

export function SearchForm({ initialQuery = '', initialType }: SearchFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const q = query.trim();
      const params = new URLSearchParams(searchParams.toString());
      if (q) params.set('q', q);
      else params.delete('q');
      router.push(`/search${params.toString() ? `?${params.toString()}` : ''}`);
    },
    [query, router, searchParams]
  );

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts, products, videos..."
          className="pl-10"
          aria-label="Search"
        />
      </div>
      <Button type="submit">Search</Button>
    </form>
  );
}
