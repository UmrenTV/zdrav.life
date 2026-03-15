/**
 * Reviews from Strapi. Use when isStrapiEnabled. Only approved reviews.
 */

import { getCollection } from '@/lib/strapi/client';
import { mapStrapiReviewToReview } from '@/lib/strapi/mappers';
import type { Review, ReviewSummary } from '@/types';

export async function getReviewsByProduct(productId: string): Promise<Review[]> {
  const list = await getCollection('reviews');
  const reviews = list.map((d) => mapStrapiReviewToReview(d)).filter(Boolean) as Review[];
  return reviews.filter((r) => r.productId === productId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getReviewSummary(productId: string): Promise<ReviewSummary> {
  const reviews = await getReviewsByProduct(productId);
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0;
  const distribution: Record<1 | 2 | 3 | 4 | 5, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach((r) => {
    const key = r.rating as 1 | 2 | 3 | 4 | 5;
    if (key >= 1 && key <= 5) distribution[key]++;
  });
  return {
    productId,
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews,
    ratingDistribution: distribution,
  };
}
