/**
 * Update home-page single type with featured relations. Run after posts, products, videos, gallery, testimonials.
 */

import { updateSingleType, getCollection } from '../lib/client';

async function getDocIdsBySlugs(
  collection: string,
  slugs: string[]
): Promise<string[]> {
  const docIds: string[] = [];
  for (const slug of slugs) {
    const list = await getCollection(collection, { filters: { slug }, publicationState: 'preview' });
    const doc = list[0] as { documentId?: string } | undefined;
    if (doc?.documentId) docIds.push(doc.documentId);
  }
  return docIds;
}

export async function seedHomePage(
  featuredPostSlugs: string[],
  featuredProductSlugs: string[],
  featuredVideoSlugs: string[],
  featuredGalleryIds: string[],
  featuredTestimonialCount: number
): Promise<void> {
  const [postDocIds, productDocIds, videoDocIds] = await Promise.all([
    getDocIdsBySlugs('posts', featuredPostSlugs),
    getDocIdsBySlugs('products', featuredProductSlugs),
    getDocIdsBySlugs('videos', featuredVideoSlugs),
  ]);

  const galleryDocIds: string[] = [];
  for (const id of featuredGalleryIds) {
    const list = await getCollection('gallery-items', { filters: { slug: `gallery-${id}` }, publicationState: 'preview' });
    const doc = list[0] as { documentId?: string } | undefined;
    if (doc?.documentId) galleryDocIds.push(doc.documentId);
  }

  const testimonials = await getCollection('testimonials', {
    pagination: { page: 1, pageSize: featuredTestimonialCount },
    publicationState: 'preview',
  });
  const testimonialDocIds = (testimonials as { documentId?: string }[])
    .map((d) => d.documentId)
    .filter(Boolean) as string[];

  await updateSingleType('home-page', {
    featuredPosts: { connect: postDocIds },
    featuredProducts: { connect: productDocIds },
    featuredVideos: { connect: videoDocIds },
    featuredGalleryItems: { connect: galleryDocIds },
    featuredTestimonials: { connect: testimonialDocIds },
  });
  console.log('  Updated home-page with featured relations');
}
