/**
 * Seed site-setting single type from site-config.json (or minimal defaults when file missing).
 * Used by both schema-only seed and dummy-data seed.
 */

import { loadJson } from '../lib/load-json';
import { updateSingleType } from '../lib/client';

interface SiteConfigJson {
  name: string;
  tagline: string;
  description?: string;
  url: string;
  ogImage: string;
  links: {
    youtube?: string;
    instagram?: string;
    twitter?: string;
    github?: string;
    discord?: string;
  };
  author: { name: string; email: string; bio: string; avatar: string };
  seo: {
    titleTemplate?: string;
    defaultTitle: string;
    defaultDescription: string;
    twitterHandle?: string;
    keywords?: string[];
  };
  newsletterHeading?: string;
  newsletterText?: string;
  footerText?: string;
  menu?: { name: string; href: string; icon?: string; openInNewTab?: boolean }[];
  footerLegalLinks?: { label: string; href: string }[];
  footerLinkGroups?: { title: string; links: { label: string; href: string }[] }[];
  nameAccent?: { useAccent?: boolean; position?: 'first' | 'last'; letterCount?: number };
  features?: { shop?: boolean; blog?: boolean; gallery?: boolean; videos?: boolean };
}

const MINIMAL_SITE_CONFIG: SiteConfigJson = {
  name: 'ZdravLife',
  tagline: 'Engineer Your Vitality',
  url: process.env.SITE_URL || 'http://localhost:3000',
  ogImage: '/images/og-default.jpg',
  links: {},
  author: { name: 'Zdrav', email: '', bio: '', avatar: '' },
  seo: { defaultTitle: 'ZdravLife', defaultDescription: 'Engineer your vitality.', twitterHandle: '@zdravlife' },
};

export async function seedSiteSetting(): Promise<void> {
  let config: SiteConfigJson;
  try {
    config = await loadJson<SiteConfigJson>('site-config.json');
  } catch {
    config = MINIMAL_SITE_CONFIG;
    console.log('  Using minimal site config (site-config.json not found)');
  }
  const socialLinks = [
    config.links.youtube && { platform: 'youtube', label: 'YouTube', href: config.links.youtube },
    config.links.instagram && { platform: 'instagram', label: 'Instagram', href: config.links.instagram },
    config.links.twitter && { platform: 'twitter', label: 'Twitter', href: config.links.twitter },
    config.links.github && { platform: 'github', label: 'GitHub', href: config.links.github },
    config.links.discord && { platform: 'discord', label: 'Discord', href: config.links.discord },
  ].filter(Boolean) as { platform: string; label: string; href: string }[];

  const defaultSeo = {
    metaTitle: config.seo.defaultTitle,
    metaDescription: config.seo.defaultDescription,
    ogTitle: config.seo.defaultTitle,
    ogDescription: config.seo.defaultDescription,
    canonicalUrl: config.url,
    noindex: false,
    nofollow: false,
    keywords: Array.isArray(config.seo.keywords) ? config.seo.keywords.join(', ') : '',
  };

  await updateSingleType('site-setting', {
    siteName: config.name,
    siteUrl: config.url,
    tagline: config.tagline,
    defaultSeo,
    socialLinks,
    contactEmail: config.author.email,
    youtubeUrl: config.links.youtube || undefined,
    instagramUrl: config.links.instagram || undefined,
    githubUrl: config.links.github || undefined,
    twitterUrl: config.links.twitter || undefined,
    newsletterHeading: config.newsletterHeading ?? undefined,
    newsletterText: config.newsletterText ?? undefined,
    footerText: config.footerText ?? undefined,
    menuItems: Array.isArray(config.menu)
      ? config.menu.map((item) => ({
          name: item.name,
          link: item.href,
          icon: item.icon ?? undefined,
          openInNewTab: item.openInNewTab ?? false,
        }))
      : undefined,
    enableShop: config.features?.shop ?? true,
    enableBlog: config.features?.blog ?? true,
    enableGallery: config.features?.gallery ?? true,
    enableVideos: config.features?.videos ?? true,
    footerLegalLinks: Array.isArray(config.footerLegalLinks)
      ? config.footerLegalLinks.map((item) => ({ label: item.label, link: item.href }))
      : undefined,
    footerLinkGroups: Array.isArray(config.footerLinkGroups)
      ? config.footerLinkGroups.map((group) => ({
          title: group.title,
          links: group.links.map((link) => ({ label: link.label, link: link.href })),
        }))
      : undefined,
    useAccentColorForName: config.nameAccent?.useAccent ?? true,
    nameAccentPosition: config.nameAccent?.position ?? 'last',
    nameAccentLetterCount: config.nameAccent?.letterCount ?? 4,
    tiktokUrl: undefined,
    maintenanceMode: false,
    themeNotes: undefined,
  });
  console.log('  Updated site-setting');
}
