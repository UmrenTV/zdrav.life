/**
 * Seed products. Requires product-categories.
 * Uploads featuredImage and gallery from public/ to Strapi and links to each product.
 */

import { loadJson } from '../lib/load-json';
import { createEntry, getCollection } from '../lib/client';
import { uploadFile, uploadFilesAndLink } from '../lib/upload';

interface ProductImageJson {
  id: string;
  url: string;
  alt?: string;
  isPrimary?: boolean;
}

interface ProductJson {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  shortDescription: string;
  description: string;
  images?: ProductImageJson[];
  category: { id: string };
  price: number;
  compareAtPrice?: number;
  currency: string;
  stockStatus: string;
  sku: string;
  featured: boolean;
  details: { label: string; value: string }[];
  shippingInfo: Record<string, unknown>;
  seo: { title: string; description: string; keywords?: string[] };
  relatedProductIds: string[];
}

export async function seedProducts(
  productCategoryIdMap: Map<string, string>
): Promise<Map<string, string>> {
  const products = await loadJson<ProductJson[]>('products.json');
  const idMap = new Map<string, string>();

  for (const p of products) {
    const existing = await getCollection<{ slug: string }>('products', {
      filters: { slug: p.slug },
      publicationState: 'preview',
    });
    if (existing.length > 0) {
      const doc = existing[0] as { documentId?: string };
      if (doc.documentId) idMap.set(p.id, doc.documentId);
      console.log(`  Product "${p.title}" already exists, skip`);
      continue;
    }

    const categoryDocId = productCategoryIdMap.get(p.category.id);
    const specs = (p.details || []).map((d) => ({ label: d.label, value: d.value }));

    const data: Record<string, unknown> = {
      title: p.title,
      slug: p.slug,
      subtitle: p.subtitle,
      shortDescription: p.shortDescription,
      description: p.description,
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      currency: p.currency || 'USD',
      stockStatus: p.stockStatus || 'in_stock',
      sku: p.sku,
      featured: p.featured,
      specs: specs.length ? specs : undefined,
      shippingInfo: p.shippingInfo || {},
      reviewsEnabled: true,
      seo: {
        metaTitle: p.seo?.title,
        metaDescription: p.seo?.description,
        keywords: Array.isArray(p.seo?.keywords) ? p.seo.keywords.join(', ') : '',
      },
    };
    if (categoryDocId) (data as Record<string, unknown>).category = { connect: [categoryDocId] };

    const created = await createEntry<{ documentId?: string }>('products', data);
    const docId = (created as { documentId?: string }).documentId;
    if (docId) {
      idMap.set(p.id, docId);

      const images = p.images ?? [];
      const ref = 'api::product.product';
      const primary = images.find((i) => i.isPrimary) ?? images[0];
      if (primary?.url) {
        const id = await uploadFile(primary.url, {
          linkToEntry: { ref, refId: docId, field: 'featuredImage' },
          alternativeText: primary.alt ?? p.title,
        });
        if (id) console.log(`    Uploaded featuredImage: ${primary.url}`);
      }
      if (images.length > 0) {
        const urls = images.map((i) => i.url);
        await uploadFilesAndLink(urls, { ref, refId: docId, field: 'gallery' });
        console.log(`    Uploaded gallery: ${urls.length} image(s)`);
      }
    }
    console.log(`  Created product: ${p.title} (${docId})`);
  }
  return idMap;
}
