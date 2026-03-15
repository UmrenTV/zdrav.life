import { MetadataRoute } from 'next';
import { getSiteConfig } from '@/lib/data/data-source';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const config = await getSiteConfig();
  const baseUrl = (config.url || 'https://zdrav.life').replace(/\/$/, '');
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/private/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
