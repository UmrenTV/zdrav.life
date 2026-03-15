'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ThumbsUp } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { formatDate } from '@/lib/utils';
import type { Review } from '@/types';

interface ReviewSectionProps {
  reviews: Review[];
  reviewSummary: {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: Record<1 | 2 | 3 | 4 | 5, number>;
  };
  productId: string;
}

export function ReviewSection({
  reviews,
  reviewSummary,
}: ReviewSectionProps) {
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest'>('newest');

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      default:
        return 0;
    }
  });

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {/* Summary */}
      <div className="md:col-span-1">
        <div className="p-6 bg-muted/50 rounded-xl">
          <div className="text-center mb-6">
            <div className="text-5xl font-heading font-bold mb-2">
              {reviewSummary.averageRating}
            </div>
            <div className="flex items-center justify-center gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.round(reviewSummary.averageRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Based on {reviewSummary.totalReviews} reviews
            </p>
          </div>

          {/* Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = reviewSummary.ratingDistribution[rating as 1 | 2 | 3 | 4 | 5];
              const percentage = reviewSummary.totalReviews > 0
                ? (count / reviewSummary.totalReviews) * 100
                : 0;

              return (
                <div key={rating} className="flex items-center gap-3">
                  <span className="text-sm w-8">{rating}★</span>
                  <Progress value={percentage} className="flex-1 h-2" />
                  <span className="text-sm text-muted-foreground w-8 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="md:col-span-2">
        {/* Sort */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading font-semibold">
            {reviewSummary.totalReviews} Reviews
          </h3>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-sm border rounded-lg px-3 py-2 bg-background"
          >
            <option value="newest">Newest First</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </div>

        {/* Reviews */}
        <div className="space-y-6">
          {sortedReviews.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No reviews yet. Be the first to review this product!
            </p>
          ) : (
            sortedReviews.map((review, index) => (
              <motion.article
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 border rounded-xl"
              >
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    {review.authorAvatar && (
                      <AvatarImage
                        src={review.authorAvatar}
                        alt={review.authorName}
                      />
                    )}
                    <AvatarFallback>
                      {review.authorName.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-medium">{review.authorName}</span>
                        {review.verifiedPurchase && (
                          <Badge variant="success" className="ml-2 text-xs">
                            Verified Purchase
                          </Badge>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>

                    {review.title && (
                      <h4 className="font-medium mb-2">{review.title}</h4>
                    )}

                    <p className="text-muted-foreground text-sm mb-4">
                      {review.content}
                    </p>

                    <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <ThumbsUp className="h-4 w-4" />
                      Helpful ({review.helpfulCount})
                    </button>
                  </div>
                </div>
              </motion.article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
