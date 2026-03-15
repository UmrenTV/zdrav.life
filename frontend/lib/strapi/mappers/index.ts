/**
 * Strapi response → ZdravLife domain type mappers.
 * Keeps raw Strapi shapes out of UI; use these in repositories only.
 */

import type {
  SiteConfig,
  MenuItem,
  Post,
  PostCategory,
  Tag,
  Author,
  SEOData,
  Product,
  ProductCategory,
  ProductDetail,
  ShippingInfo,
  VideoItem,
  GalleryItem,
  Review,
  Comment,
  FAQ,
  Testimonial,
} from '@/types';

// ---------------------------------------------------------------------------
// Helpers: extract Strapi doc (v5 may use documentId + attributes or flat)
// ---------------------------------------------------------------------------

export function strapiDoc<T = Record<string, unknown>>(raw: unknown): { documentId: string; attrs: T } | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const documentId = (o.documentId as string) ?? (o.id as string)?.toString();
  const attrs = (o.attributes as T) ?? (o as T);
  if (!documentId && !(attrs as Record<string, unknown>)?.slug) return null;
  return { documentId: documentId ?? '', attrs: attrs as T };
}

function strapiMediaUrl(media: unknown): string {
  if (!media || typeof media !== 'object') return '';
  const m = media as Record<string, unknown>;
  const url = m.url as string | undefined;
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const base = process.env.STRAPI_URL ?? process.env.NEXT_PUBLIC_STRAPI_URL ?? '';
  return base ? `${base.replace(/\/$/, '')}${url.startsWith('/') ? url : `/${url}`}` : url;
}

function strapiSeo(seo: unknown): SEOData {
  if (!seo || typeof seo !== 'object') {
    return { title: '', description: '', keywords: [] };
  }
  const s = seo as Record<string, unknown>;
  const keywords = s.keywords;
  return {
    title: (s.metaTitle as string) ?? (s.title as string) ?? '',
    description: (s.metaDescription as string) ?? (s.description as string) ?? '',
    keywords: Array.isArray(keywords) ? keywords : typeof keywords === 'string' ? (keywords ? keywords.split(',').map((k: string) => k.trim()) : []) : [],
    ogImage: (s.ogImage as string) ?? undefined,
    canonicalUrl: (s.canonicalUrl as string) ?? undefined,
    noIndex: (s.noindex as boolean) ?? undefined,
  };
}

// ---------------------------------------------------------------------------
// Site & Home
// ---------------------------------------------------------------------------

export function mapStrapiSiteSettings(raw: unknown): SiteConfig | null {
  const doc = strapiDoc<Record<string, unknown>>(raw);
  if (!doc) return null;
  const a = doc.attrs;
  const linkMap: SiteConfig['links'] = {
    youtube: (a.youtubeUrl as string) ?? '',
    instagram: (a.instagramUrl as string) ?? '',
    twitter: (a.twitterUrl as string) ?? '',
    github: (a.githubUrl as string) ?? '',
  };
  const links = (a.socialLinks as Record<string, string>[] | undefined);
  if (Array.isArray(links)) {
    links.forEach((l) => {
      if (l?.platform && l?.href) (linkMap as Record<string, string>)[l.platform] = l.href;
    });
  }
  const defaultSeo = (a.defaultSeo as Record<string, unknown>) ?? {};
  const siteUrl = (a.siteUrl as string) ?? '';
  const kw = defaultSeo.keywords;
  const keywords: string[] = Array.isArray(kw)
    ? kw
    : typeof kw === 'string'
      ? (kw ? (kw as string).split(',').map((k: string) => k.trim()) : [])
      : [];
  return {
    name: (a.siteName as string) ?? '',
    tagline: (a.tagline as string) ?? '',
    logo: strapiMediaUrl(a.logo) ?? '',
    description: (defaultSeo.metaDescription as string) ?? (a.tagline as string) ?? '',
    url: siteUrl,
    ogImage: strapiMediaUrl(a.defaultOgImage) ?? (a.defaultOgImage as string) ?? '',
    maintenanceMode: (a.maintenanceMode as boolean) ?? false,
    links: linkMap,
    author: {
      name: '',
      email: (a.contactEmail as string) ?? '',
      bio: '',
      avatar: strapiMediaUrl(a.logo) ?? '',
    },
    seo: {
      titleTemplate: (a.siteName as string) ? `%s | ${a.siteName as string}` : '',
      defaultTitle: (defaultSeo.metaTitle as string) ?? '',
      defaultDescription: (defaultSeo.metaDescription as string) ?? '',
      twitterHandle: (defaultSeo.twitterHandle as string) ?? '',
      keywords,
    },
    newsletterHeading: (a.newsletterHeading as string) ?? '',
    newsletterText: (a.newsletterText as string) ?? '',
    footerText: (a.footerText as string) ?? '',
    menu: mapMenuItems(Array.isArray(a.menuItems) ? a.menuItems : (a.menuItems as { data?: unknown[] } | null)?.data ?? []),
    footerLegalLinks: mapFooterLegalLinks(a.footerLegalLinks),
    footerLinkGroups: mapFooterLinkGroups(a.footerLinkGroups),
    nameAccent: {
      useAccent: (a.useAccentColorForName as boolean) ?? true,
      position: ((a.nameAccentPosition as string) === 'first' ? 'first' : 'last') as 'first' | 'last',
      letterCount: Math.max(1, (a.nameAccentLetterCount as number) ?? 4),
    },
    features: {
      shop: (a.enableShop as boolean) ?? true,
      blog: (a.enableBlog as boolean) ?? true,
      gallery: (a.enableGallery as boolean) ?? true,
      videos: (a.enableVideos as boolean) ?? true,
    },
  };
}

function mapMenuItems(raw: unknown): MenuItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item): item is Record<string, unknown> => item != null && typeof item === 'object')
    .map((item) => {
      const attrs = (item.attributes as Record<string, unknown>) ?? item;
      return {
        name: (attrs.name as string) ?? (item.name as string) ?? '',
        href: (attrs.link as string) ?? (item.link as string) ?? '',
        icon: (attrs.icon as string) ?? (item.icon as string) ?? undefined,
        openInNewTab: (attrs.openInNewTab as boolean) ?? (item.openInNewTab as boolean) ?? false,
      };
    })
    .filter((item) => item.name && item.href);
}

function mapFooterLegalLinks(raw: unknown): { label: string; href: string }[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item): item is Record<string, unknown> => item != null && typeof item === 'object')
    .map((item) => ({
      label: (item.label as string) ?? '',
      href: (item.link as string) ?? '',
    }))
    .filter((item) => item.label && item.href);
}

function mapFooterLinkGroups(raw: unknown): SiteConfig['footerLinkGroups'] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((g): g is Record<string, unknown> => g != null && typeof g === 'object')
    .map((g) => {
      const attrs = (g.attributes as Record<string, unknown>) ?? g;
      const title = (attrs.title as string) ?? '';
      const linksRaw = attrs.links;
      const links = Array.isArray(linksRaw)
        ? (linksRaw as Record<string, unknown>[])
            .filter((l): l is Record<string, unknown> => l != null && typeof l === 'object')
            .map((l) => {
              const la = (l.attributes as Record<string, unknown>) ?? l;
              return { label: (la.label as string) ?? '', href: (la.link as string) ?? '' };
            })
            .filter((l) => l.label && l.href)
        : [];
      return { title, links };
    })
    .filter((g) => g.title);
}

export function mapStrapiHomePage(raw: unknown): {
  hero?: { heading?: string; subheading?: string; eyebrow?: string };
  featuredPostIds?: string[];
  featuredProductIds?: string[];
  featuredVideoIds?: string[];
  featuredGalleryIds?: string[];
  featuredTestimonialIds?: string[];
} | null {
  const doc = strapiDoc<Record<string, unknown>>(raw);
  if (!doc) return null;
  const a = doc.attrs;
  const hero = a.hero as Record<string, unknown> | undefined;
  const connectIds = (rel: unknown): string[] => {
    if (Array.isArray(rel)) return rel.map((r) => (typeof r === 'object' && r && 'documentId' in r ? (r as { documentId: string }).documentId : String(r)));
    if (rel && typeof rel === 'object' && 'data' in rel) {
      const data = (rel as { data: unknown[] }).data;
      return Array.isArray(data) ? data.map((d: unknown) => (d as { documentId?: string }).documentId ?? (d as { id?: number }).id?.toString() ?? '') : [];
    }
    return [];
  };
  return {
    hero: hero ? { heading: hero.heading as string, subheading: hero.subheading as string, eyebrow: hero.eyebrow as string } : undefined,
    featuredPostIds: connectIds(a.featuredPosts),
    featuredProductIds: connectIds(a.featuredProducts),
    featuredVideoIds: connectIds(a.featuredVideos),
    featuredGalleryIds: connectIds(a.featuredGalleryItems),
    featuredTestimonialIds: connectIds(a.featuredTestimonials),
  };
}

// ---------------------------------------------------------------------------
// Author, Category, Tag (shared by blog/media)
// ---------------------------------------------------------------------------

export function mapStrapiAuthor(raw: unknown): Author | null {
  const doc = strapiDoc<Record<string, unknown>>(raw);
  if (!doc) return null;
  const a = doc.attrs;
  const socialLinks = ((a.socialLinks as Record<string, unknown>[]) ?? []).map((s) => ({
    platform: (s.platform as string) ?? 'instagram',
    url: (s.href as string) ?? '',
    label: (s.label as string) ?? '',
  })) as { platform: 'youtube' | 'instagram' | 'twitter' | 'github'; url: string; label: string }[];
  return {
    id: doc.documentId,
    name: (a.name as string) ?? '',
    slug: (a.slug as string) ?? '',
    bio: (a.bio as string) ?? '',
    avatar: strapiMediaUrl(a.avatar) || '',
    socialLinks,
    postCount: 0,
  };
}

export function mapStrapiCategory(raw: unknown): PostCategory | null {
  const doc = strapiDoc<Record<string, unknown>>(raw);
  if (!doc) return null;
  const a = doc.attrs;
  return {
    id: doc.documentId,
    slug: (a.slug as string) ?? '',
    name: (a.name as string) ?? '',
    description: (a.description as string) ?? '',
    postCount: 0,
  };
}

export function mapStrapiTag(raw: unknown): Tag | null {
  const doc = strapiDoc<Record<string, unknown>>(raw);
  if (!doc) return null;
  const a = doc.attrs;
  return {
    id: doc.documentId,
    slug: (a.slug as string) ?? '',
    name: (a.name as string) ?? '',
    postCount: 0,
  };
}

// ---------------------------------------------------------------------------
// Post
// ---------------------------------------------------------------------------

export function mapStrapiPostToPost(raw: unknown): Post | null {
  const doc = strapiDoc<Record<string, unknown>>(raw);
  if (!doc) return null;
  const a = doc.attrs;
  const author = a.author ? mapStrapiAuthor(a.author) : null;
  const category = a.category ? mapStrapiCategory(a.category) : null;
  const tags = Array.isArray(a.tags) ? (a.tags as unknown[]).map(mapStrapiTag).filter(Boolean) as Tag[] : [];
  const publishedAt = (a.publishedAt as string) ?? (a.publishedAt as string) ?? '';
  return {
    id: doc.documentId,
    slug: (a.slug as string) ?? '',
    title: (a.title as string) ?? '',
    subtitle: (a.subtitle as string) ?? undefined,
    excerpt: (a.excerpt as string) ?? '',
    content: (a.content as string) ?? '',
    coverImage: strapiMediaUrl(a.coverImage) || (a.coverImage as string) || '',
    gallery: Array.isArray(a.gallery) ? (a.gallery as unknown[]).map((g) => strapiMediaUrl(g) || String(g)) : [],
    author: author ?? { id: '', name: '', slug: '', bio: '', avatar: '', socialLinks: [], postCount: 0 },
    category: category ?? { id: '', slug: '', name: '', description: '', postCount: 0 },
    tags,
    seo: strapiSeo(a.seo),
    featured: (a.featured as boolean) ?? false,
    publishedAt,
    updatedAt: (a.updatedAt as string) ?? publishedAt,
    readingTime: (a.readingTime as number) ?? 0,
    relatedPostIds: [],
    commentCount: 0,
    viewCount: 0,
    status: (a.publishedAt ? 'published' : 'draft') as 'published' | 'draft',
  };
}

// ---------------------------------------------------------------------------
// Product
// ---------------------------------------------------------------------------

export function mapStrapiProductCategory(raw: unknown): ProductCategory | null {
  const doc = strapiDoc<Record<string, unknown>>(raw);
  if (!doc) return null;
  const a = doc.attrs;
  return {
    id: doc.documentId,
    slug: (a.slug as string) ?? '',
    name: (a.name as string) ?? '',
    description: (a.description as string) ?? '',
    image: strapiMediaUrl(a.image) || (a.image as string) || undefined,
    productCount: 0,
  };
}

export function mapStrapiProductToProduct(raw: unknown): Product | null {
  const doc = strapiDoc<Record<string, unknown>>(raw);
  if (!doc) return null;
  const a = doc.attrs;
  const category = a.category ? mapStrapiProductCategory(a.category) : null;
  const specs = (a.specs as Array<{ label?: string; value?: string }>) ?? [];
  const details: ProductDetail[] = specs.map((s) => ({ label: s.label ?? '', value: s.value ?? '' }));
  const shippingInfo = (a.shippingInfo as Record<string, unknown>) ?? {};
  const gallery = (a.gallery as unknown[]) ?? [];
  const images = gallery.map((g, i) => ({
    id: `img-${i}`,
    url: strapiMediaUrl(g) || String(g),
    alt: '',
    isPrimary: i === 0,
  }));
  if (images.length === 0 && a.featuredImage) {
    images.push({ id: 'img-0', url: strapiMediaUrl(a.featuredImage) || '', alt: '', isPrimary: true });
  }
  return {
    id: doc.documentId,
    slug: (a.slug as string) ?? '',
    title: (a.title as string) ?? '',
    subtitle: (a.subtitle as string) ?? undefined,
    description: (a.description as string) ?? '',
    shortDescription: (a.shortDescription as string) ?? '',
    images,
    category: category ?? { id: '', slug: '', name: '', description: '', productCount: 0 },
    tags: [],
    price: Number(a.price) ?? 0,
    compareAtPrice: a.compareAtPrice != null ? Number(a.compareAtPrice) : undefined,
    currency: (a.currency as string) ?? 'USD',
    ratingAverage: 0,
    reviewCount: 0,
    featured: (a.featured as boolean) ?? false,
    stockStatus: (a.stockStatus as Product['stockStatus']) ?? 'in_stock',
    sku: (a.sku as string) ?? '',
    seo: strapiSeo(a.seo),
    details,
    shippingInfo: {
      shippingTime: (shippingInfo.shippingTime as string) ?? '',
      returnsPolicy: (shippingInfo.returnsPolicy as string) ?? '',
      freeShippingThreshold: shippingInfo.freeShippingThreshold != null ? Number(shippingInfo.freeShippingThreshold) : undefined,
      weight: shippingInfo.weight as string | undefined,
      dimensions: shippingInfo.dimensions as string | undefined,
    },
    faqIds: [],
    relatedProductIds: [],
    createdAt: (a.createdAt as string) ?? '',
    updatedAt: (a.updatedAt as string) ?? '',
  };
}

// ---------------------------------------------------------------------------
// Video, Gallery, Review, Comment, FAQ, Testimonial
// ---------------------------------------------------------------------------

export function mapStrapiVideoToVideo(raw: unknown): VideoItem | null {
  const doc = strapiDoc<Record<string, unknown>>(raw);
  if (!doc) return null;
  const a = doc.attrs;
  const youtubeId = (a.youtubeVideoId as string) ?? '';
  return {
    id: doc.documentId,
    youtubeId,
    title: (a.title as string) ?? '',
    description: (a.excerpt as string) ?? '',
    thumbnail: strapiMediaUrl(a.thumbnail) || '',
    duration: (a.duration as string) ?? '',
    publishedAt: (a.publishedAt as string) ?? '',
    viewCount: '',
    category: (a.category as Record<string, string>)?.name ?? (a.category as string) ?? '',
    tags: Array.isArray(a.tags) ? (a.tags as { name?: string }[]).map((t) => t.name ?? String(t)) : [],
    featured: (a.featured as boolean) ?? false,
    relatedVideoIds: [],
  };
}

export function mapStrapiGalleryItemToGalleryItem(raw: unknown): GalleryItem | null {
  const doc = strapiDoc<Record<string, unknown>>(raw);
  if (!doc) return null;
  const a = doc.attrs;
  return {
    id: doc.documentId,
    image: strapiMediaUrl(a.image) || '',
    thumbnail: strapiMediaUrl(a.thumbnail) || strapiMediaUrl(a.image) || '',
    caption: (a.caption as string) ?? undefined,
    category: ((a.category as Record<string, string>)?.name ?? (a.category as string) ?? 'lifestyle') as GalleryItem['category'],
    tags: Array.isArray(a.tags) ? (a.tags as { name?: string }[]).map((t) => t.name ?? String(t)) : [],
    featured: (a.featured as boolean) ?? false,
  };
}

export function mapStrapiReviewToReview(raw: unknown): Review | null {
  const doc = strapiDoc<Record<string, unknown>>(raw);
  if (!doc) return null;
  const a = doc.attrs;
  const product = a.product as Record<string, string> | undefined;
  return {
    id: doc.documentId,
    productId: product?.documentId ?? product?.id ?? '',
    authorName: (a.authorName as string) ?? '',
    rating: Number(a.rating) ?? 0,
    title: (a.title as string) ?? '',
    content: (a.content as string) ?? '',
    createdAt: (a.createdAtOverride as string) ?? (a.createdAt as string) ?? '',
    verifiedPurchase: (a.verifiedPurchase as boolean) ?? false,
    helpfulCount: (a.helpfulCount as number) ?? 0,
  };
}

export function mapStrapiCommentToComment(raw: unknown): Comment | null {
  const doc = strapiDoc<Record<string, unknown>>(raw);
  if (!doc) return null;
  const a = doc.attrs;
  return {
    id: doc.documentId,
    entityType: (a.entityType as Comment['entityType']) ?? 'post',
    entityId: (a.entitySlug as string) ?? '',
    authorName: (a.authorName as string) ?? '',
    authorEmail: (a.authorEmail as string) ?? undefined,
    authorWebsite: (a.authorWebsite as string) ?? undefined,
    authorAvatar: strapiMediaUrl(a.avatar) || undefined,
    content: (a.content as string) ?? '',
    createdAt: (a.createdAtOverride as string) ?? (a.createdAt as string) ?? '',
    status: (a.commentStatus as Comment['status']) ?? 'pending',
    likes: (a.likes as number) ?? 0,
    replies: [],
    repliesCount: 0,
  };
}

export function mapStrapiFaqToFaq(raw: unknown): FAQ | null {
  const doc = strapiDoc<Record<string, unknown>>(raw);
  if (!doc) return null;
  const a = doc.attrs;
  return {
    id: doc.documentId,
    question: (a.question as string) ?? '',
    answer: (a.answer as string) ?? '',
    category: (a.category as string) ?? '',
    order: (a.order as number) ?? 0,
  };
}

export function mapStrapiTestimonialToTestimonial(raw: unknown): Testimonial | null {
  const doc = strapiDoc<Record<string, unknown>>(raw);
  if (!doc) return null;
  const a = doc.attrs;
  return {
    id: doc.documentId,
    authorName: (a.name as string) ?? '',
    authorTitle: (a.role as string) ?? undefined,
    authorAvatar: strapiMediaUrl(a.avatar) || undefined,
    content: (a.quote as string) ?? '',
    source: (a.source as Testimonial['source']) ?? 'community',
    featured: (a.featured as boolean) ?? false,
    createdAt: (a.createdAt as string) ?? '',
  };
}
