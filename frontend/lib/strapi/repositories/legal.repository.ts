/**
 * Legal pages from Strapi. Use when isStrapiEnabled.
 */

import { getCollection } from '@/lib/strapi/client';

export interface LegalPageData {
  id: string;
  title: string;
  slug: string;
  content: string;
}

function mapLegalPage(doc: unknown): LegalPageData | null {
  if (!doc || typeof doc !== 'object') return null;
  const d = doc as { documentId?: string; attributes?: Record<string, unknown> };
  const attrs = d.attributes ?? d;
  return {
    id: (d.documentId as string) ?? '',
    title: (attrs.title as string) ?? '',
    slug: (attrs.slug as string) ?? '',
    content: (attrs.content as string) ?? '',
  };
}

export async function getLegalPageBySlug(slug: string): Promise<LegalPageData | null> {
  const list = await getCollection('legal-pages');
  const doc = list.find((d) => (d.attributes as { slug?: string })?.slug === slug);
  return doc ? mapLegalPage(doc) : null;
}
