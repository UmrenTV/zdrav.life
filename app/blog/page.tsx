import { Suspense } from 'react';
import { getPaginatedPosts, getAllPostCategories, getAllTags } from '@/lib/data/services';
import { BlogHero } from '@/components/blog/blog-hero';
import { BlogGrid } from '@/components/blog/blog-grid';
import { BlogFilters } from '@/components/blog/blog-filters';
import { Pagination } from '@/components/ui/pagination';
import { generateMetadata } from '@/lib/seo/metadata';

export const metadata = generateMetadata({
  title: 'Blog',
  description: 'Deep dives into training, nutrition, discipline, and the pursuit of excellence. Explore articles on calisthenics, fasting, motorcycle travel, and high-performance living.',
  ogType: 'website',
});

interface BlogPageProps {
  searchParams: {
    page?: string;
    category?: string;
    tag?: string;
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const page = parseInt(searchParams.page || '1');
  const category = searchParams.category;
  const tag = searchParams.tag;

  const [{ posts, pagination }, categories, tags] = await Promise.all([
    getPaginatedPosts(page, 9),
    getAllPostCategories(),
    getAllTags(),
  ]);

  return (
    <>
      <BlogHero />
      
      <div className="section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24">
                <Suspense fallback={<div className="h-64 bg-muted/50 animate-pulse rounded-xl" />}>
                  <BlogFilters 
                    categories={categories} 
                    tags={tags} 
                    activeCategory={category}
                    activeTag={tag}
                  />
                </Suspense>
              </div>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Suspense fallback={<div className="h-96 bg-muted/50 animate-pulse rounded-xl" />}>
                <BlogGrid posts={posts} />
              </Suspense>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-12">
                  <Pagination 
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    baseUrl="/blog"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
