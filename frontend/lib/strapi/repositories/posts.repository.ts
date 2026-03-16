/**
 * Posts, categories, tags, authors from Strapi. Use when isStrapiEnabled.
 */

import { getCollection, getCollectionWithMeta, getBySlug } from '@/lib/strapi/client';
import { mapStrapiPostToPost, mapStrapiCategory, mapStrapiTag, mapStrapiAuthor } from '@/lib/strapi/mappers';
import type { Post, PostCategory, Tag, Author, PaginationInfo } from '@/types';

const POPULATE = 'author,category,tags,coverImage,gallery';

export async function getAllPosts(): Promise<Post[]> {
  const list = await getCollection('posts', {
    populate: POPULATE,
    publicationState: 'live',
    sort: ['publishedAt:desc'],
  });
  return list.map((d) => mapStrapiPostToPost(d)).filter(Boolean) as Post[];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const doc = await getBySlug('posts', slug, POPULATE);
  return doc ? mapStrapiPostToPost(doc) : null;
}

export async function getPostsByCategory(categorySlug: string): Promise<Post[]> {
  const list = await getCollection('posts', { populate: POPULATE, publicationState: 'live', sort: ['publishedAt:desc'] });
  const posts = list.map((d) => mapStrapiPostToPost(d)).filter(Boolean) as Post[];
  return posts.filter((p) => p.category.slug === categorySlug);
}

export async function getPostsByTag(tagSlug: string): Promise<Post[]> {
  const list = await getCollection('posts', { populate: POPULATE, publicationState: 'live', sort: ['publishedAt:desc'] });
  const posts = list.map((d) => mapStrapiPostToPost(d)).filter(Boolean) as Post[];
  return posts.filter((p) => p.tags.some((t) => t.slug === tagSlug));
}

export async function getLatestPosts(limit: number, featuredOnly = false): Promise<Post[]> {
  const list = await getCollection('posts', {
    populate: POPULATE,
    publicationState: 'live',
    sort: ['publishedAt:desc'],
    pagination: { pageSize: featuredOnly ? 50 : limit },
  });
  let posts = list.map((d) => mapStrapiPostToPost(d)).filter(Boolean) as Post[];
  if (featuredOnly) posts = posts.filter((p) => p.featured);
  return posts.slice(0, limit);
}

export async function getFeaturedPosts(limit: number): Promise<Post[]> {
  return getLatestPosts(limit, true);
}

export async function getPaginatedPosts(
  page: number,
  limit: number,
  filters?: { category?: string; tag?: string }
): Promise<{ posts: Post[]; pagination: PaginationInfo }> {
  const strapiFilters: Record<string, unknown> = {};
  if (filters?.category) {
    strapiFilters.category = { slug: { $eq: filters.category } };
  }
  if (filters?.tag) {
    strapiFilters.tags = { slug: { $eq: filters.tag } };
  }

  const { data: list, meta } = await getCollectionWithMeta('posts', {
    populate: POPULATE.split(',').map((s) => s.trim()),
    publicationState: 'live',
    sort: ['publishedAt:desc'],
    pagination: { page, pageSize: limit },
    filters: Object.keys(strapiFilters).length > 0 ? strapiFilters : undefined,
  });

  const posts = list.map((d) => mapStrapiPostToPost(d)).filter(Boolean) as Post[];
  const totalItems = meta?.pagination?.total ?? posts.length;
  const totalPages = meta?.pagination?.pageCount ?? (Math.ceil(totalItems / limit) || 1);

  return {
    posts,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

export async function getCategoryBySlug(slug: string): Promise<PostCategory | null> {
  const list = await getCollection('categories');
  const doc = list.find((d) => (d.attributes as { slug?: string })?.slug === slug);
  return doc ? mapStrapiCategory(doc) : null;
}

export async function getTagBySlug(slug: string): Promise<Tag | null> {
  const list = await getCollection('tags');
  const doc = list.find((d) => (d.attributes as { slug?: string })?.slug === slug);
  return doc ? mapStrapiTag(doc) : null;
}

export async function getAllPostCategories(): Promise<PostCategory[]> {
  const list = await getCollection('categories');
  return list.map((d) => mapStrapiCategory(d)).filter(Boolean) as PostCategory[];
}

export async function getAllTags(): Promise<Tag[]> {
  const list = await getCollection('tags');
  return list.map((d) => mapStrapiTag(d)).filter(Boolean) as Tag[];
}

export async function getRelatedPosts(postId: string, limit: number = 3): Promise<Post[]> {
  const list = await getCollection('posts', { populate: POPULATE, publicationState: 'live', sort: ['publishedAt:desc'], pagination: { pageSize: 100 } });
  const posts = list.map((d) => mapStrapiPostToPost(d)).filter(Boolean) as Post[];
  const current = posts.find((p) => p.id === postId);
  if (!current) return [];
  const sameCategoryOrTag = posts.filter(
    (p) => p.id !== postId && (p.category.id === current.category.id || p.tags.some((t) => current.tags.some((pt) => pt.id === t.id)))
  );
  return sameCategoryOrTag.slice(0, limit);
}
