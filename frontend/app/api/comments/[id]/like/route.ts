import { NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { isStrapiEnabled } from '@/lib/strapi/client';
import {
  findCommentLike,
  createCommentLike,
  deleteCommentLike,
  updateCommentLikes,
  getCommentById,
} from '@/lib/strapi/repositories/comments.repository';

export const dynamic = 'force-dynamic';

function hashIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0]?.trim() || realIp || 'unknown';
  return createHash('sha256').update(ip).digest('hex');
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const commentId = params.id;
    if (!commentId) {
      return NextResponse.json({ error: 'Missing comment id' }, { status: 400 });
    }

    if (!isStrapiEnabled) {
      return NextResponse.json({ error: 'Likes require Strapi' }, { status: 503 });
    }

    const ipHash = hashIp(request);

    const comment = await getCommentById(commentId);
    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    const existingLikeId = await findCommentLike(commentId, ipHash);

    if (existingLikeId) {
      await deleteCommentLike(existingLikeId);
      const newLikes = Math.max(0, comment.likes - 1);
      await updateCommentLikes(commentId, newLikes);
      return NextResponse.json({ liked: false, likes: newLikes });
    }

    await createCommentLike(commentId, ipHash);
    const newLikes = comment.likes + 1;
    await updateCommentLikes(commentId, newLikes);
    return NextResponse.json({ liked: true, likes: newLikes });
  } catch (error) {
    console.error('Error toggling comment like:', error);
    return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 });
  }
}
