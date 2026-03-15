import { notFound } from 'next/navigation';
import { getPostsByTag, getTagBySlug, getSiteConfig } from '@/lib/data/data-source';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { BlogGrid } from '@/components/blog/blog-grid';
import Link from 'next/link';

interface TagPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: TagPageProps) {
  const [tag, config] = await Promise.all([getTagBySlug(params.slug), getSiteConfig()]);
  const siteName = config?.name || 'ZdravLife';
  if (!tag) return generateSEOMetadata({ title: 'Tag Not Found' }, config);
  return generateSEOMetadata(
    {
      title: tag.name,
      description: `Articles tagged with ${tag.name} on ${siteName}.`,
      ogType: 'website',
    },
    config
  );
}

export async function generateStaticParams() {
  const { getAllTags } = await import('@/lib/data/services');
  const tags = await getAllTags();
  return tags.map((t) => ({ slug: t.slug }));
}

export default async function TagPage({ params }: TagPageProps) {
  const tag = await getTagBySlug(params.slug);
  if (!tag) notFound();

  const posts = await getPostsByTag(params.slug);

  return (
    <div className="pt-24 pb-16">
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-2xl">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-foreground">Tag: {tag.name}</span>
          </nav>
          <h1 className="text-heading-1 font-heading font-bold mb-4">
            {tag.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            {posts.length} article{posts.length !== 1 ? 's' : ''} tagged with {tag.name}
          </p>
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
