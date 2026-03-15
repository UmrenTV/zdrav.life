'use client';

import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function GalleryHero() {
  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5 dark:to-primary/10" />
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pink-500/10 text-pink-500 border border-pink-500/20 mb-4">
            <Instagram className="h-3 w-3 mr-1" />
            Instagram
          </span>
          <h1 className="text-heading-1 font-heading font-bold mb-4">
            Life in{' '}
            <span className="text-gradient">Frames</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            A visual journey through training, travel, and the pursuit of vitality.
            Follow along on Instagram for daily updates.
          </p>
          <Button asChild variant="outline">
            <a
              href="https://instagram.com/zdravlife"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="h-4 w-4 mr-2" />
              Follow on Instagram
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
