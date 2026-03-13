import { MetadataRoute } from 'next';
import { generateSitemapEntries } from '@/lib/seo/metadata';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await generateSitemapEntries();
  
  return entries.map((entry) => ({
    url: `https://zdrav.life${entry.url}`,
    lastModified: entry.lastModified ? new Date(entry.lastModified) : new Date(),
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
