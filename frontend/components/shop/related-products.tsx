'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section>
      <h2 className="text-heading-3 font-heading font-semibold mb-8">
        You May Also Like
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, index) => {
          const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];

          return (
            <motion.article
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/shop/${product.slug}`} className="block group">
                <div className="flex gap-4">
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                    {primaryImage && (
                      <Image
                        src={primaryImage.url}
                        alt={primaryImage.alt}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="80px"
                      />
                    )}
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">
                      {product.category.name}
                    </span>
                    <h3 className="font-heading font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                      {product.title}
                    </h3>
                    <p className="font-medium text-sm mt-1">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
