/**
 * Seed posts. Requires categories, tags, authors to be seeded first.
 * Uploads coverImage and gallery from public/ to Strapi and links to each post.
 */

import { loadJson } from '../lib/load-json';
import { createEntry, getCollection } from '../lib/client';
import { uploadFile, uploadFilesAndLink } from '../lib/upload';

interface PostJson {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  content: string;
  coverImage: string;
  gallery: string[];
  author: { id: string };
  category: { id: string };
  tags: { id: string }[];
  featured: boolean;
  publishedAt: string;
  readingTime: number;
  relatedPostIds: string[];
  seo: { title: string; description: string; keywords?: string[] };
  status: string;
  commentsEnabled?: boolean;
}

export async function seedPosts(
  categoryIdMap: Map<string, string>,
  tagIdMap: Map<string, string>,
  authorIdMap: Map<string, string>
): Promise<Map<string, string>> {
  const posts = await loadJson<PostJson[]>('posts.json');
  const slugToDocId = new Map<string, string>();
  const idToDocId = new Map<string, string>();

  for (const post of posts) {
    const existing = await getCollection<{ slug: string }>('posts', {
      filters: { slug: post.slug },
      publicationState: 'preview',
    });
    if (existing.length > 0) {
      const doc = existing[0] as { documentId?: string };
      if (doc.documentId) {
        idToDocId.set(post.id, doc.documentId);
        slugToDocId.set(post.slug, doc.documentId);
      }
      console.log(`  Post "${post.title}" already exists, skip`);
      continue;
    }

    const authorDocId = authorIdMap.get(post.author.id);
    const categoryDocId = categoryIdMap.get(post.category.id);
    const tagDocIds = post.tags.map((t) => tagIdMap.get(t.id)).filter(Boolean) as string[];

    const data: Record<string, unknown> = {
      title: post.title,
      slug: post.slug,
      subtitle: post.subtitle,
      excerpt: post.excerpt,
      content: post.content,
      featured: post.featured,
      publishedAt: post.publishedAt || null,
      readingTime: post.readingTime || null,
      commentsEnabled: post.commentsEnabled !== false,
      seo: {
        metaTitle: post.seo?.title,
        metaDescription: post.seo?.description,
        keywords: Array.isArray(post.seo?.keywords) ? post.seo.keywords.join(', ') : '',
      },
    };
    if (authorDocId) (data as Record<string, unknown>).author = { connect: [authorDocId] };
    if (categoryDocId) (data as Record<string, unknown>).category = { connect: [categoryDocId] };
    if (tagDocIds.length) (data as Record<string, unknown>).tags = { connect: tagDocIds };

    const created = await createEntry<{ documentId?: string }>('posts', data);
    const docId = (created as { documentId?: string }).documentId;
    if (docId) {
      idToDocId.set(post.id, docId);
      slugToDocId.set(post.slug, docId);

      const ref = 'api::post.post';
      if (post.coverImage) {
        const coverId = await uploadFile(post.coverImage, {
          linkToEntry: { ref, refId: docId, field: 'coverImage' },
          alternativeText: post.title,
        });
        if (coverId) console.log(`    Uploaded cover: ${post.coverImage}`);
      }
      if (Array.isArray(post.gallery) && post.gallery.length > 0) {
        await uploadFilesAndLink(post.gallery, { ref, refId: docId, field: 'gallery' });
        console.log(`    Uploaded gallery: ${post.gallery.length} image(s)`);
      }
    }
    console.log(`  Created post: ${post.title} (${docId})`);
  }

  // Second pass: set relatedPosts (manyToMany connect)
  for (const post of posts) {
    const docId = idToDocId.get(post.id);
    if (!docId || !post.relatedPostIds?.length) continue;
    const relatedDocIds = post.relatedPostIds
      .map((id) => idToDocId.get(id))
      .filter(Boolean) as string[];
    if (relatedDocIds.length === 0) continue;
    const existing = await getCollection<{ documentId: string }>('posts', {
      filters: { documentId: docId },
      publicationState: 'preview',
    });
    if (existing.length === 0) continue;
    // Strapi: update post to set relatedPosts (would need PATCH; skip in seed if complex)
  }
  return idToDocId;
}
