/**
 * Site settings and home page from Strapi. Use when isStrapiEnabled.
 */

import { getSingleType } from '@/lib/strapi/client';
import { mapStrapiSiteSettings, mapStrapiHomePage } from '@/lib/strapi/mappers';
import type { SiteConfig } from '@/types';

const SITE_SETTING_POPULATE = ['logo', 'defaultOgImage', 'favicon', 'menuItems', 'footerLinkGroups', 'footerLinkGroups.links'];

export async function getSiteSettings(): Promise<SiteConfig | null> {
  const raw = await getSingleType('site-setting', SITE_SETTING_POPULATE);
  return raw ? mapStrapiSiteSettings(raw) : null;
}

export async function getHomePage(): Promise<ReturnType<typeof mapStrapiHomePage>> {
  const raw = await getSingleType('home-page', ['hero', 'featuredPosts', 'featuredProducts', 'featuredVideos', 'featuredGalleryItems', 'featuredTestimonials']);
  return raw ? mapStrapiHomePage(raw) : null;
}
