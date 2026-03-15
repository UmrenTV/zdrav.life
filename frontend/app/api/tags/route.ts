import { NextResponse } from 'next/server';
import { getAllTags } from '@/lib/data/data-source';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    const tags = await getAllTags();
    
    // Sort by post count (popularity) and limit
    const sortedTags = tags
      .sort((a, b) => b.postCount - a.postCount)
      .slice(0, limit);

    return NextResponse.json({ tags: sortedTags });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}
