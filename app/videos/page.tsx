import { Suspense } from 'react';
import { getAllVideos, getVideosByCategory } from '@/lib/data/services';
import { generateMetadata } from '@/lib/seo/metadata';
import { VideoGrid } from '@/components/videos/video-grid';
import { VideoHero } from '@/components/videos/video-hero';

export const metadata = generateMetadata({
  title: 'Videos',
  description: 'Training tutorials, adventure vlogs, and deep dives into the ZdravLife philosophy. Subscribe for weekly content on calisthenics, fasting, motorcycle travel, and high-performance living.',
  ogType: 'website',
});

interface VideosPageProps {
  searchParams: {
    category?: string;
  };
}

export default async function VideosPage({ searchParams }: VideosPageProps) {
  const category = searchParams.category;
  
  const videos = category 
    ? await getVideosByCategory(category)
    : await getAllVideos();

  const categories = ['Training', 'Adventure', 'Nutrition', 'Lifestyle'];

  return (
    <>
      <VideoHero />
      
      <div className="section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            <a
              href="/videos"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                !category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              All Videos
            </a>
            {categories.map((cat) => (
              <a
                key={cat}
                href={`/videos?category=${cat.toLowerCase()}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  category?.toLowerCase() === cat.toLowerCase()
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {cat}
              </a>
            ))}
          </div>

          <Suspense fallback={<div className="h-96 bg-muted/50 animate-pulse rounded-xl" />}>
            <VideoGrid videos={videos} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
