import { getLatestGalleryItemsDs } from '@/lib/data/data-source';
import { GalleryStripSectionClient } from './gallery-strip-section-client';
import type { HomePageData } from '@/types';

export async function GalleryStripSection({ home }: { home?: HomePageData }) {
  const cfg = home?.sectionGallery;
  if (cfg?.enableSection === false) return null;

  const count = cfg?.latestCount ?? 8;
  const featuredOnly = cfg?.featuredOnly ?? true;

  const items = await getLatestGalleryItemsDs(count, featuredOnly);
  if (items.length === 0) return null;
  return <GalleryStripSectionClient items={items} section={cfg} />;
}
