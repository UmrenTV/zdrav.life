/**
 * Seed product categories from products (dedupe).
 */

import { loadJson } from '../lib/load-json';
import { createEntry, getCollection } from '../lib/client';

interface ProductJson {
  category: { id: string; slug: string; name: string; description?: string };
}

export async function seedProductCategories(): Promise<Map<string, string>> {
  const products = await loadJson<ProductJson[]>('products.json');
  const seen = new Map<string, { name: string; slug: string; description: string }>();
  products.forEach((p) => {
    if (!seen.has(p.category.id)) {
      seen.set(p.category.id, {
        name: p.category.name,
        slug: p.category.slug,
        description: (p.category as { description?: string }).description || '',
      });
    }
  });

  const idMap = new Map<string, string>();
  for (const [oldId, cat] of seen) {
    const existing = await getCollection<{ slug: string }>('product-categories', {
      filters: { slug: cat.slug },
      publicationState: 'preview',
    });
    if (existing.length > 0) {
      const doc = existing[0] as { documentId?: string };
      if (doc.documentId) idMap.set(oldId, doc.documentId);
      console.log(`  Product category "${cat.name}" already exists, skip`);
      continue;
    }
    const created = await createEntry<{ documentId?: string }>('product-categories', {
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
    });
    const docId = (created as { documentId?: string }).documentId;
    if (docId) idMap.set(oldId, docId);
    console.log(`  Created product category: ${cat.name} (${docId})`);
  }
  return idMap;
}
