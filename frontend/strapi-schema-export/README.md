# ZdravLife Strapi v5 Schema Export

This folder contains the full ZdravLife CMS schema as Strapi v5 content-type and component definitions. Use it to bootstrap your Strapi project (e.g. `zdravlife-cms`) when it has no custom content types yet.

## Important

**Strapi MCP does not expose "create content type" or "create component" tools.** This export is the schema definition you can apply manually.

## How to apply

### Option A: Copy into existing Strapi project (recommended)

1. Open your Strapi project (e.g. `zdravlife-cms`).
2. Copy the **contents** of each folder (not the folder itself) so you don’t create an extra `src`:
   - **From** `strapi-schema-export/src/components/` (the files and subfolders inside it)  
     **into** your Strapi project’s `src/components/`.
   - **From** `strapi-schema-export/src/api/` (the folders like `category/`, `post/`, etc.)  
     **into** your Strapi project’s `src/api/`.
3. You must end up with e.g. `your-strapi/src/api/category/content-types/category/schema.json`, **not** `your-strapi/src/src/api/...`.
4. Ensure no name clashes with existing APIs.
5. In the Strapi project run `npm run build` then `npm run develop`. Only then do the new types appear in the admin and under Settings → Roles → Public.

**Detailed steps and troubleshooting (404, missing permissions):** see **docs/STRAPI_APPLY_SCHEMA.md** in the zdrav.life repo. This export uses: `site-setting`, `home-page`, `author`, `category`, `tag`, `post`, `video`, `gallery-item`, `product-category`, `product`, `review`, `comment`, `testimonial`, `faq`, `legal-page`.
4. Run `npm run build` (or `yarn build`) in the Strapi project. Strapi will load the schemas and create the database tables.
5. Restart Strapi (`npm run develop`).

### Option B: Create via Content-Type Builder (manual)

If you prefer not to copy schema files, use Strapi Admin → Content-Type Builder and create each component and content type by hand, following the field list in the migration guide (`ZdravLife_Strapi_Migration_Cursor_Prompts.md`, Phase 2).

## Contents

### Components

- **shared:** seo, cta, image-with-alt, rich-link, social-link
- **layout:** hero, stat-item, faq-item
- **product:** spec-item

All content types in this export have **Draft & Publish** enabled (`draftAndPublish: true`) so you can copy `src` into your Strapi project without enabling it in the Content-Type Builder (which can return 400 for existing types).

### Single types

- **site-setting** — global site config, default SEO, social links, newsletter/footer text.
- **home-page** — hero, featured relations (posts, products, videos, gallery, testimonials), homepage SEO.

### Collection types

- **author** — name, slug, bio, avatar, role, socialLinks, seo.
- **category** — name, slug, description, coverImage, seo (blog/media categories).
- **tag** — name, slug, description, seo.
- **post** — title, slug, subtitle, excerpt, content, coverImage, gallery, author, category, tags, featured, publishedAt, readingTime, relatedPosts, seo, commentsEnabled; uses draftAndPublish.
- **video** — title, slug, platform, youtubeVideoId, excerpt, thumbnail, category, tags, featured, publishedAt, duration, seo; uses draftAndPublish.
- **gallery-item** — title, slug, image, thumbnail, caption, mediaType, category, tags, featured, sourcePlatform, publishedAt, seo; uses draftAndPublish.
- **product-category** — name, slug, description, image, seo.
- **product** — title, slug, subtitle, shortDescription, description, gallery, featuredImage, category, tags, price, compareAtPrice, currency, stockStatus, sku, featured, specs, shippingInfo (json), faqItems, relatedProducts, seo, reviewsEnabled.
- **review** — product, authorName, rating, title, content, verifiedPurchase, helpfulCount, approved, createdAtOverride.
- **comment** — entityType, entitySlug, parentComment (self), authorName, authorEmail, authorWebsite, avatar, content, status, likes, createdAtOverride.
- **testimonial** — name, role, avatar, quote, featured, order.
- **faq** — question, answer, category, featured.
- **legal-page** — title, slug, content, seo.

## After applying

1. In Strapi Admin, set **Settings → Users & Permissions → Public role**: enable find/findOne for the content types that the frontend will read (site-setting, home-page, author, category, tag, post, video, gallery-item, product-category, product, faq, legal-page, testimonial). Do **not** enable public create/update for review, comment, or contact.
2. Create an API token for the Next.js app (server-side) and set `STRAPI_URL` and `STRAPI_API_TOKEN` in the frontend env.
3. Run the seed/migration scripts (Phase 4) to populate content from the existing JSON files.
