'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { getFeaturedProducts } from '@/lib/data/services';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';

export async function FeaturedShopSection() {
  const products = await getFeaturedProducts(4);

  if (products.length === 0) return null;

  return (
    <section className="section-padding bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-heading-2 font-heading font-semibold mb-2">
              Shop the Brand
            </h2>
            <p className="text-muted-foreground">
              Premium apparel, digital guides, and gear for the pursuit of vitality.
            </p>
          </div>
          <Button asChild variant="ghost" className="hidden sm:flex group">
            <Link href="/shop">
              View All
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => {
            const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
            const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;

            return (
              <motion.article
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/shop/${product.slug}`} className="block group h-full">
                  <div className="h-full flex flex-col bg-card border rounded-xl overflow-hidden hover:border-primary/50 transition-colors">
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      {primaryImage && (
                        <Image
                          src={primaryImage.url}
                          alt={primaryImage.alt}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      )}
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product.featured && (
                          <Badge variant="vitality">Featured</Badge>
                        )}
                        {hasDiscount && (
                          <Badge variant="destructive">
                            Sale
                          </Badge>
                        )}
                      </div>

                      {/* Stock Status */}
                      {product.stockStatus === 'out_of_stock' && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="px-3 py-1 bg-black/70 text-white text-sm font-medium rounded">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col p-4">
                      <span className="text-xs text-muted-foreground mb-1">
                        {product.category.name}
                      </span>
                      <h3 className="font-heading font-semibold mb-1 group-hover:text-primary transition-colors line-clamp-1">
                        {product.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-3 flex-1">
                        {product.shortDescription}
                      </p>

                      {/* Rating */}
                      {product.reviewCount > 0 && (
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-medium">
                            {product.ratingAverage}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({product.reviewCount})
                          </span>
                        </div>
                      )}

                      {/* Price */}
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-semibold">
                          {formatPrice(product.price)}
                        </span>
                        {hasDiscount && (
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(product.compareAtPrice!)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </div>

        {/* Mobile CTA */}
        <div className="mt-6 sm:hidden">
          <Button asChild variant="outline" className="w-full">
            <Link href="/shop">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
