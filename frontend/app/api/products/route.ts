import { NextResponse } from 'next/server';
import {
  getFeaturedProducts,
  getAllProducts,
  getPaginatedProducts,
  getProductsByCategory,
} from '@/lib/data/data-source';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const featured = searchParams.get('featured') === 'true';
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice')
      ? parseFloat(searchParams.get('minPrice')!)
      : undefined;
    const maxPrice = searchParams.get('maxPrice')
      ? parseFloat(searchParams.get('maxPrice')!)
      : undefined;
    const sortBy = searchParams.get('sortBy') as
      | 'price-asc'
      | 'price-desc'
      | 'newest'
      | 'popular'
      | undefined;

    // Return featured products
    if (featured) {
      const products = await getFeaturedProducts(limit);
      return NextResponse.json({ products });
    }

    // Return products by category
    if (category) {
      const products = await getProductsByCategory(category);
      return NextResponse.json({ products });
    }

    // Return paginated products with filters
    const { products, pagination } = await getPaginatedProducts(page, limit, {
      category: category || undefined,
      minPrice,
      maxPrice,
      sortBy,
    });

    return NextResponse.json({ products, pagination });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product (for future e-commerce integration)
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.price || !body.slug) {
      return NextResponse.json(
        { error: 'Missing required fields: title, price, slug' },
        { status: 400 }
      );
    }

    // TODO: Implement product creation when connected to e-commerce backend
    return NextResponse.json(
      {
        message: 'Product creation endpoint ready for e-commerce integration',
        product: body,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
