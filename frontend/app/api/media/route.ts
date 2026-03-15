import { NextResponse } from 'next/server';
import {
  getFeaturedVideos,
  getFeaturedGalleryItems,
  getAllVideos,
  getLatestVideos,
  getVideosByCategory,
  getAllGalleryItems,
  getGalleryByCategory,
} from '@/lib/data/data-source';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'videos' or 'gallery'
    const featured = searchParams.get('featured') === 'true';
    const latest = searchParams.get('latest') === 'true';
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!type || !['videos', 'gallery'].includes(type)) {
      return NextResponse.json(
        { error: 'Missing or invalid type parameter. Must be "videos" or "gallery"' },
        { status: 400 }
      );
    }

    // Handle videos
    if (type === 'videos') {
      if (featured) {
        const videos = await getFeaturedVideos(limit);
        return NextResponse.json({ videos });
      }

      if (latest) {
        const videos = await getLatestVideos(limit);
        return NextResponse.json({ videos });
      }

      if (category) {
        const videos = await getVideosByCategory(category);
        return NextResponse.json({ videos });
      }

      const videos = await getAllVideos();
      return NextResponse.json({ videos });
    }

    // Handle gallery
    if (type === 'gallery') {
      if (featured) {
        const items = await getFeaturedGalleryItems(limit);
        return NextResponse.json({ gallery: items });
      }

      if (category) {
        const items = await getGalleryByCategory(category as any);
        return NextResponse.json({ gallery: items });
      }

      const items = await getAllGalleryItems();
      return NextResponse.json({ gallery: items });
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media' },
      { status: 500 }
    );
  }
}
