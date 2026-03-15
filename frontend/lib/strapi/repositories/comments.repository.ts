/**
 * Comments from Strapi. Use when isStrapiEnabled. Only approved comments.
 */

import { createEntry, getCollection } from '@/lib/strapi/client';
import { mapStrapiCommentToComment } from '@/lib/strapi/mappers';
import type { Comment } from '@/types';

export interface CreateCommentParams {
  entityType: string;
  entitySlug: string;
  authorName: string;
  authorEmail?: string;
  authorWebsite?: string;
  content: string;
}

export async function getCommentsByEntity(entityType: string, entitySlug: string): Promise<Comment[]> {
  const list = await getCollection('comments', {
    populate: ['avatar'],
    filters: {
      entityType: { $eq: entityType },
      entitySlug: { $eq: entitySlug },
      commentStatus: { $eq: 'approved' },
    },
    pagination: { pageSize: 100 },
    dynamic: true, // no cache so approved comments show right after refresh
  });
  const comments = list.map((d) => mapStrapiCommentToComment(d)).filter(Boolean) as Comment[];
  return comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Create a comment in Strapi. New comments are stored with status 'pending' and published so they appear in admin.
 */
export async function createComment(params: CreateCommentParams): Promise<Comment | null> {
  const created = await createEntry<Record<string, unknown>>(
    'comments',
    {
      entityType: params.entityType,
      entitySlug: params.entitySlug,
      authorName: params.authorName,
      authorEmail: params.authorEmail ?? undefined,
      authorWebsite: params.authorWebsite ?? undefined,
      content: params.content,
      commentStatus: 'pending',
      likes: 0,
    },
    { status: 'published' }
  );
  if (!created) return null;
  return mapStrapiCommentToComment(created) ?? null;
}
