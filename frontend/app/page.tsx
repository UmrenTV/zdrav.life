import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { HeroSection } from '@/components/sections/hero-section';
import { FeaturedContentSection } from '@/components/sections/featured-content-section';
import { LatestVideosSection } from '@/components/sections/latest-videos-section';
import { GalleryStripSection } from '@/components/sections/gallery-strip-section';
import { LatestBlogSection } from '@/components/sections/latest-blog-section';
import { LatestShopSection } from '@/components/sections/latest-shop-section';
import { TestimonialsSection } from '@/components/sections/testimonials-section';
import { generateMetadata as genMeta } from '@/lib/seo/metadata';
import { getSiteConfig, getHomePage } from '@/lib/data/data-source';

const PillarsSection = dynamic(() => import('@/components/sections/pillars-section').then(m => m.PillarsSection), { ssr: true });
const AboutPreviewSection = dynamic(() => import('@/components/sections/about-preview-section').then(m => m.AboutPreviewSection), { ssr: true });
const NewsletterSection = dynamic(() => import('@/components/sections/newsletter-section').then(m => m.NewsletterSection), { ssr: false });
const CTABannerSection = dynamic(() => import('@/components/sections/cta-banner-section').then(m => m.CTABannerSection), { ssr: false });


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
