import { getFeaturedVideos } from '@/lib/data/data-source';
import { FeaturedVideosSectionClient } from './featured-videos-section-client';
import type { HomePageData } from '@/types';

export async function FeaturedVideosSection({ home }: { home?: HomePageData }) {
  const videos = await getFeaturedVideos(3);
  if (videos.length === 0) return null;
  return <FeaturedVideosSectionClient videos={videos} section={home?.sectionVideos} />;
}
