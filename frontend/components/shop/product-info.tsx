'use client';

import { useState } from 'react';
import { Star, Minus, Plus, ShoppingBag, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

interface ProductInfoProps {
  product: Product;
  reviewSummary: {
    averageRating: number;
    totalReviews: number;
  };
}

export function ProductInfo({ product, reviewSummary }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0]);

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const currentPrice = selectedVariant?.price || product.price;
  const isOutOfStock = selectedVariant
    ? selectedVariant.stockStatus === 'out_of_stock'
    : product.stockStatus === 'out_of_stock';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary">{product.category.name}</Badge>
          {product.featured && <Badge variant="vitality">Featured</Badge>}
          {hasDiscount && <Badge variant="destructive">Sale</Badge>}
        </div>
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
          {product.title}
        </h1>
        {product.subtitle && (
          <p className="text-lg text-muted-foreground">{product.subtitle}</p>
        )}
      </div>

      {/* Rating */}
      {reviewSummary.totalReviews > 0 && (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.round(reviewSummary.averageRating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-muted-foreground'
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-medium">
            {reviewSummary.averageRating}
          </span>
          <span className="text-sm text-muted-foreground">
            ({reviewSummary.totalReviews} reviews)
          </span>
        </div>
      )}

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-heading font-bold">
          {formatPrice(currentPrice)}
        </span>
        {hasDiscount && (
          <span className="text-xl text-muted-foreground line-through">
            {formatPrice(product.compareAtPrice!)}
          </span>
        )}
      </div>

      {/* Short Description */}
      <p className="text-muted-foreground">{product.shortDescription}</p>

      {/* Variants */}
      {product.variants && product.variants.length > 0 && product.attributes && (
        <div className="space-y-4">
          {product.attributes.map((attribute) => (
            <div key={attribute.name}>
              <label className="block text-sm font-medium mb-2">
                {attribute.name}
              </label>
              <div className="flex flex-wrap gap-2">
                {attribute.values.map((value) => {
                  const isSelected = selectedVariant?.options?.[attribute.name] === value;
                  return (
                    <button
                      key={value}
                      onClick={() => {
                        const newVariant = product.variants?.find(
                          (v) => v.options?.[attribute.name] === value
                        );
                        if (newVariant) setSelectedVariant(newVariant);
                      }}
                      className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-input hover:border-muted-foreground'
                      }`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quantity & Add to Cart */}
      <div className="flex gap-4">
        <div className="flex items-center border rounded-lg">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-2 hover:bg-muted transition-colors"
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-3 py-2 hover:bg-muted transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <Button
          size="lg"
          className="flex-1"
          disabled={isOutOfStock}
        >
          <ShoppingBag className="h-4 w-4 mr-2" />
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12"
        >
          <Heart className="h-5 w-5" />
        </Button>
      </div>

      {/* Stock Status */}
      {selectedVariant?.stockStatus === 'low_stock' && (
        <p className="text-sm text-yellow-600">
          Only {selectedVariant.stockQuantity} left in stock!
        </p>
      )}

      {/* SKU */}
      <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
    </div>
  );
}
