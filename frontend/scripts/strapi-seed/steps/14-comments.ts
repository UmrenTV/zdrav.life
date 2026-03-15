/**
 * Seed comments. Uses entityType + entitySlug (post slug from entityId lookup). Parent relation skipped for simplicity (flat list).
 */

import { loadJson } from '../lib/load-json';
import { createEntry } from '../lib/client';

interface CommentJson {
  id: string;
  entityType: string;
  entityId: string;
  parentId?: string;
  authorName: string;
  authorEmail?: string;
  authorWebsite?: string;
  content: string;
  createdAt: string;
  status: string;
  likes: number;
}

export async function seedComments(postIdToSlug: Map<string, string>): Promise<void> {
  const comments = await loadJson<CommentJson[]>('comments.json');
  for (const c of comments) {
    const entitySlug = postIdToSlug.get(c.entityId) ?? c.entityId;
    await createEntry('comments', {
      entityType: c.entityType,
      entitySlug,
      authorName: c.authorName,
      authorEmail: c.authorEmail,
      authorWebsite: c.authorWebsite,
      content: c.content,
      commentStatus: c.status === 'approved' ? 'approved' : 'pending',
      likes: c.likes ?? 0,
      createdAtOverride: c.createdAt || null,
    });
    console.log(`  Created comment by ${c.authorName} for ${c.entityType}/${entitySlug}`);
  }
}
