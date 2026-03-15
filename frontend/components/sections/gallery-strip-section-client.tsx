'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { GalleryItem } from '@/types';

interface GalleryStripSectionClientProps {
  items: GalleryItem[];
}

export function GalleryStripSectionClient({ items }: GalleryStripSectionClientProps) {
  return (
    <section className="section-padding-sm w-full max-w-full min-w-0 overflow-hidden bg-muted/30">
      <div className="container mx-auto w-full max-w-full min-w-0 px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-heading-3 font-heading font-semibold mb-1">
              Life in Frames
            </h2>
            <p className="text-muted-foreground text-sm">
              Training, travel, and everything in between.
            </p>
          </div>
          <Button asChild variant="ghost" size="sm" className="hidden sm:flex group">
            <Link href="/gallery">
              View Gallery
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Gallery Strip - horizontal scroll contained within section */}
      <div className="relative w-full min-w-0">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex gap-4 overflow-x-auto overflow-y-hidden pb-4 px-4 sm:px-6 lg:px-8 scrollbar-hide snap-x snap-mandatory w-full min-w-0"
        >
          {items.map((item, index) => (
            <Link
              key={item.id}
              href="/gallery"
              className="flex-shrink-0 snap-start"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group relative w-64 h-80 rounded-xl overflow-hidden"
              >
                <Image
                  src={item.image}
                  alt={item.caption || 'Gallery image'}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="256px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Caption */}
                {item.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-sm font-medium line-clamp-2">
                      {item.caption}
                    </p>
                    {item.location && (
                      <p className="text-white/70 text-xs mt-1">
                        {item.location}
                      </p>
                    )}
                  </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 rounded-full bg-black/50 text-white text-xs capitalize">
                    {item.category}
                  </span>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* Fade Edges */}
        <div className="absolute top-0 left-0 bottom-4 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 bottom-4 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />
      </div>

      {/* Mobile CTA */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:hidden">
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href="/gallery">View Gallery</Link>
        </Button>
      </div>
    </section>
  );
}
