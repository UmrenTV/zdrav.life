import { notFound } from 'next/navigation';
import { getPostsByCategory, getCategoryBySlug, getSiteConfig } from '@/lib/data/data-source';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { BlogGrid } from '@/components/blog/blog-grid';
import Link from 'next/link';

interface CategoryPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const [category, config] = await Promise.all([getCategoryBySlug(params.slug), getSiteConfig()]);
  const siteName = config?.name || 'ZdravLife';
  if (!category) return generateSEOMetadata({ title: 'Category Not Found' }, config);
  return generateSEOMetadata(
    {
      title: category.name,
      description: category.description || `Articles in ${category.name} on ${siteName}.`,
      ogType: 'website',
    },
    config
  );
}

export async function generateStaticParams() {
  const { getAllPostCategories } = await import('@/lib/data/services');
  const categories = await getAllPostCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await getCategoryBySlug(params.slug);
  if (!category) notFound();

  const posts = await getPostsByCategory(params.slug);

  return (
    <div className="pt-24 pb-16">
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-2xl">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-foreground">{category.name}</span>
          </nav>
          <h1 className="text-heading-1 font-heading font-bold mb-4">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-muted-foreground">{category.description}</p>
          )}
          <p className="text-sm text-muted-foreground mt-2">
            {posts.length} article{posts.length !== 1 ? 's' : ''}
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
