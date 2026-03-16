'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, ExternalLink, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { CommentSection } from '@/components/shared/comment-section';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface ProductPreviewModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STOCK_LABELS: Record<string, { label: string; className: string }> = {
  in_stock: { label: 'In Stock', className: 'bg-green-500/10 text-green-600 border-green-500/30' },
  low_stock: { label: 'Low Stock', className: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30' },
  out_of_stock: { label: 'Out of Stock', className: 'bg-red-500/10 text-red-600 border-red-500/30' },
  pre_order: { label: 'Pre-order', className: 'bg-blue-500/10 text-blue-600 border-blue-500/30' },
};

export function ProductPreviewModal({ product, open, onOpenChange }: ProductPreviewModalProps) {
  if (!product) return null;

  const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const stock = STOCK_LABELS[product.stockStatus] ?? STOCK_LABELS.in_stock;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <VisuallyHidden>
          <DialogTitle>{product.title}</DialogTitle>
        </VisuallyHidden>

        <div className="grid sm:grid-cols-2">
          <div className="relative aspect-square bg-muted">
            {primaryImage && (
              <Image
                src={primaryImage.url}
                alt={primaryImage.alt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            )}
            {hasDiscount && (
              <Badge variant="destructive" className="absolute top-3 left-3">Sale</Badge>
            )}
          </div>

          <div className="p-6 flex flex-col">
            <span className="text-xs text-muted-foreground mb-1">{product.category.name}</span>
            <h3 className="text-lg font-heading font-semibold mb-2">{product.title}</h3>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl font-heading font-bold">{formatPrice(product.price)}</span>
              {hasDiscount && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.compareAtPrice!)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 mb-3">
              <Badge variant="outline" className={stock.className}>{stock.label}</Badge>
              {product.reviewCount > 0 && (
                <span className="flex items-center gap-1 text-xs">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {product.ratingAverage} ({product.reviewCount})
                </span>
              )}
            </div>

            {product.shortDescription && (
              <p className="text-sm text-muted-foreground mb-4 line-clamp-4 flex-1">
                {product.shortDescription}
              </p>
            )}

            <div className="flex flex-col gap-2 mt-auto">
              <Button asChild>
                <Link href={`/shop/${product.slug}`}>
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  View Full Details
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/shop">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Go to Shop
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6 pt-0">
          <Separator className="mb-4" />
          <CommentSection
            entityType="product"
            entityId={product.slug}
            compact
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
