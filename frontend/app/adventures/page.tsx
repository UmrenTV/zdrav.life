import { getPostsByCategory, getSiteConfig } from '@/lib/data/data-source';
import { generateMetadata as genMeta } from '@/lib/seo/metadata';
import { BlogGrid } from '@/components/blog/blog-grid';
import Link from 'next/link';
import { Bike, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export async function generateMetadata() {
  const config = await getSiteConfig();
  return genMeta(
    {
      title: 'Adventures',
      description: 'Motorcycle travel logs, road stories, and scenic journeys. Freedom on two wheels through the Balkans and beyond.',
      ogType: 'website',
    },
    config
  );
}

export default async function AdventuresPage() {
  const posts = await getPostsByCategory('adventure');

  return (
    <div className="pt-24 pb-16">
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 mb-6">
            <Bike className="h-3 w-3" /> Moto & Travel
          </span>
          <h1 className="text-heading-1 font-heading font-bold mb-6">
            Adventures
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Road stories, route notes, and the pursuit of freedom on two wheels. From the Balkans to the next horizon.
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href="/blog?category=adventure" className="flex items-center gap-2">
              All adventure posts <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <BlogGrid posts={posts} />
        </div>
      </section>
    </div>
  );
}
