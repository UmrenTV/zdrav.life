import { getFeaturedVideos } from '@/lib/data/data-source';
import { FeaturedVideosSectionClient } from './featured-videos-section-client';
export async function FeaturedVideosSection() {
  const videos = await getFeaturedVideos(3);
  if (videos.length === 0) return null;
  return <FeaturedVideosSectionClient videos={videos} />;
}
