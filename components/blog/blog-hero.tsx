'use client';

import { motion } from 'framer-motion';

export function BlogHero() {
  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5 dark:to-primary/10" />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
                           linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: '4rem 4rem',
        }}
      />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 mb-4">
            The Journal
          </span>
          <h1 className="text-heading-1 font-heading font-bold mb-4">
            Thoughts on{' '}
            <span className="text-gradient">Excellence</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Deep dives into training, nutrition, discipline, and the pursuit of
            high-performance living. Written from the intersection of software
            engineering and physical mastery.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
