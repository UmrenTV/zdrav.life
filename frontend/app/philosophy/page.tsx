import { getPostsByCategory, getSiteConfig } from '@/lib/data/data-source';
import { generateMetadata as genMeta } from '@/lib/seo/metadata';
import { BlogGrid } from '@/components/blog/blog-grid';
import Link from 'next/link';
import { Brain, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export async function generateMetadata() {
  const config = await getSiteConfig();
  return genMeta(
    {
      title: 'Philosophy',
      description: 'Discipline, mindset, and systems thinking. Essays on identity, struggle, and the pursuit of a life well lived.',
      ogType: 'website',
    },
    config
  );
}

export default async function PhilosophyPage() {
  const posts = await getPostsByCategory('philosophy');

  return (
    <div className="pt-24 pb-16">
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 mb-6">
            <Brain className="h-3 w-3" /> Mindset & Systems
          </span>
          <h1 className="text-heading-1 font-heading font-bold mb-6">
            Philosophy
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Discipline over motivation. Systems over willpower. Deeper essays on how we think, work, and live.
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href="/blog?category=philosophy" className="flex items-center gap-2">
              All philosophy posts <ArrowRight className="h-4 w-4" />
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
