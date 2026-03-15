import { MetadataRoute } from 'next';
import { generateSitemapEntries } from '@/lib/seo/metadata';
import { getSiteConfig } from '@/lib/data/data-source';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [entries, config] = await Promise.all([generateSitemapEntries(), getSiteConfig()]);
  const baseUrl = (config.url || 'https://zdrav.life').replace(/\/$/, '');
  return entries.map((entry) => ({
    url: `${baseUrl}${entry.url.startsWith('/') ? entry.url : `/${entry.url}`}`,
    lastModified: entry.lastModified ? new Date(entry.lastModified) : new Date(),
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
