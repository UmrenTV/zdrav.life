import { getPostsByCategory, getSiteConfig } from '@/lib/data/data-source';
import { generateMetadata as genMeta } from '@/lib/seo/metadata';
import { BlogGrid } from '@/components/blog/blog-grid';
import Link from 'next/link';
import { Dumbbell, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export async function generateMetadata() {
  const config = await getSiteConfig();
  return genMeta(
    {
      title: 'Training',
      description: 'Calisthenics, hypertrophy, and strength systems. Protocols, progressions, and the philosophy of consistent training.',
      ogType: 'website',
    },
    config
  );
}

export default async function TrainingPage() {
  const posts = await getPostsByCategory('training');

  return (
    <div className="pt-24 pb-16">
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 mb-6">
            <Dumbbell className="h-3 w-3" /> Strength & Movement
          </span>
          <h1 className="text-heading-1 font-heading font-bold mb-6">
            Training
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Calisthenics progressions, hypertrophy programming, and the systems behind sustainable strength.
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href="/blog?category=training" className="flex items-center gap-2">
              All training posts <ArrowRight className="h-4 w-4" />
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
