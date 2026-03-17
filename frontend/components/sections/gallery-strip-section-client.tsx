'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { GalleryItem } from '@/types';

const GalleryModal = dynamic(() => import('@/components/gallery/gallery-modal').then(m => m.GalleryModal), { ssr: false });

interface GalleryStripSectionClientProps {
  items: GalleryItem[];
  section?: { heading?: string; subheading?: string; viewAllLabel?: string; viewAllHref?: string };
}

export function GalleryStripSectionClient({ items, section }: GalleryStripSectionClientProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const heading = section?.heading ?? 'Life in Frames';
  const subheading = section?.subheading ?? 'Training, travel, and everything in between.';
  const viewAllHref = section?.viewAllHref ?? '/gallery';
  const viewAllLabel = section?.viewAllLabel ?? 'View Gallery';

  const selectedItem = selectedIndex !== null ? items[selectedIndex] ?? null : null;

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll, items]);

  const scroll = useCallback((direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.7;
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  }, []);

  return (
    <section className="section-padding-sm w-full max-w-full min-w-0 overflow-hidden bg-muted/30">
      <div className="container mx-auto w-full max-w-full min-w-0 px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-heading-3 font-heading font-semibold mb-1">
              {heading}
            </h2>
            <p className="text-muted-foreground text-sm">
              {subheading}
            </p>
          </div>
          <Button asChild variant="ghost" size="sm" className="hidden sm:flex group">
            <Link href={viewAllHref}>
              {viewAllLabel}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="relative w-full min-w-0 group/strip">
        <motion.div
          ref={scrollRef}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex gap-4 overflow-x-auto overflow-y-hidden pb-4 px-4 sm:px-6 lg:px-8 scrollbar-hide snap-x snap-mandatory w-full min-w-0"
        >
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedIndex(index)}
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
                {item.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-sm font-medium line-clamp-2">
                      {item.caption}
                    </p>
                    {item.location && (
                      <p className="text-white/70 text-xs mt-1">{item.location}</p>
                    )}
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 rounded-full bg-black/50 text-white text-xs capitalize">
                    {item.category}
                  </span>
                </div>
              </motion.div>
            </button>
          ))}
        </motion.div>

        <div className="absolute top-0 left-0 bottom-4 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 bottom-4 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />

        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scroll('left')}
            className="hidden lg:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-background/90 border shadow-md text-foreground hover:bg-background transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => scroll('right')}
            className="hidden lg:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-background/90 border shadow-md text-foreground hover:bg-background transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:hidden">
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href="/gallery">View Gallery</Link>
        </Button>
      </div>

      {selectedIndex !== null && (
        <GalleryModal
          item={selectedItem}
          open={selectedIndex !== null}
          onOpenChange={(open) => !open && setSelectedIndex(null)}
          isGalleryRoute={false}
        />
      )}
    </section>
  );
}
