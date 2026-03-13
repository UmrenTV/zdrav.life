import { NextResponse } from 'next/server';
import { searchContent } from '@/lib/data/services';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type'); // Optional filter by type

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: 'Query must be at least 2 characters' },
        { status: 400 }
      );
    }

    let results = await searchContent(query);

    // Filter by type if specified
    if (type) {
      const validTypes = ['post', 'product', 'video', 'adventure'];
      if (!validTypes.includes(type)) {
        return NextResponse.json(
          { error: `Invalid type. Must be one of: ${validTypes.join(', ')}` },
          { status: 400 }
        );
      }
      results = results.filter((r) => r.type === type);
    }

    // Group results by type for easier consumption
    const groupedResults = {
      posts: results.filter((r) => r.type === 'post'),
      products: results.filter((r) => r.type === 'product'),
      videos: results.filter((r) => r.type === 'video'),
      adventures: results.filter((r) => r.type === 'adventure'),
    };

    return NextResponse.json({
      query,
      totalResults: results.length,
      results,
      groupedResults,
    });
  } catch (error) {
    console.error('Error searching content:', error);
    return NextResponse.json(
      { error: 'Failed to search content' },
      { status: 500 }
    );
  }
}
