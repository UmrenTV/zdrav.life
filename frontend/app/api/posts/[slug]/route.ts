import { NextResponse } from 'next/server';
import { getPostBySlug, getRelatedPosts } from '@/lib/data/data-source';

interface RouteParams {
  params: {
    slug: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const post = await getPostBySlug(params.slug);

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Get related posts
    const relatedPosts = await getRelatedPosts(post.id, 3);

    return NextResponse.json({ post, relatedPosts });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

// PUT /api/posts/[slug] - Update a post (for future CMS integration)
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const body = await request.json();
    const existingPost = await getPostBySlug(params.slug);

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // TODO: Implement post update when connected to database
    return NextResponse.json({
      message: 'Post update endpoint ready for CMS integration',
      slug: params.slug,
      updates: body,
    });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[slug] - Delete a post (for future CMS integration)
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const existingPost = await getPostBySlug(params.slug);

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // TODO: Implement post deletion when connected to database
    return NextResponse.json({
      message: 'Post deletion endpoint ready for CMS integration',
      slug: params.slug,
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
