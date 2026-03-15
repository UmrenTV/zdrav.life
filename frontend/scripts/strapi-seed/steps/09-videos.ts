/**
 * Seed videos. Uses category slug (from name) for relation.
 */

import { loadJson } from '../lib/load-json';
import { createEntry, getCollection } from '../lib/client';

interface VideoJson {
  id: string;
  title: string;
  youtubeId: string;
  description: string;
  thumbnail: string;
  duration: string;
  publishedAt: string;
  category: string;
  tags: string[];
  featured: boolean;
}

function slugFromName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export async function seedVideos(
  categorySlugToDocId: Map<string, string>
): Promise<Map<string, string>> {
  const videos = await loadJson<VideoJson[]>('videos.json');
  const idMap = new Map<string, string>();

  for (const v of videos) {
    const existing = await getCollection<{ slug: string }>('videos', {
      filters: { slug: slugFromName(v.title) },
      publicationState: 'preview',
    });
    if (existing.length > 0) {
      const doc = existing[0] as { documentId?: string };
      if (doc.documentId) idMap.set(v.id, doc.documentId);
      console.log(`  Video "${v.title}" already exists, skip`);
      continue;
    }

    const categorySlug = slugFromName(v.category);
    const categoryDocId = categorySlugToDocId.get(categorySlug);

    const data: Record<string, unknown> = {
      title: v.title,
      slug: slugFromName(v.title),
      platform: 'youtube',
      youtubeVideoId: v.youtubeId,
      excerpt: v.description?.slice(0, 300),
      featured: v.featured,
      publishedAt: v.publishedAt || null,
      duration: v.duration,
    };
    if (categoryDocId) (data as Record<string, unknown>).category = { connect: [categoryDocId] };

    const created = await createEntry<{ documentId?: string }>('videos', data);
    const docId = (created as { documentId?: string }).documentId;
    if (docId) idMap.set(v.id, docId);
    console.log(`  Created video: ${v.title} (${docId})`);
  }
  return idMap;
}
