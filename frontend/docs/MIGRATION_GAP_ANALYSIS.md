# ZdravLife → Strapi Migration — Phase 1 Gap Analysis

**Date:** 2025-03-13  
**Status:** Phase 1 complete — no code changes; inspection and analysis only.

---

## 1. Current frontend architecture summary

### Data layer
- **Location:** `lib/data/services.ts` — single module, JSON-backed.
- **Data directory:** `data/` with:
  - `site-config.json` — global site name, tagline, url, links, author, seo.
  - `posts.json` — blog posts (embedded author, category, tags, seo).
  - `products.json` — products (embedded category, images, details, variants, shippingInfo).
  - `reviews.json` — product reviews (productId, authorName, rating, content).
  - `comments.json` — comments (entityType, entityId, parentId, authorName, content, status).
  - `videos.json` — video items (youtubeId, category, tags).
  - `gallery.json` — gallery items (image, category, tags).
  - `faqs.json` — FAQs (question, answer, category, order).
  - `testimonials.json` — testimonials (authorName, content, featured).
  - `youtube.json` / `instagram.json` — external feed data (optional sync).
- **Domain types:** `types/index.ts` — Post, Product, Review, Comment, VideoItem, GalleryItem, FAQ, Testimonial, PostCategory, ProductCategory, Tag, Author, SEOData, SiteConfig, etc.
- **No repository/abstraction layer yet** — pages and API routes call `services.ts` directly.

### API routes (Next.js)
- `app/api/posts/route.ts`, `app/api/posts/[slug]/route.ts`
- `app/api/categories/route.ts`, `app/api/tags/route.ts`
- `app/api/products/route.ts`, `app/api/products/[slug]/route.ts`
- `app/api/media/route.ts`, `app/api/reviews/route.ts`, `app/api/comments/route.ts`
- `app/api/search/route.ts`

All currently read from `lib/data/services.ts` (JSON). No Strapi client yet.

### SEO & metadata
- **Location:** `lib/seo/metadata.ts`
- Uses `getSiteConfig()` and default SEO; `generateMetadata()`, schema helpers (Article, Product, FAQ, Video, Breadcrumb), `generateSitemapEntries()` which calls `getAllPosts()`, `getAllProducts()`, `getAllPostCategories()`, `getAllTags()`.

### Pages and routes (likely affected later)
| Route | Data dependencies |
|-------|-------------------|
| `/` (home) | getSiteConfig, getFeaturedPosts, getFeaturedProducts, getFeaturedVideos, getFeaturedGalleryItems, getFeaturedTestimonials, homepage content (likely from site-config or future home-page) |
| `/blog` | getPaginatedPosts, getAllPostCategories, getAllTags |
| `/blog/[slug]` | getPostBySlug, getRelatedPosts, getCommentsByEntity |
| `/categories/[slug]` | getPostsByCategory, getCategoryBySlug |
| `/tags/[slug]` | getPostsByTag, getTagBySlug |
| `/shop` | getPaginatedProducts, getAllProductCategories |
| `/shop/[slug]` | getProductBySlug, getRelatedProducts, getReviewsByProduct, getReviewSummary |
| `/videos` | getAllVideos, getFeaturedVideos |
| `/gallery` | getAllGalleryItems, getFeaturedGalleryItems |
| `/media` | videos + gallery |
| `/faq` | getAllFAQs, getFAQsByCategory |
| `/privacy-policy`, `/terms`, `/shipping-returns` | legal content (currently static or from JSON) |
| `/contact` | form only (no Strapi yet) |
| `/search` | searchContent (posts, products, videos) |

### Where mappers/adapters should live
- New folder: `lib/strapi/` or `lib/data/strapi/` with:
  - `client.ts` — getStrapi, postStrapi helpers.
  - `repositories/` — site.repository, posts.repository, products.repository, media.repository, comments.repository, reviews.repository.
  - `mappers/` or `adapters/` — mapStrapiSiteSettings, mapStrapiHomePage, mapStrapiPostToPost, mapStrapiProductToProduct, etc.
- Domain types in `types/index.ts` should remain the frontend contract; mappers convert Strapi → these types.

### JSON files to migrate (content)
- `site-config.json` → site-setting + home-page (and possibly global nav/footer).
- `posts.json` → author, category, tag, post (with relations).
- `products.json` → product-category, product (with relations).
- `reviews.json` → review (product relation).
- `comments.json` → comment (entityType, entitySlug, parentComment).
- `videos.json` → video (+ category/tags if modeled).
- `gallery.json` → gallery-item (+ category/tags).
- `faqs.json` → faq.
- `testimonials.json` → testimonial.
- Legal pages: if stored in JSON, → legal-page; else keep static or small JSON.

---

## 2. Current Strapi backend summary (via MCP)

- **Strapi version:** 5.39.0  
- **Environment:** development  
- **Plugins:** content-manager, content-type-builder, email, upload, i18n, content-releases, review-workflows, **mcp**, users-permissions  

**Content types:** Only plugin/admin types present:
- plugin::upload.file, plugin::upload.folder  
- plugin::i18n.locale  
- plugin::content-releases.*, plugin::review-workflows.*  
- plugin::users-permissions.*  
- admin::*  

**Custom API content types:** None (`api::*`).  
**Custom components:** None (empty list).

So the Strapi instance is a fresh install with no ZdravLife schema yet.

---

## 3. Gap analysis table

| Area | Frontend current | Strapi target | Gap |
|------|------------------|---------------|-----|
| Site settings | site-config.json (name, tagline, url, links, author, seo) | site-setting single type | Need single type + fields (siteName, siteUrl, tagline, defaultSeo, logo, favicon, socialLinks, newsletter*, footerText, contactEmail, youtubeUrl, instagramUrl, etc.) |
| Homepage | Implicit from featured* + site config | home-page single type (hero, featuredPosts, featuredProducts, featuredVideos, featuredGalleryItems, featuredTestimonials, homepageSeo) | Need single type + shared components (hero, cta, etc.) |
| Authors | Embedded in posts | author collection | Need collection; posts → author relation |
| Categories (blog) | Derived from posts / embedded | category collection | Need collection; posts → category |
| Tags | Derived from posts / embedded | tag collection | Need collection; posts ↔ tags M:N |
| Posts | posts.json | post collection (author, category, tags, relatedPosts, seo) | Need collection + all relations |
| Videos | videos.json | video collection (category, tags) | Need collection; category can be string or relation |
| Gallery | gallery.json | gallery-item collection | Need collection |
| Product categories | Embedded in products | product-category collection | Need collection; products → category |
| Products | products.json | product collection (category, tags, specs, faqItems, relatedProducts) | Need collection + relations |
| Reviews | reviews.json | review collection (product) | Need collection; review → product |
| Comments | comments.json | comment (entityType, entitySlug, parentComment) | Need collection; no polymorphic relation in v1 |
| Testimonials | testimonials.json | testimonial collection | Need collection |
| FAQs | faqs.json | faq collection | Need collection (category, featured) |
| Legal | Static or JSON | legal-page collection | Need collection (title, slug, content, seo) |
| SEO | Inline in content types | shared.seo component | Need component; attach to all public types |
| Shared UI building blocks | N/A | shared.cta, shared.image-with-alt, shared.rich-link, shared.social-link, layout.hero, layout.stat-item, layout.faq-item, product.spec-item | All need creating |

---

## 4. Recommended migration plan by phase

1. **Phase 2 — Strapi schema foundation**  
   Create all components and single/collection types in Strapi (via Content-Type Builder or schema files). No frontend change.

2. **Phase 3 — Permissions**  
   Configure public read for site-setting, home-page, author, category, tag, post, video, gallery-item, product-category, product, faq, legal-page, testimonial; keep review/comment writes server-side only.

3. **Phase 4 — Seed scripts**  
   Build Node/TS scripts to read `data/*.json` and seed Strapi in dependency order (categories, tags, authors → … → posts, products, etc.).

4. **Phase 5 — Frontend client + repositories + mappers**  
   Add Strapi client, repositories, and mappers; keep existing domain types; do not switch pages yet.

5. **Phase 6 — Homepage + site settings**  
   Switch homepage and global site settings to Strapi.

6. **Phase 7 — Blog**  
   Switch blog index, post detail, categories, tags to Strapi.

7. **Phase 8 — Media/legal/FAQs/testimonials**  
   Switch videos, gallery, FAQs, legal pages, testimonials to Strapi.

8. **Phase 9 — Shop**  
   Switch shop index, product detail, reviews (read) to Strapi.

9. **Phase 10 — Comments**  
   Read from Strapi; writes via Next.js handlers only.

10. **Phase 11 — Contact (optional)**  
    Optional contact-submission collection; form submit via Next.js.

11. **Phase 12 — Media uploads**  
    Migrate images to Strapi media; link to entries.

12. **Phase 13 — Cleanup**  
    Remove obsolete JSON code paths; update README and CHANGELOG.

---

## 5. Risks / caution areas

- **Strapi MCP is read-only:** Content-type and component creation cannot be done via the current MCP tools. Phase 2 must be done in Strapi Admin (Content-Type Builder) or by adding schema files to the Strapi project and restarting.
- **Post categories vs video/gallery categories:** Target model uses `category` relation for posts; videos/gallery may use same category collection or separate; clarify to avoid duplicate concepts.
- **Comments entity key:** Frontend uses `entityId`; target uses `entitySlug` or `entityId`. Keep one consistent key for entity association.
- **Testimonial field mismatch:** Current JSON has `authorName`, `authorTitle`, `content`; target has `name`, `role`, `quote` — mapper must align.
- **Product details/specs:** Current `details: ProductDetail[]` (label/value); target `specs` (product.spec-item component) — straightforward mapping.
- **Legal pages:** If currently hardcoded in pages, need to create legal-page entries and a resolver by slug.
- **Lowest-risk first migration:** Homepage + site settings (Phase 6) is the smallest surface area for a first data swap; then blog, then media, then shop.

---

## 6. Files likely affected in later phases

| Phase | Files likely touched |
|-------|----------------------|
| 5 | New: `lib/strapi/client.ts`, `lib/strapi/repositories/*.ts`, `lib/strapi/mappers/*.ts`; env: STRAPI_URL, STRAPI_API_TOKEN |
| 6 | `app/page.tsx`, layout/nav/footer if they use site config, `lib/seo/metadata.ts` (siteUrl etc.), `lib/data/services.ts` or new data source switch |
| 7 | `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`, `app/categories/[slug]/page.tsx`, `app/tags/[slug]/page.tsx`, API routes for posts/categories/tags, `lib/seo/metadata.ts` (sitemap) |
| 8 | `app/videos/page.tsx`, `app/gallery/page.tsx`, `app/media/page.tsx`, `app/faq/page.tsx`, legal pages, components using testimonials |
| 9 | `app/shop/page.tsx`, `app/shop/[slug]/page.tsx`, product/review services and API routes |
| 10 | `app/api/comments/route.ts`, comment components, repositories |
| 11 | `app/contact/page.tsx`, `app/api/contact/route.ts` (if exists) |
| 12 | Image components, placeholder logic, migration scripts |
| 13 | `lib/data/services.ts` (remove or gate JSON paths), README, CHANGELOG |

---

*End of Phase 1 gap analysis.*
