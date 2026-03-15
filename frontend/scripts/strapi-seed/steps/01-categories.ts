/**
 * Seed categories from posts, videos, and gallery. Used for blog + video + gallery category relations.
 */

import { loadJson } from '../lib/load-json';
import { createEntry, getCollection } from '../lib/client';

interface PostJson {
  category: { id: string; slug: string; name: string; description?: string };
}
interface VideoJson { category: string }
interface GalleryJson { category: string }

function slugFromName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export async function seedCategories(): Promise<{ idMap: Map<string, string>; slugToDocId: Map<string, string> }> {
  const posts = await loadJson<PostJson[]>('posts.json');
  const videos = await loadJson<VideoJson[]>('videos.json').catch(() => []);
  const gallery = await loadJson<GalleryJson[]>('gallery.json').catch(() => []);

  const seen = new Map<string, { name: string; slug: string; description: string }>();
  posts.forEach((p) => {
    if (!seen.has(p.category.id)) {
      seen.set(p.category.id, {
        name: p.category.name,
        slug: p.category.slug,
        description: (p.category as { description?: string }).description || '',
      });
    }
  });
  videos.forEach((v) => {
    const name = v.category || 'Uncategorized';
    const slug = slugFromName(name);
    if (!Array.from(seen.values()).some((c) => c.slug === slug)) {
      seen.set(`video-${slug}`, { name, slug, description: '' });
    }
  });
  gallery.forEach((g) => {
    const name = (g.category || 'uncategorized').charAt(0).toUpperCase() + (g.category || '').slice(1);
    const slug = slugFromName(g.category || 'uncategorized');
    if (!Array.from(seen.values()).some((c) => c.slug === slug)) {
      seen.set(`gallery-${slug}`, { name, slug, description: '' });
    }
  });

  const idMap = new Map<string, string>(); // old id -> documentId
  const slugToDocId = new Map<string, string>();
  for (const [oldId, cat] of Array.from(seen.entries())) {
    const existing = await getCollection<{ slug: string }>('categories', {
      filters: { slug: cat.slug },
      publicationState: 'preview', // include draft so we find just-created entries
    });
    if (existing.length > 0) {
      const doc = existing[0] as { documentId?: string };
      if (doc.documentId) {
        idMap.set(oldId, doc.documentId);
        slugToDocId.set(cat.slug, doc.documentId);
      }
      console.log(`  Category "${cat.name}" already exists, skip create`);
      continue;
    }
    const created = await createEntry<{ documentId?: string }>('categories', {
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
    });
    const docId = (created as { documentId?: string }).documentId;
    if (docId) {
      idMap.set(oldId, docId);
      slugToDocId.set(cat.slug, docId);
    }
    console.log(`  Created category: ${cat.name} (${docId})`);
  }
  return { idMap, slugToDocId };
}
