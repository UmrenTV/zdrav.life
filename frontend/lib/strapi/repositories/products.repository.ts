/**
 * Products and product categories from Strapi. Use when isStrapiEnabled.
 */

import { getCollection, getCollectionWithMeta, getBySlug } from '@/lib/strapi/client';
import { mapStrapiProductToProduct, mapStrapiProductCategory } from '@/lib/strapi/mappers';
import type { Product, ProductCategory, PaginationInfo } from '@/types';

const POPULATE = ['category', 'featuredImage', 'gallery'];

export async function getAllProducts(): Promise<Product[]> {
  const list = await getCollection('products', { populate: POPULATE, publicationState: 'live' });
  return list.map((d) => mapStrapiProductToProduct(d)).filter(Boolean) as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const doc = await getBySlug('products', slug, POPULATE);
  return doc ? mapStrapiProductToProduct(doc) : null;
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const list = await getCollection('products', { populate: POPULATE, publicationState: 'live' });
  const products = list.map((d) => mapStrapiProductToProduct(d)).filter(Boolean) as Product[];
  return products.filter((p) => p.category.slug === categorySlug);
}

export async function getLatestProducts(limit: number, featuredOnly = false): Promise<Product[]> {
  const list = await getCollection('products', { populate: POPULATE, publicationState: 'live', sort: ['publishedAt:desc'] });
  let products = list.map((d) => mapStrapiProductToProduct(d)).filter(Boolean) as Product[];
  if (featuredOnly) products = products.filter((p) => p.featured);
  return products.slice(0, limit);
}

export async function getFeaturedProducts(limit: number): Promise<Product[]> {
  return getLatestProducts(limit, true);
}

function strapiSort(sortBy?: string): string[] | undefined {
  if (sortBy === 'price-asc') return ['price:asc'];
  if (sortBy === 'price-desc') return ['price:desc'];
  if (sortBy === 'newest') return ['publishedAt:desc'];
  return ['publishedAt:desc'];
}

export async function getPaginatedProducts(
  page: number,
  limit: number,
  filters?: { category?: string; sortBy?: string }
): Promise<{ products: Product[]; pagination: PaginationInfo }> {
  const strapiFilters: Record<string, unknown> = {};
  if (filters?.category) {
    strapiFilters.category = { slug: { $eq: filters.category } };
  }

  const { data: list, meta } = await getCollectionWithMeta('products', {
    populate: POPULATE,
    publicationState: 'live',
    sort: strapiSort(filters?.sortBy),
    pagination: { page, pageSize: limit },
    filters: Object.keys(strapiFilters).length > 0 ? strapiFilters : undefined,
  });

  let products = list.map((d) => mapStrapiProductToProduct(d)).filter(Boolean) as Product[];
  if (filters?.sortBy === 'popular') {
    products = products.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
  }

  const totalItems = meta?.pagination?.total ?? products.length;
  const totalPages = meta?.pagination?.pageCount ?? (Math.ceil(totalItems / limit) || 1);

  return {
    products,
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

export async function getAllProductCategories(): Promise<ProductCategory[]> {
  const list = await getCollection('product-categories', { populate: ['image'] });
  return list.map((d) => mapStrapiProductCategory(d)).filter(Boolean) as ProductCategory[];
}

export async function getRelatedProducts(productId: string, limit: number = 4): Promise<Product[]> {
  const list = await getCollection('products', { populate: POPULATE, publicationState: 'live' });
  const products = list.map((d) => mapStrapiProductToProduct(d)).filter(Boolean) as Product[];
  const current = products.find((p) => p.id === productId);
  if (!current) return [];
  const related = products.filter((p) => p.id !== productId && p.category.id === current.category.id);
  return related.slice(0, limit);
}
