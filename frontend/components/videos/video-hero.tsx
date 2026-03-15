'use client';

import { motion } from 'framer-motion';
import { Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSiteConfig } from '@/lib/context/site-config';

export function VideoHero() {
  const siteConfig = useSiteConfig();
  const youtubeUrl = siteConfig.links?.youtube || 'https://youtube.com/@zdravlife';
  const siteName = siteConfig.name || 'ZdravLife';
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
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20 mb-4">
            <Youtube className="h-3 w-3 mr-1" />
            YouTube Channel
          </span>
          <h1 className="text-heading-1 font-heading font-bold mb-4">
            Watch the{' '}
            <span className="text-gradient">Journey</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Training tutorials, adventure vlogs, and deep dives into the {siteName}
            philosophy. New videos every week.
          </p>
          <Button asChild>
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Youtube className="h-4 w-4 mr-2" />
              Subscribe on YouTube
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
