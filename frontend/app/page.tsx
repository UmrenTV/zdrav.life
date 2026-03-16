import { Suspense } from 'react';
import { HeroSection } from '@/components/sections/hero-section';
import { FeaturedContentSection } from '@/components/sections/featured-content-section';
import { PillarsSection } from '@/components/sections/pillars-section';
import { AboutPreviewSection } from '@/components/sections/about-preview-section';
import { LatestVideosSection } from '@/components/sections/latest-videos-section';
import { GalleryStripSection } from '@/components/sections/gallery-strip-section';
import { LatestBlogSection } from '@/components/sections/latest-blog-section';
import { LatestShopSection } from '@/components/sections/latest-shop-section';
import { TestimonialsSection } from '@/components/sections/testimonials-section';
import { NewsletterSection } from '@/components/sections/newsletter-section';
import { CTABannerSection } from '@/components/sections/cta-banner-section';
import { generateMetadata as genMeta } from '@/lib/seo/metadata';
import { getSiteConfig, getHomePage } from '@/lib/data/data-source';


export async function generateMetadata() {
  const config = await getSiteConfig();
  return genMeta(
    {
      title: 'Engineer Your Vitality',
      description:
        'Build strength. Master discipline. Ride further. Live deeper. A software engineer\'s journey into high-performance living.',
      ogType: 'website',
    },
    config
  );
}

export default async function HomePage() {
  const [config, home] = await Promise.all([getSiteConfig(), getHomePage()]);
  const features = config.features ?? { shop: true, blog: true, gallery: true, videos: true };

  return (
    <>
      <HeroSection home={home ?? undefined} />

      <Suspense fallback={<div className="h-96 bg-muted/50 animate-pulse" />}>
        <FeaturedContentSection home={home ?? undefined} />
      </Suspense>

      <PillarsSection home={home ?? undefined} />

      <AboutPreviewSection home={home ?? undefined} />

      {features.videos !== false && (
        <Suspense fallback={<div className="h-96 bg-muted/50 animate-pulse" />}>
          <LatestVideosSection home={home ?? undefined} />
        </Suspense>
      )}

      {features.gallery !== false && (
        <Suspense fallback={<div className="h-64 bg-muted/50 animate-pulse" />}>
          <GalleryStripSection home={home ?? undefined} />
        </Suspense>
      )}

      {features.blog !== false && (
        <Suspense fallback={<div className="h-96 bg-muted/50 animate-pulse" />}>
          <LatestBlogSection home={home ?? undefined} />
        </Suspense>
      )}

      {features.shop !== false && (
        <Suspense fallback={<div className="h-96 bg-muted/50 animate-pulse" />}>
          <LatestShopSection home={home ?? undefined} />
        </Suspense>
      )}

      <Suspense fallback={<div className="h-64 bg-muted/50 animate-pulse" />}>
        <TestimonialsSection home={home ?? undefined} />
      </Suspense>

      <NewsletterSection form={home?.newsletter} />

      <CTABannerSection home={home ?? undefined} />
    </>
  );
}
