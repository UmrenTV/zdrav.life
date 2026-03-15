import { NextResponse } from 'next/server';
import {
  getAllPostCategories,
  getAllProductCategories,
} from '@/lib/data/data-source';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'posts' or 'products'

    if (!type || !['posts', 'products'].includes(type)) {
      return NextResponse.json(
        { error: 'Missing or invalid type parameter. Must be "posts" or "products"' },
        { status: 400 }
      );
    }

    if (type === 'posts') {
      const categories = await getAllPostCategories();
      return NextResponse.json({ categories });
    }

    if (type === 'products') {
      const categories = await getAllProductCategories();
      return NextResponse.json({ categories });
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
