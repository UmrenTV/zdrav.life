/**
 * Seed legal pages (privacy-policy, terms, shipping-returns). Content can be placeholder if not in JSON.
 */

import { createEntry, getCollection } from '../lib/client';

const LEGAL_PAGES = [
  { title: 'Privacy Policy', slug: 'privacy-policy', content: '<p>Privacy policy content. Edit in Strapi.</p>' },
  { title: 'Terms of Service', slug: 'terms', content: '<p>Terms of service content. Edit in Strapi.</p>' },
  { title: 'Shipping & Returns', slug: 'shipping-returns', content: '<p>Shipping and returns policy. Edit in Strapi.</p>' },
];

export async function seedLegalPages(): Promise<void> {
  for (const page of LEGAL_PAGES) {
    const existing = await getCollection<{ slug: string }>('legal-pages', {
      filters: { slug: page.slug },
      publicationState: 'preview',
    });
    if (existing.length > 0) {
      console.log(`  Legal page "${page.slug}" already exists, skip`);
      continue;
    }
    await createEntry('legal-pages', {
      title: page.title,
      slug: page.slug,
      content: page.content,
    });
    console.log(`  Created legal page: ${page.slug}`);
  }
}
