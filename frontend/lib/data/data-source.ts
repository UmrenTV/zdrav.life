/**
 * Single data source: when Strapi is enabled, use Strapi repositories; otherwise use JSON services.
 * Pages and API routes should use this layer so we can switch without touching UI.
 */

import type { Comment } from '@/types';
import { isStrapiEnabled } from '@/lib/strapi/client';
import * as services from '@/lib/data/services';
import * as strapi from '@/lib/strapi/repositories';

export async function getSiteConfig() {
  if (isStrapiEnabled) {
    const settings = await strapi.getSiteSettings();
    if (settings) return settings;
  }
  return services.getSiteConfig();
}

export async function getHomePage() {
  if (isStrapiEnabled) return strapi.getHomePage();
  return null;
}

export async function getAboutPage() {
  if (isStrapiEnabled) return strapi.getAboutPage();
  return null;
}

export async function getFeaturedPosts(limit: number = 3) {
  if (isStrapiEnabled) return strapi.getFeaturedPosts(limit);
  return services.getFeaturedPosts(limit);
}

export async function getFeaturedProducts(limit: number = 4) {
  if (isStrapiEnabled) return strapi.getFeaturedProducts(limit);
  return services.getFeaturedProducts(limit);
}

export async function getFeaturedVideos(limit: number = 3) {
  if (isStrapiEnabled) return strapi.getFeaturedVideos(limit);
  return services.getFeaturedVideos(limit);
}

export async function getLatestVideosDs(limit: number = 5, featuredOnly = false) {
  if (isStrapiEnabled) return strapi.getLatestVideos(limit, featuredOnly);
  const videos = await services.getLatestVideos(limit * 2);
  return featuredOnly ? videos.filter((v) => v.featured).slice(0, limit) : videos.slice(0, limit);
}

export async function getFeaturedGalleryItems(limit: number = 8) {
  if (isStrapiEnabled) return strapi.getFeaturedGalleryItems(limit);
  return services.getFeaturedGalleryItems(limit);
}

export async function getLatestGalleryItemsDs(limit: number = 8, featuredOnly = false) {
  if (isStrapiEnabled) return strapi.getLatestGalleryItems(limit, featuredOnly);
  const items = await services.getFeaturedGalleryItems(limit * 2);
  return featuredOnly ? items.filter((i) => i.featured).slice(0, limit) : items.slice(0, limit);
}

export async function getFeaturedTestimonials(limit: number = 4) {
  if (isStrapiEnabled) return strapi.getFeaturedTestimonials(limit);
  return services.getFeaturedTestimonials(limit);
}

export async function getLatestTestimonialsDs(limit: number = 4, featuredOnly = false) {
  if (isStrapiEnabled) return strapi.getLatestTestimonials(limit, featuredOnly);
  const items = await services.getAllTestimonials();
  return featuredOnly ? items.filter((t) => t.featured).slice(0, limit) : items.slice(0, limit);
}

export async function getLatestProductsDs(limit: number = 4, featuredOnly = false) {
  if (isStrapiEnabled) return strapi.getLatestProducts(limit, featuredOnly);
  const products = await services.getAllProducts();
  return featuredOnly ? products.filter((p) => p.featured).slice(0, limit) : products.slice(0, limit);
}

// Blog (Phase 7): delegate to Strapi when enabled
export async function getAllPosts() {
  if (isStrapiEnabled) return strapi.getAllPosts();
  return services.getAllPosts();
}
export async function getPostBySlug(slug: string) {
  if (isStrapiEnabled) return strapi.getPostBySlug(slug);
  return services.getPostBySlug(slug);
}
export async function getPostsByCategory(categorySlug: string) {
  if (isStrapiEnabled) return strapi.getPostsByCategory(categorySlug);
  return services.getPostsByCategory(categorySlug);
}
export async function getPostsByTag(tagSlug: string) {
  if (isStrapiEnabled) return strapi.getPostsByTag(tagSlug);
  return services.getPostsByTag(tagSlug);
}
export async function getPaginatedPosts(page: number, limit: number, filters?: { category?: string; tag?: string }) {
  if (isStrapiEnabled) return strapi.getPaginatedPosts(page, limit, filters);
  return services.getPaginatedPosts(page, limit, filters);
}
export async function getRelatedPosts(postId: string, limit: number) {
  if (isStrapiEnabled) return strapi.getRelatedPosts(postId, limit);
  return services.getRelatedPosts(postId, limit);
}
export async function getAllPostCategories() {
  if (isStrapiEnabled) return strapi.getAllPostCategories();
  return services.getAllPostCategories();
}
export async function getAllTags() {
  if (isStrapiEnabled) return strapi.getAllTags();
  return services.getAllTags();
}
export async function getCategoryBySlug(slug: string) {
  if (isStrapiEnabled) return strapi.getCategoryBySlug(slug);
  return services.getCategoryBySlug(slug);
}
export async function getTagBySlug(slug: string) {
  if (isStrapiEnabled) return strapi.getTagBySlug(slug);
  return services.getTagBySlug(slug);
}
export async function getLatestPosts(limit: number, featuredOnly = false) {
  if (isStrapiEnabled) return strapi.getLatestPosts(limit, featuredOnly);
  const posts = await services.getLatestPosts(limit * 2);
  return featuredOnly ? posts.filter((p) => p.featured).slice(0, limit) : posts.slice(0, limit);
}

// Media (Phase 8): delegate to Strapi when enabled
export async function getAllVideos() {
  if (isStrapiEnabled) return strapi.getAllVideos();
  return services.getAllVideos();
}
export async function getAllGalleryItems() {
  if (isStrapiEnabled) return strapi.getAllGalleryItems();
  return services.getAllGalleryItems();
}
export async function getAllFAQs() {
  if (isStrapiEnabled) return strapi.getAllFAQs();
  return services.getAllFAQs();
}
export async function getAllTestimonials() {
  if (isStrapiEnabled) return strapi.getAllTestimonials();
  return services.getAllTestimonials();
}
export async function getVideoBySlug(slug: string) {
  if (isStrapiEnabled) return strapi.getVideoBySlug(slug);
  const videos = await services.getAllVideos();
  return videos.find((v) => v.id === slug || (v as { slug?: string }).slug === slug) ?? null;
}
export async function getGalleryItemBySlug(slug: string) {
  if (isStrapiEnabled) return strapi.getGalleryItemBySlug(slug);
  const items = await services.getAllGalleryItems();
  return items.find((i) => i.id === slug || (i as { slug?: string }).slug === slug) ?? null;
}
export const getVideoById = services.getVideoById;
export const getLatestVideos = services.getLatestVideos;
export const getVideosByCategory = services.getVideosByCategory;
export const getGalleryByCategory = services.getGalleryByCategory;
export const getFAQsByCategory = services.getFAQsByCategory;

// Commerce (Phase 9): delegate to Strapi when enabled
export async function getAllProductCategories() {
  if (isStrapiEnabled) return strapi.getAllProductCategories();
  return services.getAllProductCategories();
}
export async function getAllProducts() {
  if (isStrapiEnabled) return strapi.getAllProducts();
  return services.getAllProducts();
}
export async function getProductBySlug(slug: string) {
  if (isStrapiEnabled) return strapi.getProductBySlug(slug);
  return services.getProductBySlug(slug);
}
export async function getProductsByCategory(categorySlug: string) {
  if (isStrapiEnabled) return strapi.getProductsByCategory(categorySlug);
  return services.getProductsByCategory(categorySlug);
}
export async function getPaginatedProducts(page: number, limit: number, filters?: Parameters<typeof services.getPaginatedProducts>[2]) {
  if (isStrapiEnabled) return strapi.getPaginatedProducts(page, limit, filters);
  return services.getPaginatedProducts(page, limit, filters);
}
export async function getRelatedProducts(productId: string, limit: number) {
  if (isStrapiEnabled) return strapi.getRelatedProducts(productId, limit);
  return services.getRelatedProducts(productId, limit);
}
export async function getReviewsByProduct(productId: string) {
  if (isStrapiEnabled) return strapi.getReviewsByProduct(productId);
  return services.getReviewsByProduct(productId);
}
export async function getReviewSummary(productId: string) {
  if (isStrapiEnabled) return strapi.getReviewSummary(productId);
  return services.getReviewSummary(productId);
}

// Comments (Phase 10): delegate to Strapi when enabled
export async function getCommentsByEntity(entityType: string, entityId: string) {
  if (isStrapiEnabled) return strapi.getCommentsByEntity(entityType, entityId);
  return services.getCommentsByEntity(entityType, entityId);
}

export type CreateCommentParams = {
  authorName: string;
  authorEmail?: string;
  authorWebsite?: string;
  content: string;
};

/**
 * Create a comment. When Strapi is enabled, persists to Strapi with status 'pending' and returns the created comment; otherwise returns null.
 */
export async function createComment(
  entityType: string,
  entityId: string,
  params: CreateCommentParams
): Promise<Comment | null> {
  if (isStrapiEnabled) {
    return strapi.createComment({
      entityType,
      entitySlug: entityId,
      authorName: params.authorName,
      authorEmail: params.authorEmail,
      authorWebsite: params.authorWebsite,
      content: params.content,
    });
  }
  return null;
}

export const getAllComments = services.getAllComments;

export const getAllReviews = services.getAllReviews;
export const searchContent = services.searchContent;
