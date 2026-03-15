import { getPostsByCategory, getSiteConfig } from '@/lib/data/data-source';
import { generateMetadata as genMeta } from '@/lib/seo/metadata';
import { BlogGrid } from '@/components/blog/blog-grid';
import Link from 'next/link';
import { Utensils, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export async function generateMetadata() {
  const config = await getSiteConfig();
  return genMeta(
    {
      title: 'Nutrition',
      description: 'Fasting protocols, meal systems, and nutritional optimization for high performance. Evidence-based approaches to fuel your body and mind.',
      ogType: 'website',
    },
    config
  );
}

export default async function NutritionPage() {
  const posts = await getPostsByCategory('nutrition');

  return (
    <div className="pt-24 pb-16">
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 mb-6">
            <Utensils className="h-3 w-3" /> Fuel & Fasting
          </span>
          <h1 className="text-heading-1 font-heading font-bold mb-6">
            Nutrition
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Fasting, meal structure, and longevity-focused nutrition. Systems that support cognitive performance and body composition.
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href="/blog?category=nutrition" className="flex items-center gap-2">
              All nutrition posts <ArrowRight className="h-4 w-4" />
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
