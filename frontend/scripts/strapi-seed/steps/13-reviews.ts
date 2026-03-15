/**
 * Seed reviews. Requires products. All set to approved for display.
 */

import { loadJson } from '../lib/load-json';
import { createEntry } from '../lib/client';

interface ReviewJson {
  id: string;
  productId: string;
  authorName: string;
  rating: number;
  title: string;
  content: string;
  createdAt: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
}

export async function seedReviews(productIdMap: Map<string, string>): Promise<void> {
  const reviews = await loadJson<ReviewJson[]>('reviews.json');
  for (const r of reviews) {
    const productDocId = productIdMap.get(r.productId);
    if (!productDocId) {
      console.log(`  Skip review ${r.id}: product ${r.productId} not found`);
      continue;
    }
    await createEntry('reviews', {
      product: { connect: [productDocId] },
      authorName: r.authorName,
      rating: r.rating,
      title: r.title,
      content: r.content,
      verifiedPurchase: r.verifiedPurchase ?? false,
      helpfulCount: r.helpfulCount ?? 0,
      approved: true,
      createdAtOverride: r.createdAt || null,
    });
    console.log(`  Created review: ${r.title?.slice(0, 40)}...`);
  }
}
