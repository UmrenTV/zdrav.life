/**
 * Seed testimonials. Maps authorName -> name, authorTitle -> role, content -> quote.
 * Uploads authorAvatar from public/ to Strapi and links to testimonial (field: avatar).
 */

import { loadJson } from '../lib/load-json';
import { createEntry } from '../lib/client';
import { uploadFile } from '../lib/upload';

interface TestimonialJson {
  id: string;
  authorName: string;
  authorTitle?: string;
  authorAvatar?: string;
  content: string;
  featured: boolean;
  createdAt: string;
}

export async function seedTestimonials(): Promise<void> {
  const testimonials = await loadJson<TestimonialJson[]>('testimonials.json');
  let order = 0;
  for (const t of testimonials) {
    const created = await createEntry<{ documentId?: string }>('testimonials', {
      name: t.authorName,
      role: t.authorTitle || undefined,
      quote: t.content,
      featured: t.featured,
      order: order++,
    });
    const docId = (created as { documentId?: string }).documentId;
    if (docId && t.authorAvatar) {
      const id = await uploadFile(t.authorAvatar, {
        linkToEntry: { ref: 'api::testimonial.testimonial', refId: docId, field: 'avatar' },
        alternativeText: t.authorName,
      });
      if (id) console.log(`    Uploaded avatar: ${t.authorAvatar}`);
    }
    console.log(`  Created testimonial: ${t.authorName}`);
  }
}
