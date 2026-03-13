import { NextResponse } from 'next/server';
import {
  getAllPosts,
  getPaginatedPosts,
  getFeaturedPosts,
  getLatestPosts,
  getPostsByCategory,
  getPostsByTag,
} from '@/lib/data/services';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '9');
    const featured = searchParams.get('featured') === 'true';
    const latest = searchParams.get('latest') === 'true';
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');

    // Return featured posts
    if (featured) {
      const posts = await getFeaturedPosts(limit);
      return NextResponse.json({ posts });
    }

    // Return latest posts
    if (latest) {
      const posts = await getLatestPosts(limit);
      return NextResponse.json({ posts });
    }

    // Return posts by category
    if (category) {
      const posts = await getPostsByCategory(category);
      return NextResponse.json({ posts });
    }

    // Return posts by tag
    if (tag) {
      const posts = await getPostsByTag(tag);
      return NextResponse.json({ posts });
    }

    // Return paginated posts
    const { posts, pagination } = await getPaginatedPosts(page, limit);
    return NextResponse.json({ posts, pagination });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create a new post (for future CMS integration)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.content || !body.slug) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content, slug' },
        { status: 400 }
      );
    }

    // TODO: Implement post creation when connected to database
    // For now, return a mock response
    return NextResponse.json(
      { 
        message: 'Post creation endpoint ready for CMS integration',
        post: body 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
