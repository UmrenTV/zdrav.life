'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { GalleryModal } from '@/components/gallery/gallery-modal';
import type { GalleryItem } from '@/types';

interface GalleryGridProps {
  items: GalleryItem[];
}

export function GalleryGrid({ items }: GalleryGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const pathname = usePathname();
  const isGalleryRoute = pathname === '/gallery' || pathname.startsWith('/gallery');

  const selectedItem = selectedIndex !== null ? items[selectedIndex] ?? null : null;

  const handlePrevious = useCallback(() => {
    setSelectedIndex((prev) => (prev != null && prev > 0 ? prev - 1 : prev));
  }, []);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev != null && prev < items.length - 1 ? prev + 1 : prev));
  }, [items.length]);

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">No photos found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="break-inside-avoid"
          >
            <Link
              href={`/gallery/${item.slug || item.id}`}
              onClick={(e) => { e.preventDefault(); setSelectedIndex(index); }}
              className="group relative block w-full overflow-hidden rounded-xl"
            >
              <div className={`relative ${
                item.category === 'training' || item.category === 'bike'
                  ? 'aspect-square'
                  : 'aspect-[3/4]'
              }`}>
                <Image
                  src={item.image}
                  alt={item.caption || 'Gallery image'}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <span className="inline-block px-2 py-1 rounded-full bg-white/20 text-white text-xs capitalize mb-2">
                    {item.category}
                  </span>
                  {item.caption && (
                    <p className="text-white text-sm font-medium line-clamp-2">
                      {item.caption}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <GalleryModal
        item={selectedItem}
        open={selectedIndex !== null}
        onOpenChange={(open) => !open && setSelectedIndex(null)}
        isGalleryRoute={isGalleryRoute}
        onPrevious={handlePrevious}
        onNext={handleNext}
        hasPrevious={selectedIndex != null && selectedIndex > 0}
        hasNext={selectedIndex != null && selectedIndex < items.length - 1}
      />
    </>
  );
}
