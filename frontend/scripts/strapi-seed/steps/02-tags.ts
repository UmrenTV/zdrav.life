/**
 * Seed tags from posts (dedupe).
 */

import { loadJson } from '../lib/load-json';
import { createEntry, getCollection } from '../lib/client';

interface PostJson {
  tags: { id: string; slug: string; name: string }[];
}

export async function seedTags(): Promise<Map<string, string>> {
  const posts = await loadJson<PostJson[]>('posts.json');
  const seen = new Map<string, { name: string; slug: string }>();
  posts.forEach((p) => {
    p.tags.forEach((t) => {
      if (!seen.has(t.id)) seen.set(t.id, { name: t.name, slug: t.slug });
    });
  });

  const idMap = new Map<string, string>();
  for (const [oldId, tag] of seen) {
    const existing = await getCollection<{ slug: string }>('tags', {
      filters: { slug: tag.slug },
      publicationState: 'preview',
    });
    if (existing.length > 0) {
      const doc = existing[0] as { documentId?: string };
      if (doc.documentId) idMap.set(oldId, doc.documentId);
      console.log(`  Tag "${tag.name}" already exists, skip create`);
      continue;
    }
    const created = await createEntry<{ documentId?: string }>('tags', {
      name: tag.name,
      slug: tag.slug,
    });
    const docId = (created as { documentId?: string }).documentId;
    if (docId) idMap.set(oldId, docId);
    console.log(`  Created tag: ${tag.name} (${docId})`);
  }
  return idMap;
}
