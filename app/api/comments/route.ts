import { NextResponse } from 'next/server';
import { getCommentsByEntity, getAllComments } from '@/lib/data/services';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get('entityType');
    const entityId = searchParams.get('entityId');

    if (entityType && entityId) {
      const comments = await getCommentsByEntity(entityType, entityId);
      return NextResponse.json({ comments });
    }

    // Return all comments (for admin purposes)
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

// POST /api/comments - Create a new comment
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
    const validEntityTypes = ['post', 'video', 'adventure', 'gallery'];
    if (!validEntityTypes.includes(body.entityType)) {
      return NextResponse.json(
        { error: `Invalid entityType. Must be one of: ${validEntityTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Create comment object
    const newComment = {
      id: `com-${Date.now()}`,
      entityType: body.entityType,
      entityId: body.entityId,
      parentId: body.parentId || undefined,
      authorName: body.authorName,
      authorEmail: body.authorEmail || undefined,
      authorWebsite: body.authorWebsite || undefined,
      authorAvatar: undefined, // Will use default
      content: body.content,
      createdAt: new Date().toISOString(),
      status: 'pending' as const, // Comments require approval
      likes: 0,
      replies: [],
      repliesCount: 0,
    };

    // TODO: Save comment to database when connected
    // For now, return the comment as if it was created
    return NextResponse.json(
      {
        message: 'Comment submitted for approval',
        comment: newComment,
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
