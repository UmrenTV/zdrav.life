/**
 * Seed Strapi with full dummy content (categories, tags, posts, products, etc.).
 * Requires schema/content types to exist (copy from strapi-schema-export to cms first).
 * Usage: npx tsx scripts/strapi-seed/run-dummy-data.ts
 * Requires: STRAPI_URL and STRAPI_API_TOKEN. Run from project root.
 */
import 'dotenv/config';

import { loadJson } from './lib/load-json';
import { seedCategories } from './steps/01-categories';
import { seedTags } from './steps/02-tags';
import { seedAuthors } from './steps/03-authors';
import { seedFaqs } from './steps/04-faqs';
import { seedTestimonials } from './steps/05-testimonials';
import { seedSiteSetting } from './steps/06-site-setting';
import { seedHomePage } from './steps/07-home-page';
import { seedPosts } from './steps/08-posts';
import { seedVideos } from './steps/09-videos';
import { seedGallery } from './steps/10-gallery';
import { seedProductCategories } from './steps/11-product-categories';
import { seedProducts } from './steps/12-products';
import { seedReviews } from './steps/13-reviews';
import { seedComments } from './steps/14-comments';
import { seedLegalPages } from './steps/15-legal-pages';

async function main(): Promise<void> {
  console.log('Strapi dummy-data seed: starting...\n');

  const catResult = await seedCategories();
  const categoryIdMap = catResult.idMap;
  const categorySlugToDocId = catResult.slugToDocId;
  console.log('');

  const tagIdMap = await seedTags();
  console.log('');

  const authorIdMap = await seedAuthors();
  console.log('');

  await seedFaqs();
  console.log('');

  await seedTestimonials();
  console.log('');

  await seedSiteSetting();
  console.log('');

  const postIdMap = await seedPosts(categoryIdMap, tagIdMap, authorIdMap);
  console.log('');

  await seedVideos(categorySlugToDocId);
  console.log('');

  await seedGallery(categorySlugToDocId);
  console.log('');

  const productCategoryIdMap = await seedProductCategories();
  console.log('');

  const productIdMap = await seedProducts(productCategoryIdMap);
  console.log('');

  await seedReviews(productIdMap);
  console.log('');

  const posts = await loadJson<{ id: string; slug: string }[]>('posts.json');
  const postIdToSlug = new Map(posts.map((p) => [p.id, p.slug]));
  await seedComments(postIdToSlug);
  console.log('');

  await seedLegalPages();
  console.log('');

  const postsForFeatured = await loadJson<{ slug: string; featured: boolean }[]>('posts.json');
  const productsForFeatured = await loadJson<{ slug: string; featured: boolean }[]>('products.json');
  const videosForFeatured = await loadJson<{ title: string; featured: boolean }[]>('videos.json');
  const galleryForFeatured = await loadJson<{ id: string; featured: boolean }[]>('gallery.json');
  const testimonialsCount = (await loadJson<{ featured: boolean }[]>('testimonials.json')).filter(
    (t) => t.featured
  ).length;

  const slugFromName = (name: string) =>
    name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  await seedHomePage();

  console.log('\nStrapi dummy-data seed: done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
