import { Suspense } from 'react';
import { getAllGalleryItems, getGalleryByCategory } from '@/lib/data/services';
import { generateMetadata } from '@/lib/seo/metadata';
import { GalleryGrid } from '@/components/gallery/gallery-grid';
import { GalleryHero } from '@/components/gallery/gallery-hero';

export const metadata = generateMetadata({
  title: 'Gallery',
  description: 'A visual journey through training, travel, and the pursuit of vitality. Explore photos from motorcycle adventures, workout sessions, and life on the road.',
  ogType: 'website',
});

interface GalleryPageProps {
  searchParams: {
    category?: string;
  };
}

export default async function GalleryPage({ searchParams }: GalleryPageProps) {
  const category = searchParams.category;
  
  const items = category 
    ? await getGalleryByCategory(category as any)
    : await getAllGalleryItems();

  const categories = [
    { value: 'travel', label: 'Travel' },
    { value: 'training', label: 'Training' },
    { value: 'bike', label: 'Motorcycle' },
    { value: 'nature', label: 'Nature' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'food', label: 'Food' },
  ];

  return (
    <>
      <GalleryHero />
      
      <div className="section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            <a
              href="/gallery"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                !category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              All Photos
            </a>
            {categories.map((cat) => (
              <a
                key={cat.value}
                href={`/gallery?category=${cat.value}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                  category === cat.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {cat.label}
              </a>
            ))}
          </div>

          <Suspense fallback={<div className="h-96 bg-muted/50 animate-pulse rounded-xl" />}>
            <GalleryGrid items={items} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
