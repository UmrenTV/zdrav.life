// ============================================
// Data Access Layer
// Abstracts data access for easy future API swap
// ============================================

import { promises as fs } from 'fs';
import path from 'path';
import type {
  Post,
  Product,
  Review,
  Comment,
  VideoItem,
  GalleryItem,
  FAQ,
  Testimonial,
  PostCategory,
  ProductCategory,
  Tag,
  SearchResult,
  PaginationInfo,
  SiteConfig,
} from '@/types';

// ============================================
// Base Data Loading
// ============================================

const DATA_DIR = path.join(process.cwd(), 'data');

async function loadJsonFile<T>(filename: string): Promise<T> {
  const filePath = path.join(DATA_DIR, filename);
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data) as T;
}

// ============================================
// Posts Service
// ============================================

export async function getAllPosts(): Promise<Post[]> {
  return loadJsonFile<Post[]>('posts.json');
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getAllPosts();
  return posts.find((post) => post.slug === slug) || null;
}

export async function getPostsByCategory(categorySlug: string): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter((post) => post.category.slug === categorySlug && post.status === 'published');
}

export async function getPostsByTag(tagSlug: string): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter(
    (post) => post.tags.some((tag) => tag.slug === tagSlug) && post.status === 'published'
  );
}

export async function getFeaturedPosts(limit: number = 3): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter((post) => post.featured && post.status === 'published').slice(0, limit);
}

export async function getLatestPosts(limit: number = 6): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts
    .filter((post) => post.status === 'published')
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}

export async function getRelatedPosts(postId: string, limit: number = 3): Promise<Post[]> {
  const posts = await getAllPosts();
  const currentPost = posts.find((p) => p.id === postId);
  if (!currentPost) return [];

  return posts
    .filter(
      (post) =>
        post.id !== postId &&
        post.status === 'published' &&
        (currentPost.relatedPostIds.includes(post.id) ||
          post.category.id === currentPost.category.id ||
          post.tags.some((tag) => currentPost.tags.some((t) => t.id === tag.id)))
    )
    .slice(0, limit);
}

export async function getPaginatedPosts(
  page: number = 1,
  limit: number = 9,
  filters?: { category?: string; tag?: string }
): Promise<{ posts: Post[]; pagination: PaginationInfo }> {
  const posts = await getAllPosts();
  let filtered = posts.filter((post) => post.status === 'published');
  if (filters?.category) {
    filtered = filtered.filter((post) => post.category.slug === filters.category);
  }
  if (filters?.tag) {
    filtered = filtered.filter((post) =>
      post.tags.some((t) => t.slug === filters!.tag)
    );
  }

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / limit) || 1;
  const startIndex = (page - 1) * limit;
  const paginatedPosts = filtered.slice(startIndex, startIndex + limit);

  return {
    posts: paginatedPosts,
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

// ============================================
// Products Service
// ============================================

export async function getAllProducts(): Promise<Product[]> {
  return loadJsonFile<Product[]>('products.json');
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getAllProducts();
  return products.find((product) => product.slug === slug) || null;
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const products = await getAllProducts();
  return products.filter((product) => product.category.slug === categorySlug);
}

export async function getFeaturedProducts(limit: number = 4): Promise<Product[]> {
  const products = await getAllProducts();
  return products.filter((product) => product.featured).slice(0, limit);
}

export async function getRelatedProducts(productId: string, limit: number = 4): Promise<Product[]> {
  const products = await getAllProducts();
  const currentProduct = products.find((p) => p.id === productId);
  if (!currentProduct) return [];

  return products
    .filter(
      (product) =>
        product.id !== productId &&
        (currentProduct.relatedProductIds.includes(product.id) ||
          product.category.id === currentProduct.category.id)
    )
    .slice(0, limit);
}

export async function getPaginatedProducts(
  page: number = 1,
  limit: number = 12,
  filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'popular';
  }
): Promise<{ products: Product[]; pagination: PaginationInfo }> {
  let products = await getAllProducts();

  // Apply filters
  if (filters?.category) {
    products = products.filter((p) => p.category.slug === filters.category);
  }
  if (filters?.minPrice !== undefined) {
    products = products.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters?.maxPrice !== undefined) {
    products = products.filter((p) => p.price <= filters.maxPrice!);
  }

  // Apply sorting
  if (filters?.sortBy) {
    switch (filters.sortBy) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'popular':
        products.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }
  }

  const totalItems = products.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (page - 1) * limit;
  const paginatedProducts = products.slice(startIndex, startIndex + limit);

  return {
    products: paginatedProducts,
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

// ============================================
// Reviews Service
// ============================================

export async function getAllReviews(): Promise<Review[]> {
  return loadJsonFile<Review[]>('reviews.json');
}

export async function getReviewsByProduct(productId: string): Promise<Review[]> {
  const reviews = await getAllReviews();
  return reviews
    .filter((review) => review.productId === productId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getReviewSummary(productId: string): Promise<{
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<1 | 2 | 3 | 4 | 5, number>;
}> {
  const reviews = await getReviewsByProduct(productId);
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0;

  const distribution: Record<1 | 2 | 3 | 4 | 5, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach((review) => {
    distribution[review.rating as 1 | 2 | 3 | 4 | 5]++;
  });

  return {
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews,
    ratingDistribution: distribution,
  };
}

// ============================================
// Comments Service
// ============================================

export async function getAllComments(): Promise<Comment[]> {
  const raw = await loadJsonFile<Comment[]>('comments.json');
  return raw.map((c) => ({ ...c, likedByMe: c.likedByMe ?? false }));
}

export async function getCommentsByEntity(
  entityType: string,
  entityId: string
): Promise<Comment[]> {
  const comments = await getAllComments();
  return comments
    .filter((comment) => comment.entityType === entityType && comment.entityId === entityId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// ============================================
// Videos Service
// ============================================

export async function getAllVideos(): Promise<VideoItem[]> {
  const raw = await loadJsonFile<VideoItem[]>('videos.json');
  return raw.map((v) => ({ ...v, slug: v.slug ?? v.id }));
}

export async function getVideoById(id: string): Promise<VideoItem | null> {
  const videos = await getAllVideos();
  return videos.find((video) => video.id === id) || null;
}

export async function getFeaturedVideos(limit: number = 3): Promise<VideoItem[]> {
  const videos = await getAllVideos();
  return videos.filter((video) => video.featured).slice(0, limit);
}

export async function getLatestVideos(limit: number = 6): Promise<VideoItem[]> {
  const videos = await getAllVideos();
  return videos
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}

export async function getVideosByCategory(category: string): Promise<VideoItem[]> {
  const videos = await getAllVideos();
  return videos.filter((video) => video.category.toLowerCase() === category.toLowerCase());
}

// ============================================
// Gallery Service
// ============================================

export async function getAllGalleryItems(): Promise<GalleryItem[]> {
  return loadJsonFile<GalleryItem[]>('gallery.json');
}

export async function getGalleryByCategory(category: string): Promise<GalleryItem[]> {
  const items = await getAllGalleryItems();
  return items.filter((item) => item.category === category);
}

export async function getFeaturedGalleryItems(limit: number = 8): Promise<GalleryItem[]> {
  const items = await getAllGalleryItems();
  return items.filter((item) => item.featured).slice(0, limit);
}

// ============================================
// FAQ Service
// ============================================

export async function getAllFAQs(): Promise<FAQ[]> {
  return loadJsonFile<FAQ[]>('faqs.json');
}

export async function getFAQsByCategory(category: string): Promise<FAQ[]> {
  const faqs = await getAllFAQs();
  return faqs.filter((faq) => faq.category === category).sort((a, b) => a.order - b.order);
}

// ============================================
// Testimonials Service
// ============================================

export async function getAllTestimonials(): Promise<Testimonial[]> {
  return loadJsonFile<Testimonial[]>('testimonials.json');
}

export async function getFeaturedTestimonials(limit: number = 4): Promise<Testimonial[]> {
  const testimonials = await getAllTestimonials();
  return testimonials.filter((t) => t.featured).slice(0, limit);
}

// ============================================
// Categories & Tags Service
// ============================================

export async function getAllPostCategories(): Promise<PostCategory[]> {
  const posts = await getAllPosts();
  const categoriesMap = new Map<string, PostCategory>();

  posts.forEach((post) => {
    if (!categoriesMap.has(post.category.id)) {
      categoriesMap.set(post.category.id, post.category);
    }
  });

  return Array.from(categoriesMap.values());
}

export async function getAllProductCategories(): Promise<ProductCategory[]> {
  const products = await getAllProducts();
  const categoriesMap = new Map<string, ProductCategory>();

  products.forEach((product) => {
    if (!categoriesMap.has(product.category.id)) {
      categoriesMap.set(product.category.id, product.category);
    }
  });

  return Array.from(categoriesMap.values());
}

export async function getAllTags(): Promise<Tag[]> {
  const posts = await getAllPosts();
  const tagsMap = new Map<string, Tag>();

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      if (!tagsMap.has(tag.id)) {
        tagsMap.set(tag.id, tag);
      }
    });
  });

  return Array.from(tagsMap.values());
}

export async function getCategoryBySlug(slug: string): Promise<PostCategory | null> {
  const categories = await getAllPostCategories();
  return categories.find((c) => c.slug === slug) || null;
}

export async function getTagBySlug(slug: string): Promise<Tag | null> {
  const tags = await getAllTags();
  return tags.find((t) => t.slug === slug) || null;
}

// ============================================
// Search Service
// ============================================

export async function searchContent(query: string): Promise<SearchResult[]> {
  const [posts, products, videos] = await Promise.all([
    getAllPosts(),
    getAllProducts(),
    getAllVideos(),
  ]);

  const results: SearchResult[] = [];
  const lowerQuery = query.toLowerCase();

  // Search posts
  posts.forEach((post) => {
    if (
      post.title.toLowerCase().includes(lowerQuery) ||
      post.excerpt.toLowerCase().includes(lowerQuery) ||
      post.tags.some((tag) => tag.name.toLowerCase().includes(lowerQuery))
    ) {
      results.push({
        id: post.id,
        type: 'post',
        title: post.title,
        excerpt: post.excerpt,
        image: post.coverImage,
        href: `/blog/${post.slug}`,
        category: post.category.name,
        publishedAt: post.publishedAt,
      });
    }
  });

  // Search products
  products.forEach((product) => {
    if (
      product.title.toLowerCase().includes(lowerQuery) ||
      product.shortDescription.toLowerCase().includes(lowerQuery) ||
      product.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    ) {
      results.push({
        id: product.id,
        type: 'product',
        title: product.title,
        excerpt: product.shortDescription,
        image: product.images.find((img) => img.isPrimary)?.url || product.images[0]?.url,
        href: `/shop/${product.slug}`,
        category: product.category.name,
        price: product.price,
      });
    }
  });

  // Search videos
  videos.forEach((video) => {
    if (
      video.title.toLowerCase().includes(lowerQuery) ||
      video.description.toLowerCase().includes(lowerQuery) ||
      video.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    ) {
      results.push({
        id: video.id,
        type: 'video',
        title: video.title,
        excerpt: video.description,
        image: video.thumbnail,
        href: `/videos#${video.id}`,
        category: video.category,
        publishedAt: video.publishedAt,
      });
    }
  });

  return results;
}

// ============================================
// Site Config Service
// ============================================

const DEFAULT_FEATURES = { shop: true, blog: true, gallery: true, videos: true };

export async function getSiteConfig(): Promise<SiteConfig> {
  const raw = (await loadJsonFile('site-config.json')) as Record<string, unknown>;
  return {
    ...raw,
    maintenanceMode: raw.maintenanceMode ?? false,
    footerForm: null,
    menu: Array.isArray(raw.menu) ? raw.menu : [],
    footerLegalLinks: Array.isArray(raw.footerLegalLinks) ? raw.footerLegalLinks : [],
    footerLinkGroups: Array.isArray(raw.footerLinkGroups) ? raw.footerLinkGroups : [],
    nameAccent:
      raw.nameAccent && typeof raw.nameAccent === 'object' && raw.nameAccent !== null
        ? {
            useAccent: (raw.nameAccent as Record<string, unknown>).useAccent !== false,
            position: (raw.nameAccent as Record<string, unknown>).position === 'first' ? 'first' : 'last',
            letterCount: Math.max(1, Number((raw.nameAccent as Record<string, unknown>).letterCount) || 4),
          }
        : { useAccent: true, position: 'last' as const, letterCount: 4 },
    features: raw.features && typeof raw.features === 'object'
      ? { ...DEFAULT_FEATURES, ...(raw.features as object) }
      : DEFAULT_FEATURES,
  } as SiteConfig;
}
