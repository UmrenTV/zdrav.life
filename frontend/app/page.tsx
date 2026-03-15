import { Suspense } from 'react';
import { HeroSection } from '@/components/sections/hero-section';
import { FeaturedContentSection } from '@/components/sections/featured-content-section';
import { PillarsSection } from '@/components/sections/pillars-section';
import { AboutPreviewSection } from '@/components/sections/about-preview-section';
import { FeaturedVideosSection } from '@/components/sections/featured-videos-section';
import { GalleryStripSection } from '@/components/sections/gallery-strip-section';
import { FeaturedBlogSection } from '@/components/sections/featured-blog-section';
import { FeaturedShopSection } from '@/components/sections/featured-shop-section';
import { TestimonialsSection } from '@/components/sections/testimonials-section';
import { NewsletterSection } from '@/components/sections/newsletter-section';
import { CTABannerSection } from '@/components/sections/cta-banner-section';
import { generateMetadata as genMeta } from '@/lib/seo/metadata';
import { getSiteConfig } from '@/lib/data/data-source';

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
  const config = await getSiteConfig();
  const features = config.features ?? { shop: true, blog: true, gallery: true, videos: true };

  return (
    <>
      <HeroSection />

      <Suspense fallback={<div className="h-96 bg-muted/50 animate-pulse" />}>
        <FeaturedContentSection />
      </Suspense>

      <PillarsSection />

      <AboutPreviewSection />

      {features.videos !== false && (
        <Suspense fallback={<div className="h-96 bg-muted/50 animate-pulse" />}>
          <FeaturedVideosSection />
        </Suspense>
      )}

      {features.gallery !== false && (
        <Suspense fallback={<div className="h-64 bg-muted/50 animate-pulse" />}>
          <GalleryStripSection />
        </Suspense>
      )}

      {features.blog !== false && (
        <Suspense fallback={<div className="h-96 bg-muted/50 animate-pulse" />}>
          <FeaturedBlogSection />
        </Suspense>
      )}

      {features.shop !== false && (
        <Suspense fallback={<div className="h-96 bg-muted/50 animate-pulse" />}>
          <FeaturedShopSection />
        </Suspense>
      )}

      <Suspense fallback={<div className="h-64 bg-muted/50 animate-pulse" />}>
        <TestimonialsSection />
      </Suspense>

      <NewsletterSection />

      <CTABannerSection />
    </>
  );
}
