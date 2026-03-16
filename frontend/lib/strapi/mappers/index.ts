/**
 * Strapi response → ZdravLife domain type mappers.
 * Keeps raw Strapi shapes out of UI; use these in repositories only.
 */

import type {
  SiteConfig,
  SectionConfig,
  MenuItem,
  HomePageData,
  AboutPageData,
  FormData,
  FeaturedContentItem,
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
    footerForm: a.footerForm ? mapStrapiForm(a.footerForm) : null,
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

function compAttrs(c: unknown): Record<string, unknown> {
  if (!c || typeof c !== 'object') return {};
  const o = c as Record<string, unknown>;
  return (o.attributes as Record<string, unknown>) ?? o;
}

function richtextToPlain(blocks: unknown): string {
  if (typeof blocks === 'string') return blocks;
  if (!Array.isArray(blocks)) return '';
  return blocks
    .map((b) => {
      const block = b as Record<string, unknown>;
      const children = block.children as unknown[];
      if (Array.isArray(children)) return children.map((c) => ((c as Record<string, unknown>).text as string) ?? '').join('');
      return (block.text as string) ?? '';
    })
    .join('\n');
}

function compList(raw: unknown): Record<string, unknown>[] {
  if (!Array.isArray(raw)) return [];
  const withData = raw && typeof raw === 'object' && 'data' in (raw as object) ? (raw as unknown as { data: unknown[] }).data : raw;
  if (!Array.isArray(withData)) return [];
  return withData.map((item) => compAttrs(item));
}

function mapDynamicZoneItem(entry: Record<string, unknown>): FeaturedContentItem | null {
  const component = entry.__component as string | undefined;
  if (!component) return null;

  const resolveRelation = (rel: unknown): Record<string, unknown> | null => {
    if (!rel || typeof rel !== 'object') return null;
    const r = rel as Record<string, unknown>;
    return (r.attributes as Record<string, unknown>) ?? r;
  };

  if (component === 'home.featured-post') {
    const a = resolveRelation(entry.post);
    if (!a) return null;
    const docId = (entry.post as Record<string, unknown>)?.documentId as string ?? '';
    const catSlug = (a.category as Record<string, unknown>)?.slug as string | undefined;
    return {
      type: 'article',
      id: docId,
      slug: (a.slug as string) ?? '',
      title: (a.title as string) ?? '',
      subtitle: (a.excerpt as string) ?? undefined,
      image: strapiMediaUrl(a.coverImage) || '',
      category: (a.category as Record<string, unknown>)?.name as string ?? undefined,
      categoryHref: catSlug ? `/blog?category=${catSlug}` : undefined,
      tags: Array.isArray(a.tags) ? (a.tags as { name?: string }[]).map((t) => t.name ?? '') : undefined,
      publishedAt: (a.publishedAt as string) ?? undefined,
      info: a.readingTime ? `${a.readingTime} min read` : undefined,
      href: `/blog/${(a.slug as string) ?? ''}`,
    };
  }

  if (component === 'home.featured-product') {
    const a = resolveRelation(entry.product);
    if (!a) return null;
    const docId = (entry.product as Record<string, unknown>)?.documentId as string ?? '';
    const price = a.price != null ? Number(a.price) : null;
    const currency = (a.currency as string) ?? 'USD';
    const catSlug = (a.category as Record<string, unknown>)?.slug as string | undefined;
    return {
      type: 'product',
      id: docId,
      slug: (a.slug as string) ?? '',
      title: (a.title as string) ?? '',
      subtitle: (a.shortDescription as string) ?? (a.subtitle as string) ?? undefined,
      image: strapiMediaUrl(a.featuredImage) || strapiMediaUrl(Array.isArray(a.gallery) ? a.gallery[0] : null) || '',
      category: (a.category as Record<string, unknown>)?.name as string ?? undefined,
      categoryHref: catSlug ? `/shop?category=${catSlug}` : undefined,
      tags: Array.isArray(a.tags) ? (a.tags as { name?: string }[]).map((t) => t.name ?? '') : undefined,
      publishedAt: (a.publishedAt as string) ?? undefined,
      info: price != null ? `${currency} ${price.toFixed(2)}` : undefined,
      href: `/shop/${(a.slug as string) ?? ''}`,
    };
  }

  if (component === 'home.featured-video') {
    const a = resolveRelation(entry.video);
    if (!a) return null;
    const docId = (entry.video as Record<string, unknown>)?.documentId as string ?? '';
    const catName = (a.category as Record<string, unknown>)?.name as string ?? (a.category as string) ?? '';
    return {
      type: 'video',
      id: docId,
      slug: (a.slug as string) ?? '',
      title: (a.title as string) ?? '',
      subtitle: (a.excerpt as string) ?? undefined,
      image: strapiMediaUrl(a.thumbnail) || '',
      category: catName || undefined,
      categoryHref: catName ? `/videos?category=${encodeURIComponent(catName)}` : undefined,
      tags: Array.isArray(a.tags) ? (a.tags as { name?: string }[]).map((t) => t.name ?? '') : undefined,
      publishedAt: (a.publishedAt as string) ?? undefined,
      info: (a.duration as string) ? `${a.duration as string} min long` : undefined,
      href: `/videos/${(a.slug as string) ?? ''}`,
    };
  }

  if (component === 'home.featured-gallery-item') {
    const a = resolveRelation(entry.galleryItem);
    if (!a) return null;
    const docId = (entry.galleryItem as Record<string, unknown>)?.documentId as string ?? '';
    const catName = (a.category as Record<string, unknown>)?.name as string ?? (a.category as string) ?? '';
    return {
      type: 'gallery',
      id: docId,
      slug: (a.slug as string) ?? '',
      title: (a.title as string) ?? (a.caption as string) ?? '',
      subtitle: (a.caption as string) ?? undefined,
      image: strapiMediaUrl(a.image) || strapiMediaUrl(a.thumbnail) || '',
      category: catName || undefined,
      categoryHref: catName ? `/gallery?category=${encodeURIComponent(catName)}` : undefined,
      tags: Array.isArray(a.tags) ? (a.tags as { name?: string }[]).map((t) => t.name ?? '') : undefined,
      publishedAt: (a.publishedAt as string) ?? undefined,
      info: (a.location as string) ?? undefined,
      href: `/gallery/${(a.slug as string) ?? ''}`,
    };
  }

  return null;
}

function mapDynamicZone(raw: unknown): FeaturedContentItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((entry) => mapDynamicZoneItem(entry as Record<string, unknown>))
    .filter((item): item is FeaturedContentItem => item !== null);
}

export function mapStrapiForm(raw: unknown): FormData | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const a = (o.attributes as Record<string, unknown>) ?? o;
  const id = (o.documentId as string) ?? (o.id as string)?.toString() ?? '';
  if (!id && !a.name) return null;
  const benefitsList = compList(a.benefits).map((b) => (b.text as string) ?? '');
  return {
    id,
    name: (a.name as string) ?? '',
    enabled: (a.enabled as boolean) ?? true,
    pillLabel: a.pillLabel as string | undefined,
    pillIcon: a.pillIcon as string | undefined,
    heading: a.heading as string | undefined,
    subheading: a.subheading as string | undefined,
    benefits: benefitsList.length ? benefitsList : undefined,
    namePlaceholder: a.namePlaceholder as string | undefined,
    emailPlaceholder: a.emailPlaceholder as string | undefined,
    buttonLabel: a.buttonLabel as string | undefined,
    buttonIcon: a.buttonIcon as string | undefined,
    disclaimer: a.disclaimer as string | undefined,
  };
}

export function mapStrapiHomePage(raw: unknown): HomePageData | null {
  const doc = strapiDoc<Record<string, unknown>>(raw);
  if (!doc) return null;
  const a = doc.attrs;

  const heroRaw = a.hero as Record<string, unknown> | undefined;
  const heroAttrs = heroRaw ? compAttrs(heroRaw) : {};
  const heroButtons = compList(heroAttrs.buttons).map((b) => ({
    label: (b.label as string) ?? '',
    href: (b.href as string) ?? '',
    icon: b.icon as string | undefined,
    iconPosition: (b.iconPosition === 'left' ? 'left' : 'right') as 'left' | 'right',
  }));
  const heroStats = compList(heroAttrs.stats).map((s) => ({
    value: (s.value as string) ?? '',
    label: (s.label as string) ?? '',
  }));

  const section = (key: string): SectionConfig | undefined => {
    const s = a[key] as Record<string, unknown> | undefined;
    const attrs = s ? compAttrs(s) : {};
    if (attrs.heading == null && attrs.enableSection == null) return undefined;
    return {
      enableSection: (attrs.enableSection as boolean) ?? true,
      heading: attrs.heading as string | undefined,
      subheading: attrs.subheading as string | undefined,
      latestCount: (attrs.latestCount as number) ?? undefined,
      featuredOnly: (attrs.featuredOnly as boolean) ?? undefined,
      viewAllLabel: attrs.viewAllLabel as string | undefined,
      viewAllHref: attrs.viewAllHref as string | undefined,
      viewAllIcon: attrs.viewAllIcon as string | undefined,
    };
  };

  const pillarsRaw = a.pillars as Record<string, unknown> | undefined;
  const pillarsAttrs = pillarsRaw ? compAttrs(pillarsRaw) : {};
  const pillarItems = compList(pillarsAttrs.items).map((p) => ({
    icon: (p.icon as string) ?? '',
    title: (p.title as string) ?? '',
    description: (p.description as string) ?? '',
    href: (p.href as string) ?? '',
    colorKey: (p.colorKey as string) ?? 'primary',
  }));

  const aboutRaw = a.aboutPreview as Record<string, unknown> | undefined;
  const aboutAttrs = aboutRaw ? compAttrs(aboutRaw) : {};
  const aboutImageStats = compList(aboutAttrs.imageStats).map((s) => ({
    value: (s.value as string) ?? '',
    label: (s.label as string) ?? '',
  }));
  const aboutIconTexts = compList(aboutAttrs.iconTexts).map((t) => ({
    icon: (t.icon as string) ?? '',
    text: (t.text as string) ?? '',
  }));

  const newsletterForm = a.newsletter ? mapStrapiForm(a.newsletter) : null;

  const ctaRaw = a.cta as Record<string, unknown> | undefined;
  const ctaAttrs = ctaRaw ? compAttrs(ctaRaw) : {};
  const ctaPrimary = compAttrs(ctaAttrs.primaryButton);
  const ctaSecondary = compAttrs(ctaAttrs.secondaryButton);

  return {
    hero: heroAttrs && (heroAttrs.pillText != null || heroAttrs.headingWhite != null || heroAttrs.headingAccent != null)
      ? {
          pillText: heroAttrs.pillText as string | undefined,
          headingWhite: heroAttrs.headingWhite as string | undefined,
          headingAccent: heroAttrs.headingAccent as string | undefined,
          subheading: heroAttrs.subheading as string | undefined,
          buttons: heroButtons.length ? heroButtons : undefined,
          stats: heroStats.length ? heroStats : undefined,
        }
      : undefined,
    sectionFeaturedContent: section('sectionFeaturedContent'),
    topPromoted: mapDynamicZone(a.topPromoted)[0] ?? undefined,
    featuredContent: (() => { const items = mapDynamicZone(a.featuredContent); return items.length ? items : undefined; })(),
    pillars:
      pillarsAttrs.heading != null || (pillarItems.length > 0)
        ? { heading: pillarsAttrs.heading as string, subheading: pillarsAttrs.subheading as string, items: pillarItems.length ? pillarItems : undefined }
        : undefined,
    aboutPreview:
      aboutAttrs.headingLine1 != null || aboutAttrs.eyebrow != null
        ? {
            image: aboutAttrs.image ? strapiMediaUrl(aboutAttrs.image) : undefined,
            imageAlt: aboutAttrs.imageAlt as string | undefined,
            imageStats: aboutImageStats.length ? aboutImageStats : undefined,
            eyebrow: aboutAttrs.eyebrow as string | undefined,
            headingLine1: aboutAttrs.headingLine1 as string | undefined,
            headingAccent: aboutAttrs.headingAccent as string | undefined,
            headingLine2: aboutAttrs.headingLine2 as string | undefined,
            description:
              typeof aboutAttrs.description === 'string'
                ? aboutAttrs.description
                : (richtextToPlain(aboutAttrs.description) || undefined),
            iconTexts: aboutIconTexts.length ? aboutIconTexts : undefined,
            buttonLabel: aboutAttrs.buttonLabel as string | undefined,
            buttonHref: aboutAttrs.buttonHref as string | undefined,
            buttonIcon: aboutAttrs.buttonIcon as string | undefined,
          }
        : undefined,
    sectionVideos: section('sectionVideos'),
    sectionGallery: section('sectionGallery'),
    sectionBlog: section('sectionBlog'),
    sectionShop: section('sectionShop'),
    sectionTestimonials: section('sectionTestimonials'),
    newsletter: newsletterForm ?? undefined,
    cta:
      ctaAttrs.heading != null
        ? {
            heading: ctaAttrs.heading as string,
            subheading: ctaAttrs.subheading as string | undefined,
            primaryButton: ctaPrimary?.label
              ? { label: ctaPrimary.label as string, href: (ctaPrimary.href as string) ?? '', icon: ctaPrimary.icon as string | undefined }
              : undefined,
            secondaryButton: ctaSecondary?.label
              ? { label: ctaSecondary.label as string, href: (ctaSecondary.href as string) ?? '', icon: ctaSecondary.icon as string | undefined }
              : undefined,
          }
        : undefined,
  };
}

// ---------------------------------------------------------------------------
// About page
// ---------------------------------------------------------------------------

export function mapStrapiAboutPage(raw: unknown): AboutPageData | null {
  const doc = strapiDoc<Record<string, unknown>>(raw);
  if (!doc) return null;
  const a = doc.attrs;

  const heroRaw = a.hero as Record<string, unknown> | undefined;
  const heroAttrs = heroRaw ? compAttrs(heroRaw) : {};

  const mainRaw = a.main as Record<string, unknown> | undefined;
  const mainAttrs = mainRaw ? compAttrs(mainRaw) : {};
  const mainIconTexts = compList(mainAttrs.iconTexts).map((t) => ({
    icon: (t.icon as string) ?? '',
    text: (t.text as string) ?? '',
  }));

  const statsItems = compList(a.stats).map((s) => ({
    value: (s.value as string) ?? '',
    label: (s.label as string) ?? '',
  }));

  const valuesSectionRaw = a.valuesSection as Record<string, unknown> | undefined;
  const valuesSectionAttrs = valuesSectionRaw ? compAttrs(valuesSectionRaw) : {};

  const valuesItems = compList(a.values).map((v) => ({
    icon: (v.icon as string) ?? '',
    title: (v.title as string) ?? '',
    description: (v.description as string) ?? '',
  }));

  const ctaRaw = a.cta as Record<string, unknown> | undefined;
  const ctaAttrs = ctaRaw ? compAttrs(ctaRaw) : {};

  return {
    hero:
      heroAttrs.pillText != null || heroAttrs.headingLine1 != null || heroAttrs.headingAccent != null
        ? {
            pillText: heroAttrs.pillText as string | undefined,
            headingLine1: heroAttrs.headingLine1 as string | undefined,
            headingAccent: heroAttrs.headingAccent as string | undefined,
            subheading: heroAttrs.subheading as string | undefined,
          }
        : undefined,
    main:
      mainAttrs.headingIntro != null || mainAttrs.image != null
        ? {
            image: mainAttrs.image ? strapiMediaUrl(mainAttrs.image) : undefined,
            imageAlt: mainAttrs.imageAlt as string | undefined,
            headingIntro: mainAttrs.headingIntro as string | undefined,
            bodyIntro: mainAttrs.bodyIntro as string | undefined,
            headingPhilosophy: mainAttrs.headingPhilosophy as string | undefined,
            bodyPhilosophy1: mainAttrs.bodyPhilosophy1 as string | undefined,
            bodyPhilosophy2: mainAttrs.bodyPhilosophy2 as string | undefined,
            iconTexts: mainIconTexts.length ? mainIconTexts : undefined,
          }
        : undefined,
    stats: statsItems.length ? statsItems : undefined,
    valuesSection:
      valuesSectionAttrs.heading != null
        ? {
            heading: valuesSectionAttrs.heading as string | undefined,
            subheading: valuesSectionAttrs.subheading as string | undefined,
          }
        : undefined,
    values: valuesItems.length ? valuesItems : undefined,
    cta:
      ctaAttrs.heading != null
        ? {
            heading: ctaAttrs.heading as string | undefined,
            subheading: ctaAttrs.subheading as string | undefined,
            primaryLabel: ctaAttrs.primaryLabel as string | undefined,
            primaryHref: ctaAttrs.primaryHref as string | undefined,
            primaryIcon: ctaAttrs.primaryIcon as string | undefined,
            secondaryLabel: ctaAttrs.secondaryLabel as string | undefined,
            secondaryHref: ctaAttrs.secondaryHref as string | undefined,
            secondaryIcon: ctaAttrs.secondaryIcon as string | undefined,
          }
        : undefined,
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
    slug: (a.slug as string) ?? doc.documentId,
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
    location: (a.location as string) ?? undefined,
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
    likedByMe: false,
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
