import { NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { isStrapiEnabled } from '@/lib/strapi/client';
import { getCommentsByEntity, getAllComments, createComment } from '@/lib/data/data-source';
import { getCommentLikesByIp } from '@/lib/strapi/repositories/comments.repository';

export const dynamic = 'force-dynamic';

function hashIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0]?.trim() || realIp || 'unknown';
  return createHash('sha256').update(ip).digest('hex');
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get('entityType');
    const entityId = searchParams.get('entityId');

    if (entityType && entityId) {
      const comments = await getCommentsByEntity(entityType, entityId);

      if (isStrapiEnabled && comments.length > 0) {
        const ipHash = hashIp(request);
        const likedIds = await getCommentLikesByIp(ipHash, comments.map((c) => c.id));
        for (const comment of comments) {
          comment.likedByMe = likedIds.has(comment.id);
        }
      }

      return NextResponse.json({ comments });
    }

    const comments = await getAllComments();
    return NextResponse.json({ comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// POST /api/comments - Create a new comment (persists to Strapi when enabled)
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.entityType || !body.entityId || !body.content || !body.authorName) {
      return NextResponse.json(
        { error: 'Missing required fields: entityType, entityId, content, authorName' },
        { status: 400 }
      );
    }

    // Validate entity type
    const validEntityTypes = ['post', 'video', 'adventure', 'gallery', 'product'];
    if (!validEntityTypes.includes(body.entityType)) {
      return NextResponse.json(
        { error: `Invalid entityType. Must be one of: ${validEntityTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Log so we can see in the Next.js server terminal (not Strapi) whether Strapi is used
    const strapiOn = isStrapiEnabled;
    const strapiUrl = process.env.STRAPI_URL;
    const hasToken = Boolean(process.env.STRAPI_API_TOKEN);
    if (!strapiOn) {
      console.warn(
        '[comments POST] Strapi disabled. STRAPI_URL=',
        strapiUrl ?? '(missing)',
        'STRAPI_API_TOKEN=',
        hasToken ? 'set' : 'missing',
        '- comment will not persist.'
      );
    }

    const comment = await createComment(body.entityType, body.entityId, {
      authorName: body.authorName,
      authorEmail: body.authorEmail,
      authorWebsite: body.authorWebsite,
      content: body.content,
    });

    if (comment) {
      return NextResponse.json(
        {
          message: 'Comment submitted for approval',
          comment,
        },
        { status: 201 }
      );
    }

    if (strapiOn) {
      console.error('[comments POST] Strapi is enabled but createComment returned null. Check Strapi create error above.');
      return NextResponse.json(
        { error: 'Comment could not be saved. Please try again or contact support.' },
        { status: 503 }
      );
    }

    // Strapi not configured: return a transient response for UX (comment won't persist)
    const transientComment = {
      id: `com-${Date.now()}`,
      entityType: body.entityType,
      entityId: body.entityId,
      parentId: body.parentId || undefined,
      authorName: body.authorName,
      authorEmail: body.authorEmail || undefined,
      authorWebsite: body.authorWebsite || undefined,
      authorAvatar: undefined,
      content: body.content,
      createdAt: new Date().toISOString(),
      status: 'pending' as const,
      likes: 0,
      likedByMe: false,
      replies: [],
      repliesCount: 0,
    };
    return NextResponse.json(
      {
        message: 'Comment submitted for approval',
        comment: transientComment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
