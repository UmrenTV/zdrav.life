import { Metadata } from 'next';
import { getSiteConfig } from '@/lib/data/services';
import type { SEOData, BreadcrumbItem } from '@/types';

// ============================================
// Default SEO Configuration
// ============================================

const defaultSEO = {
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
};

// ============================================
// Metadata Generators
// ============================================

interface GenerateMetadataParams {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  canonicalUrl?: string;
  noIndex?: boolean;
  breadcrumbs?: BreadcrumbItem[];
}

export function generateMetadata({
  title,
  description,
  keywords = [],
  ogImage,
  ogType = 'website',
  canonicalUrl,
  noIndex = false,
}: GenerateMetadataParams = {}): Metadata {
  const metaTitle = title ? `${title} | ZdravLife` : defaultSEO.title;
  const metaDescription = description || defaultSEO.description;
  const metaKeywords = [...defaultSEO.keywords, ...keywords];
  const metaOgImage = ogImage || defaultSEO.ogImage;
  const metaCanonical = canonicalUrl
    ? `${defaultSEO.siteUrl}${canonicalUrl}`
    : undefined;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords,
    authors: [{ name: 'Zdrav' }],
    creator: 'Zdrav',
    publisher: 'ZdravLife',
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    alternates: {
      canonical: metaCanonical,
    },
    openGraph: {
      type: ogType,
      locale: 'en_US',
      url: metaCanonical || defaultSEO.siteUrl,
      siteName: 'ZdravLife',
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
      site: defaultSEO.twitterHandle,
      creator: defaultSEO.twitterHandle,
      title: metaTitle,
      description: metaDescription,
      images: [metaOgImage],
    },
    verification: {
      google: 'YOUR_GOOGLE_VERIFICATION_CODE', // Replace with actual code
    },
    other: {
      'pinterest-rich-pin': 'true',
    },
  };
}

// ============================================
// Structured Data Generators
// ============================================

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ZdravLife',
    url: defaultSEO.siteUrl,
    logo: `${defaultSEO.siteUrl}/images/logo.png`,
    sameAs: [
      'https://youtube.com/@zdravlife',
      'https://instagram.com/zdravlife',
      'https://twitter.com/zdravlife',
      'https://github.com/zdravlife',
    ],
    description: defaultSEO.description,
  };
}

export function generatePersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Zdrav',
    url: defaultSEO.siteUrl,
    image: `${defaultSEO.siteUrl}/images/author-avatar.jpg`,
    sameAs: [
      'https://youtube.com/@zdravlife',
      'https://instagram.com/zdravlife',
      'https://twitter.com/zdravlife',
      'https://github.com/zdravlife',
    ],
    jobTitle: 'Software Engineer & Creator',
    description:
      'Software engineer, problem solver, and vitality architect. Building systems for strength, discipline, and freedom.',
  };
}

export function generateArticleSchema(post: {
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  publishedAt: string;
  updatedAt: string;
  author: { name: string; avatar: string };
  category: { name: string };
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: `${defaultSEO.siteUrl}${post.coverImage}`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
      image: `${defaultSEO.siteUrl}${post.author.avatar}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'ZdravLife',
      logo: {
        '@type': 'ImageObject',
        url: `${defaultSEO.siteUrl}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${defaultSEO.siteUrl}/blog/${post.slug}`,
    },
    articleSection: post.category.name,
  };
}

export function generateProductSchema(product: {
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
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.shortDescription,
    image: product.images.map((img) => `${defaultSEO.siteUrl}${img.url}`),
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: 'ZdravLife',
    },
    category: product.category.name,
    offers: {
      '@type': 'Offer',
      url: `${defaultSEO.siteUrl}/shop/${product.slug}`,
      priceCurrency: product.currency,
      price: product.price.toString(),
      availability:
        product.stockStatus === 'in_stock'
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

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href.startsWith('http')
        ? item.href
        : `${defaultSEO.siteUrl}${item.href}`,
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

export function generateVideoSchema(video: {
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  duration: string;
  youtubeId: string;
}) {
  // Parse duration (e.g., "18:42" to ISO 8601 duration)
  const [minutes, seconds] = video.duration.split(':').map(Number);
  const isoDuration = `PT${minutes}M${seconds}S`;

  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description: video.description,
    thumbnailUrl: `${defaultSEO.siteUrl}${video.thumbnail}`,
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
    { url: '/adventures', changeFrequency: 'weekly', priority: 0.8 },
    { url: '/training', changeFrequency: 'weekly', priority: 0.8 },
    { url: '/nutrition', changeFrequency: 'weekly', priority: 0.8 },
    { url: '/philosophy', changeFrequency: 'weekly', priority: 0.8 },
    { url: '/faq', changeFrequency: 'monthly', priority: 0.6 },
    { url: '/contact', changeFrequency: 'monthly', priority: 0.6 },
    { url: '/privacy-policy', changeFrequency: 'yearly', priority: 0.3 },
    { url: '/terms', changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Add dynamic entries for posts
  const { getAllPosts } = await import('@/lib/data/services');
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
  const { getAllProducts } = await import('@/lib/data/services');
  const products = await getAllProducts();
  products.forEach((product) => {
    entries.push({
      url: `/shop/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  });

  return entries;
}
