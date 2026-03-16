'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getLucideIcon } from '@/lib/lucide-icon';
import type { HomePageData } from '@/types';

const DEFAULT_CTA = {
  heading: 'Ready to Engineer Your Vitality?',
  subheading:
    "Start your journey today. Explore the blog, watch the videos, or join the community of like-minded individuals pursuing excellence.",
  primaryButton: { label: 'Start Reading', href: '/blog', icon: 'ArrowRight' as const },
  secondaryButton: { label: 'Learn More', href: '/about' },
};

export function CTABannerSection({ home }: { home?: HomePageData }) {
  const cta = home?.cta;
  const heading = cta?.heading ?? DEFAULT_CTA.heading;
  const subheading = cta?.subheading ?? DEFAULT_CTA.subheading;
  const primary = cta?.primaryButton ?? DEFAULT_CTA.primaryButton;
  const secondary = cta?.secondaryButton ?? DEFAULT_CTA.secondaryButton;
  const PrimaryIcon = primary?.icon ? getLucideIcon(primary.icon) : ArrowRight;

  return (
    <section className="section-padding-sm w-full max-w-full min-w-0 overflow-hidden">
      <div className="container mx-auto w-full max-w-full min-w-0 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl bg-primary text-primary-foreground p-8 md:p-12 lg:p-16"
        >
          {/* Background Pattern */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `linear-gradient(to right, white 1px, transparent 1px),
                               linear-gradient(to bottom, white 1px, transparent 1px)`,
              backgroundSize: '3rem 3rem',
            }}
          />

          {/* Decorative Circles */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative text-center max-w-2xl mx-auto">
            <h2 className="text-heading-1 font-heading font-bold mb-4">
              {heading}
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8">
              {subheading}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto group"
              >
                <Link href={primary.href}>
                  {primary.label}
                  {PrimaryIcon && <PrimaryIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />}
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto border-2 border-primary-foreground bg-transparent text-primary-foreground hover:bg-primary-foreground/20"
              >
                <Link href={secondary.href}>{secondary.label}</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
