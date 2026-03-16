'use client';

import { useState, useCallback } from 'react';
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
  Loader2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GalleryModal } from '@/components/gallery/gallery-modal';
import { ProductPreviewModal } from '@/components/shop/product-preview-modal';
import { VideoPreviewModal } from '@/components/videos/video-preview-modal';
import { ArticlePreviewModal } from '@/components/blog/article-preview-modal';
import { formatDate } from '@/lib/utils';
import type { FeaturedContentItem, GalleryItem, Product, VideoItem, Post, SectionConfig } from '@/types';

type ClickBehavior = 'modal' | 'link';

interface ContentShowcaseProps {
  topPromoted?: FeaturedContentItem;
  items: FeaturedContentItem[];
  section?: SectionConfig;
  /** 'left' = hero on left (default), 'right' = hero on right */
  layout?: 'left' | 'right';
  /** When 'link', clicking items navigates to item.href instead of opening a modal. Defaults to 'modal'. */
  clickBehavior?: ClickBehavior;
  /** Optional background class override */
  bgClassName?: string;
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

function CategoryBadge({ item, size = 'sm' }: { item: FeaturedContentItem; size?: 'sm' | 'xs' }) {
  if (!item.category) return null;
  const cls = size === 'sm' ? 'text-xs' : 'text-[10px] px-1.5 py-0';

  if (item.categoryHref) {
    return (
      <Link
        href={item.categoryHref}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10"
      >
        <Badge variant="secondary" className={`${cls} cursor-pointer hover:bg-secondary/60 transition-colors`}>
          {item.category}
        </Badge>
      </Link>
    );
  }

  return <Badge variant="secondary" className={cls}>{item.category}</Badge>;
}

function ContentCardInner({
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
      <div className="relative h-full rounded-xl overflow-hidden bg-card border group-hover:border-primary/50 transition-colors">
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
            <Badge variant="outline" className={`${config.className} gap-1 text-xs`}>
              <TypeIcon className="h-3 w-3" />
              {config.label}
            </Badge>
            <CategoryBadge item={item} size="sm" />
          </div>
          {hasTags && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {item.tags!.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs bg-background/50">#{tag}</Badge>
              ))}
            </div>
          )}
          <h3 className="text-2xl lg:text-3xl font-heading font-semibold mb-3 group-hover:text-primary transition-colors">
            {item.title}
          </h3>
          {item.subtitle && (
            <p className="text-muted-foreground mb-4 line-clamp-2">{item.subtitle}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {item.publishedAt && (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(item.publishedAt)}
              </span>
            )}
            {item.info && <span className="text-foreground/70">{item.info}</span>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 p-4 rounded-xl bg-card border group-hover:border-primary/50 transition-colors">
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
            <Badge variant="outline" className={`${config.className} gap-1 text-[10px] px-1.5 py-0`}>
              <TypeIcon className="h-2.5 w-2.5" />
              {config.label}
            </Badge>
            <CategoryBadge item={item} size="xs" />
          </div>
        </div>
        <h3 className="font-heading font-semibold mb-1 group-hover:text-primary transition-colors line-clamp-2 text-sm sm:text-base">
          {item.title}
        </h3>
        {item.subtitle && (
          <p className="text-sm text-muted-foreground line-clamp-1 mb-2">{item.subtitle}</p>
        )}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {item.publishedAt && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(item.publishedAt)}
            </span>
          )}
          {item.info && <span className="text-foreground/70">{item.info}</span>}
        </div>
      </div>
    </div>
  );
}

export function ContentShowcase({
  topPromoted,
  items,
  section,
  layout = 'left',
  clickBehavior = 'modal',
  bgClassName = 'bg-muted/30',
}: ContentShowcaseProps) {
  const heading = section?.heading ?? 'Featured Content';
  const subheading = section?.subheading;
  const showViewAll = !!(section?.viewAllHref && section?.viewAllLabel);

  const [galleryItem, setGalleryItem] = useState<GalleryItem | null>(null);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [video, setVideo] = useState<VideoItem | null>(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [article, setArticle] = useState<Post | null>(null);
  const [articleModalOpen, setArticleModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleItemClick = useCallback(async (item: FeaturedContentItem) => {
    if (clickBehavior === 'link') {
      window.location.href = item.href;
      return;
    }

    setLoading(true);
    try {
      if (item.type === 'gallery') {
        const res = await fetch(`/api/gallery/${item.id}`);
        if (res.ok) {
          const data = await res.json();
          setGalleryItem(data.item);
          setGalleryModalOpen(true);
        }
      } else if (item.type === 'product') {
        const res = await fetch(`/api/products/${item.slug}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data.product);
          setProductModalOpen(true);
        }
      } else if (item.type === 'video') {
        const res = await fetch(`/api/videos/${item.slug}`);
        if (res.ok) {
          const data = await res.json();
          setVideo(data.video);
          setVideoModalOpen(true);
        }
      } else if (item.type === 'article') {
        const res = await fetch(`/api/posts/${item.slug}`);
        if (res.ok) {
          const data = await res.json();
          setArticle(data.post);
          setArticleModalOpen(true);
        }
      }
    } catch { /* ignore fetch errors */ }
    setLoading(false);
  }, [clickBehavior]);

  if (!topPromoted && items.length === 0) return null;

  const heroBlock = topPromoted && (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="min-h-[320px] lg:h-[532px]"
    >
      {clickBehavior === 'link' ? (
        <Link href={topPromoted.href} className="block h-full w-full text-left group">
          <ContentCardInner item={topPromoted} variant="hero" />
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => handleItemClick(topPromoted)}
          className="block h-full w-full text-left group"
        >
          <ContentCardInner item={topPromoted} variant="hero" />
        </button>
      )}
    </motion.article>
  );

  const listBlock = (
    <div className="max-h-[532px] lg:h-[532px] overflow-y-auto pr-1 scrollbar-thin flex flex-col gap-[22px]">
      {items.map((item, index) => (
        <motion.article
          key={`${item.type}-${item.id}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: Math.min(index, 3) * 0.1 }}
          className="shrink-0"
        >
          {clickBehavior === 'link' ? (
            <Link href={item.href} className="block w-full text-left group">
              <ContentCardInner item={item} variant="small" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => handleItemClick(item)}
              className="block w-full text-left group"
            >
              <ContentCardInner item={item} variant="small" />
            </button>
          )}
        </motion.article>
      ))}
    </div>
  );

  return (
    <section className={`section-padding ${bgClassName}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-heading-2 font-heading font-semibold mb-2">{heading}</h2>
            {subheading && <p className="text-muted-foreground">{subheading}</p>}
          </div>
          {showViewAll && (
            <Button asChild variant="ghost" className="hidden sm:flex group">
              <Link href={section!.viewAllHref!}>
                {section!.viewAllLabel}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          )}
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6">
          {layout === 'left' ? (
            <>
              {heroBlock}
              {listBlock}
            </>
          ) : (
            <>
              {listBlock}
              {heroBlock}
            </>
          )}
        </div>

        {showViewAll && (
          <div className="mt-6 sm:hidden">
            <Button asChild variant="outline" className="w-full">
              <Link href={section!.viewAllHref!}>{section!.viewAllLabel}</Link>
            </Button>
          </div>
        )}
      </div>

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-card rounded-lg p-4 shadow-lg">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        </div>
      )}

      <GalleryModal
        item={galleryItem}
        open={galleryModalOpen}
        onOpenChange={setGalleryModalOpen}
        isGalleryRoute={false}
      />

      <ProductPreviewModal
        product={product}
        open={productModalOpen}
        onOpenChange={setProductModalOpen}
      />

      <VideoPreviewModal
        video={video}
        open={videoModalOpen}
        onOpenChange={setVideoModalOpen}
      />

      <ArticlePreviewModal
        article={article}
        open={articleModalOpen}
        onOpenChange={setArticleModalOpen}
      />
    </section>
  );
}
