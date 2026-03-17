'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getLucideIcon } from '@/lib/lucide-icon';
import type { HomePageData } from '@/types';

const PILLAR_COLOR_MAP: Record<string, string> = {
  blue: 'from-blue-500/20 to-cyan-500/20',
  green: 'from-green-500/20 to-emerald-500/20',
  orange: 'from-orange-500/20 to-amber-500/20',
  purple: 'from-purple-500/20 to-violet-500/20',
  red: 'from-red-500/20 to-rose-500/20',
  primary: 'from-primary/20 to-vitality/20',
};

function hexToGradientStyle(hex: string): React.CSSProperties {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return {
    background: `linear-gradient(to bottom right, rgba(${r},${g},${b},0.2), rgba(${r},${g},${b},0.08))`,
  };
}

function isHex(value: string): boolean {
  return /^#?[0-9a-fA-F]{6}$/.test(value);
}

const DEFAULT_PILLARS = {
  heading: 'Explore the Pillars',
  subheading:
    'A comprehensive approach to high-performance living. Each pillar represents a key area of focus in the pursuit of vitality.',
  items: [
    { icon: 'Dumbbell', title: 'Training', description: 'Calisthenics, hypertrophy, and strength systems for building an elite physique.', href: '/training', colorKey: 'blue' },
    { icon: 'Utensils', title: 'Nutrition', description: 'Fasting protocols, meal systems, and nutritional optimization for high performance.', href: '/nutrition', colorKey: 'green' },
    { icon: 'Bike', title: 'Adventures', description: 'Motorcycle journeys, travel stories, and the pursuit of freedom on two wheels.', href: '/adventures', colorKey: 'orange' },
    { icon: 'Brain', title: 'Philosophy', description: 'Discipline, mindset, systems thinking, and the pursuit of excellence.', href: '/philosophy', colorKey: 'purple' },
    { icon: 'Video', title: 'Videos', description: 'Training tutorials, adventure vlogs, and deep dives into the ZdravLife philosophy.', href: '/videos', colorKey: 'red' },
    { icon: 'ShoppingBag', title: 'Shop', description: 'Premium apparel, digital guides, and gear for the pursuit of vitality.', href: '/shop', colorKey: 'primary' },
  ],
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export function PillarsSection({ home }: { home?: HomePageData }) {
  const pillarsData = home?.pillars;
  const heading = pillarsData?.heading ?? DEFAULT_PILLARS.heading;
  const subheading = pillarsData?.subheading ?? DEFAULT_PILLARS.subheading;
  const items = pillarsData?.items?.length ? pillarsData.items : DEFAULT_PILLARS.items;

  return (
    <section className="section-padding">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-heading-2 font-heading font-semibold mb-4">
            {heading}
          </h2>
          <p className="text-muted-foreground text-lg">
            {subheading}
          </p>
        </div>

        {/* Pillars Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {items.map((pillar) => {
            const Icon = getLucideIcon(pillar.icon);
            const useHex = isHex(pillar.colorKey);
            const gradientClass = useHex ? '' : (PILLAR_COLOR_MAP[pillar.colorKey] ?? PILLAR_COLOR_MAP.primary);
            const gradientStyle = useHex ? hexToGradientStyle(pillar.colorKey) : undefined;
            return (
              <motion.div key={pillar.title} variants={itemVariants}>
                <Link href={pillar.href} className="block h-full group">
                  <div
                    className={cn(
                      'relative h-full p-6 rounded-xl border bg-card overflow-hidden',
                      'transition-all duration-300',
                      'hover:shadow-soft-lg hover:-translate-y-1 hover:border-primary/30'
                    )}
                  >
                    <div
                      className={cn(
                        'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300',
                        !useHex && 'bg-gradient-to-br',
                        gradientClass
                      )}
                      style={gradientStyle}
                    />

                    {/* Content */}
                    <div className="relative">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                        {Icon && <Icon className="h-6 w-6 text-primary" />}
                      </div>
                      <h3 className="text-xl font-heading font-semibold mb-2 group-hover:text-primary transition-colors">
                        {pillar.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
