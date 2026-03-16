/**
 * Comments from Strapi. Use when isStrapiEnabled. Only approved comments.
 */

import { createEntry, getCollection, updateEntry, deleteEntry } from '@/lib/strapi/client';
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

// ── Comment Likes (IP-based) ──────────────────────────────────────────────────

export async function getCommentLikesByIp(
  ipHash: string,
  commentIds: string[],
): Promise<Set<string>> {
  if (!commentIds.length) return new Set();
  const list = await getCollection<Record<string, unknown>>('comment-likes', {
    filters: {
      ipHash: { $eq: ipHash },
      commentId: { $in: commentIds },
    },
    pagination: { pageSize: 200 },
    dynamic: true,
  });
  const likedIds = new Set<string>();
  for (const entry of list) {
    const attrs = (entry as unknown as Record<string, unknown>).attributes ?? entry;
    const cid = ((attrs as Record<string, unknown>).commentId as string) ?? '';
    if (cid) likedIds.add(cid);
  }
  return likedIds;
}

export async function findCommentLike(
  commentId: string,
  ipHash: string,
): Promise<string | null> {
  const list = await getCollection<Record<string, unknown>>('comment-likes', {
    filters: {
      commentId: { $eq: commentId },
      ipHash: { $eq: ipHash },
    },
    pagination: { pageSize: 1 },
    dynamic: true,
  });
  if (!list.length) return null;
  const entry = list[0] as unknown as Record<string, unknown>;
  return (entry.documentId as string) ?? (entry.id as string)?.toString() ?? null;
}

export async function createCommentLike(commentId: string, ipHash: string): Promise<boolean> {
  const created = await createEntry('comment-likes', { commentId, ipHash });
  return created != null;
}

export async function deleteCommentLike(documentId: string): Promise<boolean> {
  return deleteEntry('comment-likes', documentId);
}

export async function updateCommentLikes(
  commentDocumentId: string,
  likes: number,
): Promise<boolean> {
  const updated = await updateEntry('comments', commentDocumentId, { likes: Math.max(0, likes) });
  return updated != null;
}

export async function getCommentById(commentId: string): Promise<Comment | null> {
  const list = await getCollection<Record<string, unknown>>('comments', {
    filters: { documentId: { $eq: commentId } },
    populate: ['avatar'],
    pagination: { pageSize: 1 },
    dynamic: true,
  });
  if (!list.length) return null;
  return mapStrapiCommentToComment(list[0]) ?? null;
}
