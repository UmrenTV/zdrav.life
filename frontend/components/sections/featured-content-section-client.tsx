'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Calendar,
  FileText,
  ShoppingBag,
  Play,
  ImageIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import type { FeaturedContentItem } from '@/types';

interface FeaturedContentSectionClientProps {
  topPromoted?: FeaturedContentItem;
  items: FeaturedContentItem[];
  section?: {
    heading?: string;
    subheading?: string;
    viewAllLabel?: string;
    viewAllHref?: string;
  };
}

const TYPE_CONFIG: Record<
  FeaturedContentItem['type'],
  { label: string; icon: typeof FileText; className: string }
> = {
  article: {
    label: 'Article',
    icon: FileText,
    className:
      'bg-background dark:bg-background/90 text-blue-600 dark:text-blue-400 border-blue-500/40',
  },
  product: {
    label: 'Product',
    icon: ShoppingBag,
    className:
      'bg-background dark:bg-background/90 text-emerald-600 dark:text-emerald-400 border-emerald-500/40',
  },
  video: {
    label: 'Video',
    icon: Play,
    className:
      'bg-background dark:bg-background/90 text-red-600 dark:text-red-400 border-red-500/40',
  },
  gallery: {
    label: 'Gallery',
    icon: ImageIcon,
    className:
      'bg-background dark:bg-background/90 text-purple-600 dark:text-purple-400 border-purple-500/40',
  },
};

function ContentCard({
  item,
  variant = 'small',
}: {
  item: FeaturedContentItem;
  variant?: 'hero' | 'small';
}) {
  const config = TYPE_CONFIG[item.type];
  const TypeIcon = config.icon;
  const hasTags = item.tags && item.tags.length > 0;

  if (variant === 'hero') {
    return (
      <Link href={item.href} className="block h-full group">
        <div className="relative h-full rounded-xl overflow-hidden bg-card border">
          <div className="absolute inset-0">
            {item.image && (
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </div>
          <div className="relative h-full flex flex-col justify-end p-6 lg:p-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge
                variant="outline"
                className={`${config.className} gap-1 text-xs`}
              >
                <TypeIcon className="h-3 w-3" />
                {config.label}
              </Badge>
              {item.category && (
                <Badge variant="secondary" className="text-xs">
                  {item.category}
                </Badge>
              )}
            </div>
            {hasTags && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {item.tags!.slice(0, 2).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs bg-background/50"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
            <h3 className="text-2xl lg:text-3xl font-heading font-semibold mb-3 group-hover:text-primary transition-colors">
              {item.title}
            </h3>
            {item.subtitle && (
              <p className="text-muted-foreground mb-4 line-clamp-2">
                {item.subtitle}
              </p>
            )}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {item.publishedAt && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(item.publishedAt)}
                </span>
              )}
              {item.info && (
                <span className="text-foreground/70">{item.info}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={item.href} className="block group">
      <div className="flex gap-4 p-4 rounded-xl bg-card border hover:border-primary/50 transition-colors">
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden">
          {item.image && (
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="128px"
            />
          )}
        </div>
        <div className="flex flex-col justify-center min-w-0">
          <div className="mb-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge
                variant="outline"
                className={`${config.className} gap-1 text-[10px] px-1.5 py-0`}
              >
                <TypeIcon className="h-2.5 w-2.5" />
                {config.label}
              </Badge>
              {item.category && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  {item.category}
                </Badge>
              )}
            </div>
            {hasTags && (
              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                {item.tags!.slice(0, 2).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-[10px] px-1.5 py-0"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <h3 className="font-heading font-semibold mb-1 group-hover:text-primary transition-colors line-clamp-2 text-sm sm:text-base">
            {item.title}
          </h3>
          {item.subtitle && (
            <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
              {item.subtitle}
            </p>
          )}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {item.publishedAt && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(item.publishedAt)}
              </span>
            )}
            {item.info && (
              <span className="text-foreground/70">{item.info}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function FeaturedContentSectionClient({
  topPromoted,
  items,
  section,
}: FeaturedContentSectionClientProps) {
  const heading = section?.heading ?? 'Featured Content';
  const subheading =
    section?.subheading ??
    'Deep dives into training, nutrition, and the pursuit of excellence.';
  const showViewAll = !!(section?.viewAllHref && section?.viewAllLabel);

  if (!topPromoted && items.length === 0) return null;

  return (
    <section className="section-padding bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-heading-2 font-heading font-semibold mb-2">
              {heading}
            </h2>
            <p className="text-muted-foreground">{subheading}</p>
          </div>
          {showViewAll && (
            <Button
              asChild
              variant="ghost"
              className="hidden sm:flex group"
            >
              <Link href={section!.viewAllHref!}>
                {section!.viewAllLabel}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          )}
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6">
          {/* Top promoted: on mobile full-width above the list, on desktop left column matching scroll height */}
          {topPromoted && (
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="min-h-[320px] lg:h-[532px]"
            >
              <ContentCard item={topPromoted} variant="hero" />
            </motion.article>
          )}

          {/* Scrollable cards: matches hero height, ~3 visible at a time */}
          <div className="max-h-[532px] lg:h-[532px] overflow-y-auto pr-1 scrollbar-thin flex flex-col gap-4">
            {items.map((item, index) => (
              <motion.article
                key={`${item.type}-${item.id}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: Math.min(index, 3) * 0.1 }}
                className="shrink-0"
              >
                <ContentCard item={item} variant="small" />
              </motion.article>
            ))}
          </div>
        </div>

        {showViewAll && (
          <div className="mt-6 sm:hidden">
            <Button asChild variant="outline" className="w-full">
              <Link href={section!.viewAllHref!}>{section!.viewAllLabel}</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
