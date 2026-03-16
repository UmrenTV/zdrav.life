'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ProductPreviewModal } from '@/components/shop/product-preview-modal';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">No products found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => {
          const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
          const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;

          return (
            <motion.article
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <button
                type="button"
                onClick={() => setSelectedProduct(product)}
                className="block group h-full w-full text-left"
              >
                <div className="h-full flex flex-col bg-card border rounded-xl overflow-hidden hover:border-primary/50 transition-colors">
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    {primaryImage && (
                      <Image
                        src={primaryImage.url}
                        alt={primaryImage.alt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    )}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {product.featured && <Badge variant="default">Featured</Badge>}
                      {hasDiscount && <Badge variant="destructive">Sale</Badge>}
                    </div>
                    {product.stockStatus === 'out_of_stock' && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="px-3 py-1 bg-black/70 text-white text-sm font-medium rounded">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col p-4">
                    <span className="text-xs text-muted-foreground mb-1">{product.category.name}</span>
                    <h3 className="font-heading font-semibold mb-1 group-hover:text-primary transition-colors line-clamp-1">
                      {product.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-3 flex-1">
                      {product.shortDescription}
                    </p>
                    {product.reviewCount > 0 && (
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">{product.ratingAverage}</span>
                        <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-semibold">{formatPrice(product.price)}</span>
                      {hasDiscount && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(product.compareAtPrice!)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            </motion.article>
          );
        })}
      </div>

      <ProductPreviewModal
        product={selectedProduct}
        open={!!selectedProduct}
        onOpenChange={(open) => !open && setSelectedProduct(null)}
      />
    </>
  );
}
