'use client';

import * as React from 'react';
import type { SiteConfig } from '@/types';

const defaultConfig: SiteConfig = {
  name: 'ZdravLife',
  tagline: 'Engineer Your Vitality',
  logo: '',
  description: '',
  url: 'https://zdrav.life',
  ogImage: '/images/og-default.jpg',
  maintenanceMode: false,
  links: { youtube: '', instagram: '', twitter: '', github: '' },
  author: { name: 'Zdrav', email: '', bio: '', avatar: '/images/author-avatar.jpg' },
  seo: {
    titleTemplate: '%s | ZdravLife',
    defaultTitle: 'ZdravLife',
    defaultDescription: '',
    twitterHandle: '@zdravlife',
    keywords: [],
  },
  newsletterHeading: '',
  newsletterText: '',
  footerText: '',
  menu: [],
  footerLegalLinks: [],
  footerLinkGroups: [],
  nameAccent: { useAccent: true, position: 'last', letterCount: 4 },
  features: { shop: true, blog: true, gallery: true, videos: true },
};

const SiteConfigContext = React.createContext<SiteConfig>(defaultConfig);

export function SiteConfigProvider({
  config,
  children,
}: {
  config: SiteConfig | null;
  children: React.ReactNode;
}) {
  const value = config ?? defaultConfig;
  return (
    <SiteConfigContext.Provider value={value}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig(): SiteConfig {
  return React.useContext(SiteConfigContext);
}
