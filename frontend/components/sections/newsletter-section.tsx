'use client';

import { motion } from 'framer-motion';
import { useSiteConfig } from '@/lib/context/site-config';
import { NewsletterCard } from '@/components/shared/newsletter-card';
import type { FormData } from '@/types';

export function NewsletterSection({ form }: { form?: FormData }) {
  const siteConfig = useSiteConfig();

  if (!form || !form.enabled) return null;

  return (
    <section className="section-padding w-full max-w-full min-w-0 overflow-hidden bg-muted/30">
      <div className="container mx-auto w-full max-w-full min-w-0 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <NewsletterCard form={form} siteName={siteConfig.name} formSource={form.name || 'Homepage Newsletter'} />
        </motion.div>
      </div>
    </section>
  );
}
