import { getFeaturedGalleryItems } from '@/lib/data/data-source';
import { GalleryStripSectionClient } from './gallery-strip-section-client';
import type { HomePageData } from '@/types';

export async function GalleryStripSection({ home }: { home?: HomePageData }) {
  const items = await getFeaturedGalleryItems(8);
  if (items.length === 0) return null;
  return <GalleryStripSectionClient items={items} section={home?.sectionGallery} />;
}
