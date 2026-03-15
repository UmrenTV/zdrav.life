/**
 * Seed authors from posts (dedupe). Uploads avatar from public/ to Strapi and links to author.
 */

import { loadJson } from '../lib/load-json';
import { createEntry, getCollection } from '../lib/client';
import { uploadFile } from '../lib/upload';

interface PostJson {
  author: {
    id: string;
    name: string;
    slug: string;
    bio: string;
    avatar: string;
    socialLinks?: { platform: string; label: string; url: string }[];
  };
}

export async function seedAuthors(): Promise<Map<string, string>> {
  const posts = await loadJson<PostJson[]>('posts.json');
  const seen = new Map<string, PostJson['author']>();
  posts.forEach((p) => {
    if (!seen.has(p.author.id)) seen.set(p.author.id, p.author);
  });

  const idMap = new Map<string, string>();
  for (const [oldId, author] of seen) {
    const existing = await getCollection<{ slug: string }>('authors', {
      filters: { slug: author.slug },
      publicationState: 'preview',
    });
    if (existing.length > 0) {
      const doc = existing[0] as { documentId?: string };
      if (doc.documentId) idMap.set(oldId, doc.documentId);
      console.log(`  Author "${author.name}" already exists, skip create`);
      continue;
    }
    const socialLinks = (author.socialLinks || []).map((s) => ({
      platform: s.platform,
      label: s.label,
      href: s.url,
    }));
    const created = await createEntry<{ documentId?: string }>('authors', {
      name: author.name,
      slug: author.slug,
      bio: author.bio,
      role: undefined,
      socialLinks: socialLinks.length ? socialLinks : undefined,
    });
    const docId = (created as { documentId?: string }).documentId;
    if (docId) {
      idMap.set(oldId, docId);
      if (author.avatar) {
        const id = await uploadFile(author.avatar, {
          linkToEntry: { ref: 'api::author.author', refId: docId, field: 'avatar' },
          alternativeText: author.name,
        });
        if (id) console.log(`    Uploaded avatar: ${author.avatar}`);
      }
    }
    console.log(`  Created author: ${author.name} (${docId})`);
  }
  return idMap;
}
