import { NextResponse } from 'next/server';
import { getProductBySlug, getRelatedProducts } from '@/lib/data/data-source';

interface RouteParams {
  params: {
    slug: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const product = await getProductBySlug(params.slug);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Get related products
    const relatedProducts = await getRelatedProducts(product.id, 4);

    return NextResponse.json({ product, relatedProducts });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[slug] - Update a product (for future e-commerce integration)
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const body = await request.json();
    const existingProduct = await getProductBySlug(params.slug);

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // TODO: Implement product update when connected to e-commerce backend
    return NextResponse.json({
      message: 'Product update endpoint ready for e-commerce integration',
      slug: params.slug,
      updates: body,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[slug] - Delete a product (for future e-commerce integration)
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const existingProduct = await getProductBySlug(params.slug);

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // TODO: Implement product deletion when connected to e-commerce backend
    return NextResponse.json({
      message: 'Product deletion endpoint ready for e-commerce integration',
      slug: params.slug,
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
