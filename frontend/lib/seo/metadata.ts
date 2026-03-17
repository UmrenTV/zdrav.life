import { Metadata } from 'next';
import type { SEOData, BreadcrumbItem, SiteConfig } from '@/types';

// ============================================
// Fallback SEO (only when config / setting is missing)
// ============================================

const fallbackSEO = {
  title: 'ZdravLife - Engineer Your Vitality',
  description:
    'Build strength. Master discipline. Ride further. Live deeper. A software engineer\'s journey into high-performance living at the intersection of calisthenics, motorcycle travel, and mindful optimization.',
  keywords: [
    'calisthenics',
    'hypertrophy',
    'fasting',
    'nutrition',
    'longevity',
    'motorcycle travel',
    'personal development',
    'discipline',
    'lifestyle systems',
    'high-performance living',
    'software engineer fitness',
    'adventure blog',
    'health optimization',
  ],
  ogImage: '/images/og-default.jpg',
  twitterHandle: '@zdravlife',
  siteUrl: 'https://zdrav.life',
  siteName: 'ZdravLife',
  authorName: 'Zdrav',
};

// ============================================
// Metadata Generators
// ============================================

interface GenerateMetadataParams {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product' | 'video.other';
  canonicalUrl?: string;
  /** SEO pagination: rel="prev" (full URL) */
  prevUrl?: string;
  /** SEO pagination: rel="next" (full URL) */
  nextUrl?: string;
  noIndex?: boolean;
  breadcrumbs?: BreadcrumbItem[];
}

export function generateMetadata(
  {
    title,
    description,
    keywords = [],
    ogImage,
    ogType = 'website',
    canonicalUrl,
    prevUrl,
    nextUrl,
    noIndex = false,
  }: GenerateMetadataParams = {},
  config?: SiteConfig | null
): Metadata {
  const siteName = config?.name || fallbackSEO.siteName;
  const baseTitle = config?.seo?.defaultTitle || fallbackSEO.title;
  const baseDescription = config?.seo?.defaultDescription || fallbackSEO.description;
  const baseKeywords = (config?.seo?.keywords?.length ? config.seo.keywords : fallbackSEO.keywords);
  const baseOgImage = config?.ogImage || fallbackSEO.ogImage;
  const baseUrl = config?.url || fallbackSEO.siteUrl;
  const twitterHandle = config?.seo?.twitterHandle || fallbackSEO.twitterHandle;
  const authorName = config?.author?.name || fallbackSEO.authorName;

  const titleSuffix = siteName ? ` | ${siteName}` : '';
  const metaTitle = title ? `${title}${titleSuffix}` : baseTitle;
  const metaDescription = description || baseDescription;
  const metaKeywords = [...baseKeywords, ...keywords];
  const metaOgImage = ogImage || baseOgImage;
  const metaCanonical = canonicalUrl ? `${baseUrl.replace(/\/$/, '')}${canonicalUrl.startsWith('/') ? canonicalUrl : `/${canonicalUrl}`}` : undefined;

  const ogTypeForMetadata: 'website' | 'article' =
    ogType === 'article' ? 'article' : 'website';

  const alternates: { canonical?: string; prev?: string; next?: string } = {
    canonical: metaCanonical,
  };
  if (prevUrl) alternates.prev = prevUrl;
  if (nextUrl) alternates.next = nextUrl;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords,
    authors: [{ name: authorName }],
    creator: authorName,
    publisher: siteName,
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    alternates,
    openGraph: {
      type: ogTypeForMetadata,
      locale: 'en_US',
      url: metaCanonical || baseUrl,
      siteName,
      title: metaTitle,
      description: metaDescription,
      images: [
        {
          url: metaOgImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: twitterHandle,
      creator: twitterHandle,
      title: metaTitle,
      description: metaDescription,
      images: [metaOgImage],
    },
    verification: {
      google: 'YOUR_GOOGLE_VERIFICATION_CODE',
    },
    other: {
      'pinterest-rich-pin': 'true',
    },
  };
}

/** Paths only (no origin). Use canonicalPath for generateMetadata canonicalUrl; prepend siteUrl for prevUrl/nextUrl. */
export function buildListingPaginationUrls(
  pathname: string,
  page: number,
  totalPages: number,
  queryParams: Record<string, string | undefined>
): { canonicalPath: string; prevPath?: string; nextPath?: string } {
  const q = new URLSearchParams();
  Object.entries(queryParams).forEach(([key, value]) => {
    if (value) q.set(key, value);
  });
  const queryString = q.toString();
  const basePath = pathname + (queryString ? `?${queryString}` : '');
  const sep = basePath.includes('?') ? '&' : '?';

  const canonicalPath = page <= 1 ? basePath : `${basePath}${sep}page=${page}`;
  const prevPath = page > 1 ? (page === 2 ? basePath : `${basePath}${sep}page=${page - 1}`) : undefined;
  const nextPath = page < totalPages ? `${basePath}${sep}page=${page + 1}` : undefined;

  return { canonicalPath, prevPath, nextPath };
}

/** Use config?.url when available; otherwise fallback. Prefer passing config from getSiteConfig(). */
export const siteUrl = fallbackSEO.siteUrl;

// ============================================
// Structured Data Generators
// ============================================

export function generateOrganizationSchema(config?: SiteConfig | null) {
  const baseUrl = config?.url || fallbackSEO.siteUrl;
  const name = config?.name || fallbackSEO.siteName;
  const description = config?.seo?.defaultDescription || fallbackSEO.description;
  const sameAs = [
    config?.links?.youtube,
    config?.links?.instagram,
    config?.links?.twitter,
    config?.links?.github,
  ].filter(Boolean) as string[];
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: name || 'ZdravLife',
    url: baseUrl,
    logo: `${baseUrl}/images/logo.png`,
    sameAs: sameAs.length ? sameAs : ['https://youtube.com/@zdravlife', 'https://instagram.com/zdravlife', 'https://twitter.com/zdravlife', 'https://github.com/zdravlife'],
    description: description || fallbackSEO.description,
  };
}

export function generatePersonSchema(config?: SiteConfig | null) {
  const baseUrl = config?.url || fallbackSEO.siteUrl;
  const name = config?.author?.name || fallbackSEO.authorName;
  const image = config?.author?.avatar ? (config.author.avatar.startsWith('http') ? config.author.avatar : `${baseUrl}${config.author.avatar.startsWith('/') ? '' : '/'}${config.author.avatar}`) : `${baseUrl}/images/author-avatar.jpg`;
  const sameAs = [
    config?.links?.youtube,
    config?.links?.instagram,
    config?.links?.twitter,
    config?.links?.github,
  ].filter(Boolean) as string[];
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: name || 'Zdrav',
    url: baseUrl,
    image,
    sameAs: sameAs.length ? sameAs : ['https://youtube.com/@zdravlife', 'https://instagram.com/zdravlife', 'https://twitter.com/zdravlife', 'https://github.com/zdravlife'],
    jobTitle: 'Software Engineer & Creator',
    description: config?.author?.bio || 'Software engineer, problem solver, and vitality architect. Building systems for strength, discipline, and freedom.',
  };
}

export function generateArticleSchema(
  post: {
    title: string;
    slug: string;
    excerpt: string;
    coverImage: string;
    publishedAt: string;
    updatedAt: string;
    author: { name: string; avatar: string };
    category: { name: string };
  },
  config?: SiteConfig | null
) {
  const baseUrl = config?.url || fallbackSEO.siteUrl;
  const siteName = config?.name || fallbackSEO.siteName;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: `${baseUrl}${post.coverImage.startsWith('/') ? '' : '/'}${post.coverImage}`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
      image: `${baseUrl}${post.author.avatar.startsWith('/') ? '' : '/'}${post.author.avatar}`,
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${post.slug}`,
    },
    articleSection: post.category.name,
  };
}

export function generateProductSchema(
  product: {
    title: string;
    slug: string;
    shortDescription: string;
    images: { url: string }[];
    price: number;
    currency: string;
    ratingAverage: number;
    reviewCount: number;
    sku: string;
    category: { name: string };
    stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock' | 'pre_order';
  },
  config?: SiteConfig | null
) {
  const baseUrl = config?.url || fallbackSEO.siteUrl;
  const siteName = config?.name || fallbackSEO.siteName;
  const inStock = product.stockStatus === 'in_stock';
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.shortDescription,
    image: product.images.map((img) => `${baseUrl}${img.url.startsWith('/') ? '' : '/'}${img.url}`),
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: siteName || 'ZdravLife',
    },
    category: product.category.name,
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/shop/${product.slug}`,
      priceCurrency: product.currency,
      price: product.price.toString(),
      availability:
        inStock
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
    },
    aggregateRating:
      product.reviewCount > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: product.ratingAverage.toString(),
            reviewCount: product.reviewCount.toString(),
          }
        : undefined,
  };
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[], config?: SiteConfig | null) {
  const baseUrl = config?.url || fallbackSEO.siteUrl;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href.startsWith('http')
        ? item.href
        : `${baseUrl}${item.href.startsWith('/') ? '' : '/'}${item.href}`,
    })),
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateVideoSchema(
  video: {
    title: string;
    description: string;
    thumbnail: string;
    publishedAt: string;
    duration: string;
    youtubeId: string;
  },
  config?: SiteConfig | null
) {
  const baseUrl = config?.url || fallbackSEO.siteUrl;
  const [minutes, seconds] = video.duration.split(':').map(Number);
  const isoDuration = `PT${minutes}M${seconds}S`;

  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description: video.description,
    thumbnailUrl: `${baseUrl}${video.thumbnail.startsWith('/') ? '' : '/'}${video.thumbnail}`,
    uploadDate: video.publishedAt,
    duration: isoDuration,
    embedUrl: `https://www.youtube.com/embed/${video.youtubeId}`,
    contentUrl: `https://www.youtube.com/watch?v=${video.youtubeId}`,
  };
}

// ============================================
// Sitemap Helpers
// ============================================

export interface SitemapEntry {
  url: string;
  lastModified?: string;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export async function generateSitemapEntries(): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = [
    { url: '/', changeFrequency: 'daily', priority: 1.0 },
    { url: '/about', changeFrequency: 'monthly', priority: 0.8 },
    { url: '/blog', changeFrequency: 'daily', priority: 0.9 },
    { url: '/shop', changeFrequency: 'daily', priority: 0.9 },
    { url: '/videos', changeFrequency: 'weekly', priority: 0.8 },
    { url: '/gallery', changeFrequency: 'weekly', priority: 0.7 },
    { url: '/media', changeFrequency: 'weekly', priority: 0.8 },
    { url: '/adventures', changeFrequency: 'weekly', priority: 0.8 },
    { url: '/training', changeFrequency: 'weekly', priority: 0.8 },
    { url: '/nutrition', changeFrequency: 'weekly', priority: 0.8 },
    { url: '/philosophy', changeFrequency: 'weekly', priority: 0.8 },
    { url: '/lifestyle', changeFrequency: 'weekly', priority: 0.7 },
    { url: '/journal', changeFrequency: 'weekly', priority: 0.8 },
    { url: '/search', changeFrequency: 'daily', priority: 0.5 },
    { url: '/faq', changeFrequency: 'monthly', priority: 0.6 },
    { url: '/contact', changeFrequency: 'monthly', priority: 0.6 },
    { url: '/privacy-policy', changeFrequency: 'yearly', priority: 0.3 },
    { url: '/terms', changeFrequency: 'yearly', priority: 0.3 },
    { url: '/shipping-returns', changeFrequency: 'yearly', priority: 0.4 },
  ];

  // Add dynamic entries for posts
  const { getAllPosts } = await import('@/lib/data/data-source');
  const posts = await getAllPosts();
  posts.forEach((post) => {
    entries.push({
      url: `/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  });

  // Add dynamic entries for products
  const { getAllProducts } = await import('@/lib/data/data-source');
  const products = await getAllProducts();
  products.forEach((product) => {
    entries.push({
      url: `/shop/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  });

  // Add dynamic entries for post categories
  const { getAllPostCategories } = await import('@/lib/data/data-source');
  const categories = await getAllPostCategories();
  categories.forEach((cat) => {
    entries.push({
      url: `/categories/${cat.slug}`,
      changeFrequency: 'weekly',
      priority: 0.6,
    });
  });

  // Add dynamic entries for tags
  const { getAllTags } = await import('@/lib/data/data-source');
  const tags = await getAllTags();
  tags.forEach((tag) => {
    entries.push({
      url: `/tags/${tag.slug}`,
      changeFrequency: 'weekly',
      priority: 0.5,
    });
  });

  // Add dynamic entries for videos
  const { getAllVideos } = await import('@/lib/data/data-source');
  const videos = await getAllVideos();
  videos.forEach((video) => {
    if (!video.slug) return;
    entries.push({
      url: `/videos/${video.slug}`,
      lastModified: video.publishedAt,
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  });

  // Add dynamic entries for gallery items
  const { getAllGalleryItems } = await import('@/lib/data/data-source');
  const galleryItems = await getAllGalleryItems();
  galleryItems.forEach((item) => {
    const slug = item.slug || item.id;
    entries.push({
      url: `/gallery/${slug}`,
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  });

  return entries;
}
