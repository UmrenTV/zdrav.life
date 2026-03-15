/**
 * Seed gallery items. Uses category slug for relation.
 */

import { loadJson } from '../lib/load-json';
import { createEntry, getCollection } from '../lib/client';

interface GalleryJson {
  id: string;
  image: string;
  thumbnail: string;
  caption?: string;
  category: string;
  tags: string[];
  featured: boolean;
}

function slugFromName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export async function seedGallery(
  categorySlugToDocId: Map<string, string>
): Promise<Map<string, string>> {
  const items = await loadJson<GalleryJson[]>('gallery.json');
  const idMap = new Map<string, string>();

  for (const g of items) {
    const slug = `gallery-${g.id}`;
    const existing = await getCollection<{ slug: string }>('gallery-items', {
      filters: { slug },
      publicationState: 'preview',
    });
    if (existing.length > 0) {
      const doc = existing[0] as { documentId?: string };
      if (doc.documentId) idMap.set(g.id, doc.documentId);
      console.log(`  Gallery item ${g.id} already exists, skip`);
      continue;
    }

    const categorySlug = slugFromName(g.category);
    const categoryDocId = categorySlugToDocId.get(categorySlug);

    const data: Record<string, unknown> = {
      title: g.caption?.slice(0, 80) || g.id,
      slug,
      caption: g.caption,
      featured: g.featured,
      sourcePlatform: 'instagram',
      publishedAt: new Date().toISOString(),
    };
    if (categoryDocId) (data as Record<string, unknown>).category = { connect: [categoryDocId] };

    const created = await createEntry<{ documentId?: string }>('gallery-items', data);
    const docId = (created as { documentId?: string }).documentId;
    if (docId) idMap.set(g.id, docId);
    console.log(`  Created gallery item: ${g.id} (${docId})`);
  }
  return idMap;
}
