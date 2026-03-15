import { getFeaturedGalleryItems } from '@/lib/data/data-source';
import { GalleryStripSectionClient } from './gallery-strip-section-client';
export async function GalleryStripSection() {
  const items = await getFeaturedGalleryItems(8);

  if (items.length === 0) return null;

  return <GalleryStripSectionClient items={items} />;
}
