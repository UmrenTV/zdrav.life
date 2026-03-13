import { NextResponse } from 'next/server';
import { getReviewsByProduct, getReviewSummary } from '@/lib/data/services';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'Missing required parameter: productId' },
        { status: 400 }
      );
    }

    const [reviews, summary] = await Promise.all([
      getReviewsByProduct(productId),
      getReviewSummary(productId),
    ]);

    return NextResponse.json({ reviews, summary });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST /api/reviews - Create a new review
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.productId || !body.rating || !body.content || !body.authorName) {
      return NextResponse.json(
        { error: 'Missing required fields: productId, rating, content, authorName' },
        { status: 400 }
      );
    }

    // Validate rating
    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Create review object
    const newReview = {
      id: `rev-${Date.now()}`,
      productId: body.productId,
      authorName: body.authorName,
      authorEmail: body.authorEmail || undefined,
      authorAvatar: undefined,
      rating: body.rating,
      title: body.title || '',
      content: body.content,
      createdAt: new Date().toISOString(),
      verifiedPurchase: false, // Would be verified against orders in real implementation
      helpfulCount: 0,
    };

    // TODO: Save review to database when connected to e-commerce backend
    return NextResponse.json(
      {
        message: 'Review submitted successfully',
        review: newReview,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}
