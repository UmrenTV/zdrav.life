'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { GalleryItem } from '@/types';

interface GalleryGridProps {
  items: GalleryItem[];
}

export function GalleryGrid({ items }: GalleryGridProps) {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">No photos found.</p>
      </div>
    );
  }

  return (
    <>
      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="break-inside-avoid"
          >
            <button
              onClick={() => setSelectedItem(item)}
              className="group relative w-full overflow-hidden rounded-xl"
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
                
                {/* Overlay Content */}
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
            </button>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors"
            >
              <X className="h-8 w-8" />
            </button>

            {/* Image */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl max-h-[85vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-auto max-h-[85vh]">
                <Image
                  src={selectedItem.image}
                  alt={selectedItem.caption || 'Gallery image'}
                  width={1200}
                  height={800}
                  className="object-contain max-h-[85vh] w-auto mx-auto"
                />
              </div>

              {/* Caption */}
              {(selectedItem.caption || selectedItem.location || selectedItem.takenAt) && (
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  {selectedItem.caption && (
                    <p className="text-white text-lg font-medium mb-2">
                      {selectedItem.caption}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-white/70 text-sm">
                    {selectedItem.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {selectedItem.location}
                      </span>
                    )}
                    {selectedItem.takenAt && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(selectedItem.takenAt)}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
