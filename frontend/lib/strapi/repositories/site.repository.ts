/**
 * Site settings and home page from Strapi. Use when isStrapiEnabled.
 */

import { getSingleType } from '@/lib/strapi/client';
import { mapStrapiSiteSettings, mapStrapiHomePage, mapStrapiAboutPage } from '@/lib/strapi/mappers';
import type { SiteConfig } from '@/types';

const SITE_SETTING_POPULATE = ['logo', 'defaultOgImage', 'favicon', 'menuItems', 'footerLinkGroups', 'footerLinkGroups.links', 'footerForm', 'footerForm.benefits'];

export async function getSiteSettings(): Promise<SiteConfig | null> {
  const raw = await getSingleType('site-setting', SITE_SETTING_POPULATE);
  return raw ? mapStrapiSiteSettings(raw) : null;
}

const HOME_PAGE_POPULATE = [
  'hero',
  'hero.buttons',
  'hero.stats',
  'sectionFeaturedContent',
  'topPromoted',
  'topPromoted.post',
  'topPromoted.post.coverImage',
  'topPromoted.post.category',
  'topPromoted.post.tags',
  'topPromoted.product',
  'topPromoted.product.featuredImage',
  'topPromoted.product.category',
  'topPromoted.product.tags',
  'topPromoted.video',
  'topPromoted.video.thumbnail',
  'topPromoted.video.category',
  'topPromoted.video.tags',
  'topPromoted.galleryItem',
  'topPromoted.galleryItem.image',
  'topPromoted.galleryItem.category',
  'topPromoted.galleryItem.tags',
  'featuredContent',
  'featuredContent.post',
  'featuredContent.post.coverImage',
  'featuredContent.post.category',
  'featuredContent.post.tags',
  'featuredContent.product',
  'featuredContent.product.featuredImage',
  'featuredContent.product.category',
  'featuredContent.product.tags',
  'featuredContent.video',
  'featuredContent.video.thumbnail',
  'featuredContent.video.category',
  'featuredContent.video.tags',
  'featuredContent.galleryItem',
  'featuredContent.galleryItem.image',
  'featuredContent.galleryItem.category',
  'featuredContent.galleryItem.tags',
  'pillars',
  'pillars.items',
  'aboutPreview',
  'aboutPreview.image',
  'aboutPreview.imageStats',
  'aboutPreview.iconTexts',
  'sectionVideos',
  'sectionGallery',
  'sectionBlog',
  'sectionShop',
  'sectionTestimonials',
  'newsletter',
  'newsletter.benefits',
  'cta',
  'cta.primaryButton',
  'cta.secondaryButton',
  'featuredPosts',
  'featuredProducts',
  'featuredVideos',
  'featuredGalleryItems',
  'featuredTestimonials',
];

export async function getHomePage(): Promise<ReturnType<typeof mapStrapiHomePage>> {
  const raw = await getSingleType('home-page', HOME_PAGE_POPULATE);
  return raw ? mapStrapiHomePage(raw) : null;
}

const ABOUT_PAGE_POPULATE = [
  'hero',
  'main',
  'main.image',
  'main.iconTexts',
  'stats',
  'valuesSection',
  'values',
  'cta',
  'seo',
];

export async function getAboutPage(): Promise<ReturnType<typeof mapStrapiAboutPage>> {
  const raw = await getSingleType('about-page', ABOUT_PAGE_POPULATE);
  return raw ? mapStrapiAboutPage(raw) : null;
}
