'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSiteConfig } from '@/lib/context/site-config';
import { getLucideIcon } from '@/lib/lucide-icon';
import { MarkdownText } from '@/components/shared/markdown-text';
import type { HomePageData } from '@/types';

const DEFAULT_STATS = [
  { label: 'Years Training', value: '5+' },
  { label: 'Lines of Code', value: '100K+' },
  { label: 'KM Ridden', value: '50K+' },
];

const DEFAULT_ICON_TEXTS = [
  { icon: 'Code', text: 'Engineering' },
  { icon: 'Dumbbell', text: 'Training' },
  { icon: 'Bike', text: 'Adventure' },
];

export function AboutPreviewSection({ home }: { home?: HomePageData }) {
  const siteConfig = useSiteConfig();
  const siteName = siteConfig.name || 'ZdravLife';
  const about = home?.aboutPreview;
  const imageSrc = about?.image || '/images/about-portrait.jpg';
  const imageAlt = about?.imageAlt ?? 'Zdrav - Software Engineer & Athlete';
  const imageStats = about?.imageStats?.length ? about.imageStats : DEFAULT_STATS;
  const eyebrow = about?.eyebrow ?? `About ${siteName}`;
  const headingLine1 = about?.headingLine1 ?? 'Software Engineer by Day.';
  const headingAccent = about?.headingAccent ?? 'Vitality Architect';
  const headingLine2 = about?.headingLine2 ?? ' by Choice.';
  const description = about?.description ?? null;
  const defaultDescription = (
    <>
      <p>
        I'm a software engineer who approaches health and fitness with the
        same systematic rigor I apply to code. After years of experimenting
        with different training protocols, nutrition strategies, and
        lifestyle optimizations, I've developed a comprehensive system for
        high-performance living.
      </p>
      <p>
        {siteName} is the intersection of my passions: writing elegant code,
        building physical strength, exploring the world on two wheels, and
        constantly pushing the boundaries of what's possible.
      </p>
      <p>
        This isn't about being perfect. It's about being consistent. It's
        about building systems that work when motivation fails. It's about
        the long game.
      </p>
    </>
  );
  const descriptionBlock = description
    ? description.split('\n').filter(Boolean).map((p, i) => <MarkdownText key={i} as="p">{p}</MarkdownText>)
    : defaultDescription;
  const iconTexts = about?.iconTexts?.length ? about.iconTexts : DEFAULT_ICON_TEXTS;
  const buttonLabel = about?.buttonLabel ?? 'Read My Story';
  const buttonHref = about?.buttonHref ?? '/about';

  return (
    <section className="section-padding bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[90vw]">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative mx-auto w-full max-w-md lg:max-w-none pb-8 lg:pb-0"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                unoptimized={imageSrc.startsWith('http')}
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </div>

            {/* Floating Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative mx-auto -mt-12 w-fit lg:absolute lg:mt-0 lg:-bottom-6 lg:-right-6 bg-card border rounded-xl p-4 sm:p-6 shadow-soft-lg"
            >
              <div className="grid grid-cols-3 gap-4 sm:gap-6">
                {imageStats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-2xl font-heading font-bold text-primary">
                      {stat.value}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-vitality/10 rounded-full blur-2xl pointer-events-none" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="min-w-0"
          >
            <span className="inline-flex items-center gap-2 text-sm font-medium text-primary mb-4">
              {(() => {
                const CodeIcon = getLucideIcon('Code');
                return CodeIcon ? <CodeIcon className="h-4 w-4" /> : null;
              })()}
              {eyebrow}
            </span>

            <h2 className="text-heading-1 font-heading font-semibold mb-6">
              {headingLine1}
              <br />
              <span className="text-gradient">{headingAccent}</span>
              {headingLine2}
            </h2>

            <div className="space-y-4 text-muted-foreground mb-8">
              {descriptionBlock}
            </div>

            {/* Icons */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-8">
              {iconTexts.map((item) => {
                const Icon = getLucideIcon(item.icon);
                return (
                  <div key={item.text} className="flex items-center gap-2 text-sm">
                    <div className="h-10 w-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
                      {Icon && <Icon className="h-5 w-5 text-primary" />}
                    </div>
                    <span className="font-medium">{item.text}</span>
                  </div>
                );
              })}
            </div>

            <Button asChild size="lg" className="group">
              <Link href={buttonHref}>
                {buttonLabel}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
