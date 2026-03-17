// ============================================
// ZDRAVLIFE - TypeScript Type Definitions
// ============================================

// ============================================
// Core Site Configuration
// ============================================

export interface SiteConfig {
  name: string;
  tagline: string;
  /** Logo image URL for header/footer (from Strapi logo media). When set, use instead of site name text. */
  logo: string;
  description: string;
  url: string;
  ogImage: string;
  maintenanceMode: boolean;
  links: {
    youtube: string;
    instagram: string;
    twitter: string;
    github: string;
    discord?: string;
  };
  author: {
    name: string;
    email: string;
    bio: string;
    avatar: string;
  };
  seo: {
    titleTemplate: string;
    defaultTitle: string;
    defaultDescription: string;
    twitterHandle: string;
    keywords: string[];
  };
  /** Form data for the footer newsletter (relation to Forms collection). */
  footerForm: FormData | null;
  footerText: string;
  /** Navigation items for header, hamburger, and footer. From Strapi menuItems. */
  menu: MenuItem[];
  /** Legal links in footer (e.g. Privacy Policy, Terms). From Strapi footerLegalLinks. */
  footerLegalLinks: { label: string; href: string }[];
  /** Footer link columns (e.g. Content, Training, Shop, Support). From Strapi footerLinkGroups. */
  footerLinkGroups: { title: string; links: { label: string; href: string }[] }[];
  /** Style site name with accent color: which part and how many letters (e.g. last 4 = "Life" blue). */
  nameAccent: {
    useAccent: boolean;
    position: 'first' | 'last';
    letterCount: number;
  };
  /** Feature flags: when false, routes redirect to home and sections are hidden. */
  features: {
    shop: boolean;
    blog: boolean;
    gallery: boolean;
    videos: boolean;
  };
}

export interface MenuItem {
  name: string;
  href: string;
  icon?: string;
  openInNewTab: boolean;
}

/** Configuration for a homepage "latest" section (videos, blog, shop, gallery, testimonials). */
export interface SectionConfig {
  enableSection?: boolean;
  heading?: string;
  subheading?: string;
  latestCount?: number;
  featuredOnly?: boolean;
  viewAllLabel?: string;
  viewAllHref?: string;
  viewAllIcon?: string;
}

/** Home page content from Strapi (single type). When null, sections use hardcoded defaults. */
export interface HomePageData {
  hero?: {
    pillText?: string;
    headingWhite?: string;
    headingAccent?: string;
    subheading?: string;
    buttons?: { label: string; href: string; icon?: string; iconPosition?: 'left' | 'right' }[];
    stats?: { value: string; label: string }[];
  };
  sectionFeaturedContent?: SectionConfig;
  pillars?: {
    heading?: string;
    subheading?: string;
    items?: { icon: string; title: string; description: string; href: string; colorKey: string }[];
  };
  aboutPreview?: {
    image?: string;
    imageAlt?: string;
    imageStats?: { value: string; label: string }[];
    eyebrow?: string;
    headingLine1?: string;
    headingAccent?: string;
    headingLine2?: string;
    description?: string;
    iconTexts?: { icon: string; text: string }[];
    buttonLabel?: string;
    buttonHref?: string;
    buttonIcon?: string;
  };
  sectionVideos?: SectionConfig;
  sectionGallery?: SectionConfig;
  sectionBlog?: SectionConfig;
  sectionShop?: SectionConfig;
  sectionTestimonials?: SectionConfig;
  topPromoted?: FeaturedContentItem;
  featuredContent?: FeaturedContentItem[];
  newsletter?: FormData;
  cta?: {
    heading?: string;
    subheading?: string;
    primaryButton?: { label: string; href: string; icon?: string };
    secondaryButton?: { label: string; href: string; icon?: string };
  };
}

/** Normalized item from the Featured Content dynamic zone. Can be a post, product, video, or gallery item. */
export interface FeaturedContentItem {
  type: 'article' | 'product' | 'video' | 'gallery';
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  image: string;
  category?: string;
  /** Link to the category listing page (e.g. /blog?category=training) */
  categoryHref?: string;
  tags?: string[];
  publishedAt?: string;
  /** Contextual info: reading time for articles, price for products, duration for videos, location for gallery */
  info?: string;
  href: string;
}

/** About page content from Strapi (single type). When null, page uses hardcoded defaults. */
export interface AboutPageData {
  hero?: {
    pillText?: string;
    headingLine1?: string;
    headingAccent?: string;
    subheading?: string;
  };
  main?: {
    image?: string;
    imageAlt?: string;
    headingIntro?: string;
    bodyIntro?: string;
    headingPhilosophy?: string;
    bodyPhilosophy1?: string;
    bodyPhilosophy2?: string;
    iconTexts?: { icon: string; text: string }[];
  };
  stats?: { value: string; label: string }[];
  valuesSection?: {
    heading?: string;
    subheading?: string;
  };
  values?: { icon: string; title: string; description: string }[];
  cta?: {
    heading?: string;
    subheading?: string;
    primaryLabel?: string;
    primaryHref?: string;
    primaryIcon?: string;
    secondaryLabel?: string;
    secondaryHref?: string;
    secondaryIcon?: string;
  };
}

/** Reusable form entity from Strapi "Form" collection type. Used for homepage newsletter and footer. */
export interface FormData {
  id: string;
  name: string;
  enabled: boolean;
  pillLabel?: string;
  pillIcon?: string;
  heading?: string;
  subheading?: string;
  benefits?: string[];
  namePlaceholder?: string;
  emailPlaceholder?: string;
  buttonLabel?: string;
  buttonIcon?: string;
  disclaimer?: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  description?: string;
  icon?: string;
  children?: NavigationItem[];
  featured?: {
    title: string;
    description: string;
    image: string;
    href: string;
  };
}

export interface SocialLink {
  platform: 'youtube' | 'instagram' | 'twitter' | 'github' | 'discord' | 'tiktok' | 'linkedin';
  url: string;
  label: string;
  followers?: string;
}

// ============================================
// Blog / Content System
// ============================================

export interface Post {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  content: string;
  coverImage: string;
  gallery?: string[];
  author: Author;
  category: PostCategory;
  tags: Tag[];
  seo: SEOData;
  featured: boolean;
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
  relatedPostIds: string[];
  commentCount: number;
  viewCount: number;
  status: 'published' | 'draft' | 'scheduled';
  tableOfContents?: TOCItem[];
}

export interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export interface PostCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  coverImage?: string;
  postCount: number;
  parentId?: string;
}

export interface Tag {
  id: string;
  slug: string;
  name: string;
  postCount: number;
}

export interface Author {
  id: string;
  name: string;
  slug: string;
  bio: string;
  avatar: string;
  socialLinks: SocialLink[];
  postCount: number;
}

// ============================================
// E-Commerce / Shop System
// ============================================

export interface Product {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  shortDescription: string;
  images: ProductImage[];
  category: ProductCategory;
  tags: string[];
  price: number;
  compareAtPrice?: number;
  currency: string;
  ratingAverage: number;
  reviewCount: number;
  featured: boolean;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock' | 'pre_order';
  stockQuantity?: number;
  sku: string;
  seo: SEOData;
  details: ProductDetail[];
  shippingInfo: ShippingInfo;
  faqIds: string[];
  relatedProductIds: string[];
  variants?: ProductVariant[];
  attributes?: ProductAttribute[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface ProductCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  image?: string;
  productCount: number;
  parentId?: string;
  children?: ProductCategory[];
}

export interface ProductVariant {
  id: string;
  title: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  stockQuantity?: number;
  options: Record<string, string>;
  image?: string;
}

export interface ProductAttribute {
  name: string;
  values: string[];
}

export interface ProductDetail {
  label: string;
  value: string;
}

export interface ShippingInfo {
  weight?: string;
  dimensions?: string;
  shippingTime: string;
  freeShippingThreshold?: number;
  returnsPolicy: string;
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  productIds: string[];
  featured: boolean;
  createdAt: string;
}

// ============================================
// Reviews & Comments System
// ============================================

export interface Review {
  id: string;
  productId: string;
  authorName: string;
  authorEmail?: string;
  authorAvatar?: string;
  rating: number;
  title: string;
  content: string;
  createdAt: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  images?: string[];
  response?: {
    content: string;
    respondedAt: string;
    respondedBy: string;
  };
}

export interface ReviewSummary {
  productId: string;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<1 | 2 | 3 | 4 | 5, number>;
}

export interface Comment {
  id: string;
  entityType: 'post' | 'video' | 'adventure' | 'gallery' | 'product';
  entityId: string;
  parentId?: string;
  authorName: string;
  authorEmail?: string;
  authorWebsite?: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  status: 'approved' | 'pending' | 'spam';
  likes: number;
  likedByMe: boolean;
  replies: Comment[];
  repliesCount: number;
}

// ============================================
// Media System (YouTube, Instagram, Gallery)
// ============================================

export interface VideoItem {
  id: string;
  slug: string;
  youtubeId: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  publishedAt: string;
  viewCount: string;
  likeCount?: string;
  category: string;
  tags: string[];
  featured: boolean;
  relatedVideoIds: string[];
}

export interface GalleryItem {
  id: string;
  image: string;
  thumbnail: string;
  caption?: string;
  category: 'travel' | 'training' | 'food' | 'nature' | 'bike' | 'lifestyle' | 'behind-scenes';
  location?: string;
  takenAt?: string;
  tags: string[];
  featured: boolean;
  instagramUrl?: string;
  takenByLabel?: string;
  takenByHref?: string;
  takenByNewTab?: boolean;
  relatedToLabel?: string;
  relatedToHref?: string;
  relatedToNewTab?: boolean;
}

export interface InstagramPost {
  id: string;
  permalink: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  mediaUrl: string;
  thumbnailUrl?: string;
  caption: string;
  timestamp: string;
  likeCount?: number;
  commentsCount?: number;
}

// ============================================
// Adventure / Journey System
// ============================================

export interface Adventure {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  description: string;
  coverImage: string;
  gallery: string[];
  route?: RouteInfo;
  startDate: string;
  endDate?: string;
  duration: string;
  distance?: string;
  location: string;
  country: string;
  tags: string[];
  gear: GearItem[];
  highlights: string[];
  publishedAt: string;
  status: 'planned' | 'in_progress' | 'completed' | 'published';
  relatedPostIds: string[];
  videoIds: string[];
}

export interface RouteInfo {
  startPoint: string;
  endPoint: string;
  waypoints?: string[];
  mapImage?: string;
  gpxUrl?: string;
}

export interface GearItem {
  name: string;
  category: string;
  description?: string;
  link?: string;
}

// ============================================
// Content Pillars (Training, Nutrition, Philosophy)
// ============================================

export interface TrainingProtocol {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: 'calisthenics' | 'hypertrophy' | 'strength' | 'mobility' | 'cardio';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  frequency: string;
  equipment: string[];
  coverImage: string;
  exercises: Exercise[];
  publishedAt: string;
  featured: boolean;
}

export interface Exercise {
  name: string;
  sets: string;
  reps: string;
  rest: string;
  notes?: string;
  videoUrl?: string;
}

export interface NutritionGuide {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: 'fasting' | 'meal-plan' | 'supplements' | 'recipes' | 'philosophy';
  coverImage: string;
  content: string;
  macros?: MacroInfo;
  publishedAt: string;
  featured: boolean;
}

export interface MacroInfo {
  protein: string;
  carbs: string;
  fats: string;
  calories: string;
}

export interface PhilosophyEntry {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'discipline' | 'mindset' | 'systems' | 'identity' | 'struggle' | 'freedom';
  coverImage?: string;
  publishedAt: string;
  featured: boolean;
  readingTime: number;
}

// ============================================
// FAQ & Testimonials
// ============================================

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export interface Testimonial {
  id: string;
  authorName: string;
  authorTitle?: string;
  authorAvatar?: string;
  content: string;
  rating?: number;
  source: 'product' | 'community' | 'coaching';
  featured: boolean;
  createdAt: string;
}

// ============================================
// Newsletter & Forms
// ============================================

export interface NewsletterSubscriber {
  email: string;
  name?: string;
  interests: string[];
  subscribedAt: string;
  status: 'active' | 'unsubscribed' | 'bounced';
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// ============================================
// SEO & Metadata
// ============================================

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product' | 'video.other';
  canonicalUrl?: string;
  noIndex?: boolean;
  structuredData?: Record<string, unknown>;
}

export interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrent?: boolean;
}

// ============================================
// Search & Discovery
// ============================================

export interface SearchResult {
  id: string;
  type: 'post' | 'product' | 'video' | 'adventure';
  title: string;
  excerpt: string;
  image?: string;
  href: string;
  category?: string;
  publishedAt?: string;
  price?: number;
}

export interface SearchFilters {
  type?: ('post' | 'product' | 'video' | 'adventure')[];
  category?: string;
  dateRange?: 'day' | 'week' | 'month' | 'year' | 'all';
  sortBy?: 'relevance' | 'date' | 'popularity';
}

// ============================================
// Cart & Commerce (Future Implementation)
// ============================================

export interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  title: string;
  image: string;
  sku: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  itemCount: number;
}

// ============================================
// UI / Component Types
// ============================================

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface FilterState {
  categories: string[];
  tags: string[];
  priceRange: { min: number; max: number };
  sortBy: string;
  searchQuery: string;
}

export type Theme = 'light' | 'dark' | 'system';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}
