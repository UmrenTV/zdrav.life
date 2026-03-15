'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { ProductImage } from '@/types';

interface ProductGalleryProps {
  images: ProductImage[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(
    images.find((img) => img.isPrimary) || images[0]
  );

  if (!selectedImage) return null;

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
        <Image
          src={selectedImage.url}
          alt={selectedImage.alt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((image) => (
            <button
              key={image.id}
              onClick={() => setSelectedImage(image)}
              className={cn(
                'relative w-20 h-20 rounded-lg overflow-hidden bg-muted border-2 transition-colors',
                selectedImage.id === image.id
                  ? 'border-primary'
                  : 'border-transparent hover:border-muted-foreground'
              )}
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
