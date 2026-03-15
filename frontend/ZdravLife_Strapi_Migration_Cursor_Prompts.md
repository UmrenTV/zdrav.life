# ZdravLife → Strapi Migration Master Prompts for Cursor

This document contains a staged set of **Cursor prompts** to migrate the existing **zdrav.life** Next.js website from local JSON-backed content to a **Strapi v5 + PostgreSQL CMS**, using the **working Strapi MCP connection**.

It is designed for **incremental migration**, not a big-bang rewrite.

The goal is to:
- keep the current website design and UX intact
- preserve the existing route structure, domain types, and SEO behavior
- move content and structured data into Strapi gradually
- keep the app buildable after every phase
- use Cursor + Strapi MCP to inspect, build, and verify the backend safely

---

## 0. Current project assumptions

These prompts assume:

- The frontend already exists and is working in **Next.js App Router + TypeScript + Tailwind**.
- The frontend currently uses a **JSON-backed service/data layer** and was designed to be API-swappable.
- The current site already includes homepage, blog, shop, media/gallery/video areas, category/tag pages, search, comments/reviews scaffolding, SEO helpers, legal pages, and route coverage from the PLAN.
- A **Strapi v5** project exists in a separate folder/repo.
- Strapi is already connected to **PostgreSQL**.
- The **Strapi MCP plugin** is installed and working with Cursor.
- Cursor has already confirmed that the MCP connection is healthy, but the Strapi instance currently has **no custom content models yet**.

---

## 1. Non-negotiable migration rules

Give these rules to Cursor in every phase, or paste them once before starting.

```txt
You are acting as a strict senior full-stack engineer and migration lead.

Project context:
- Existing frontend: Next.js App Router, TypeScript, Tailwind, modular architecture, current website design already implemented.
- Existing frontend source of truth: local JSON files + service layer abstraction.
- New backend target: Strapi v5 + PostgreSQL.
- Strapi MCP is connected and working.

Hard rules:
- Do NOT redesign the site.
- Do NOT break existing routes.
- Do NOT replace the current frontend architecture with a new pattern unless absolutely necessary.
- Do NOT let raw Strapi response shapes leak directly into UI components.
- Keep existing TypeScript domain models stable where possible.
- Add adapter/mapper layers between Strapi and the current frontend models.
- Keep build passing after each phase.
- Prefer incremental changes over broad rewrites.
- Preserve existing SEO behavior and extend it cleanly for Strapi-backed data.
- Keep comments/reviews/contact writes behind Next.js server-side handlers, not open public CMS writes.
- If changing a schema or existing contract, document the migration impact before applying it.
- Before writing code, inspect the current project structure and existing service layer.
- Before modifying Strapi, inspect current content types/components through MCP.
- At the end of each phase, provide:
  1. what was changed,
  2. what remains,
  3. any manual setup needed,
  4. a verification checklist.
```

---

## 2. Target Strapi content model

These are the backend entities the migration should ultimately produce.

### Shared components
- `shared.seo`
- `shared.cta`
- `shared.image-with-alt`
- `shared.rich-link`
- `shared.social-link`
- `layout.hero`
- `layout.stat-item`
- `layout.faq-item`
- `product.spec-item`

### Single types
- `site-setting`
- `home-page`

### Collection types
- `author`
- `category`
- `tag`
- `post`
- `video`
- `gallery-item`
- `product-category`
- `product`
- `review`
- `comment`
- `testimonial`
- `faq`
- `legal-page`
- optional later: `contact-submission`

### Important relation rules
- `post -> author`: many-to-one
- `post -> category`: many-to-one
- `post -> tags`: many-to-many
- `post -> relatedPosts`: many-to-many self relation
- `product -> product-category`: many-to-one
- `product -> tags`: many-to-many
- `review -> product`: many-to-one
- `home-page -> featuredPosts/products/videos/galleryItems`: many-to-many
- `video -> category`: many-to-one
- `video -> tags`: many-to-many
- `gallery-item -> category`: many-to-one
- `gallery-item -> tags`: many-to-many
- `comment -> parentComment`: self relation

### Important comment modeling rule
Do **not** overcomplicate comments with polymorphic Strapi relations in phase one.
Use a simpler model:
- `entityType`
- `entitySlug` or `entityId`
- `parentComment`
- `status`

---

## 3. Recommended migration order

Migrate in this order:

1. Strapi schema foundation
2. Site settings + homepage
3. Blog domain: authors, categories, tags, posts
4. Frontend homepage/blog data swap
5. Media domain: videos, gallery items, testimonials, FAQs, legal pages
6. Frontend media/legal swap
7. Commerce domain: product categories, products, reviews
8. Frontend shop swap
9. Comments + moderated write flow
10. Optional contact submissions
11. Seed/migration scripts hardening
12. Image/media pipeline and uploads
13. Final cleanup, docs, and verification

---

# PHASE PROMPTS

---

## Phase 1 — Inspect current state and produce gap analysis - COMPLETED

Use this first.

```txt
You are working on the ZdravLife migration from local JSON data to Strapi v5.

Task:
1. Inspect the current frontend repository structure first.
2. Identify the current domain types, service/data layer, API routes, SEO helpers, comments/reviews handling, and JSON data sources.
3. Then use the connected Strapi MCP server to inspect:
   - all current content types,
   - all current components,
   - all available services.
4. Compare the current frontend data model and route requirements against the target Strapi CMS model for:
   - site settings
   - homepage
   - authors
   - categories
   - tags
   - posts
   - videos
   - gallery items
   - product categories
   - products
   - reviews
   - comments
   - testimonials
   - FAQs
   - legal pages
5. Produce a migration gap analysis.

Requirements:
- Do not change code yet.
- Do not create any content types yet.
- Be explicit about which frontend files are likely to be affected later.
- Identify the current JSON files that need eventual migration.
- Identify where mapper/adapters should live in the frontend.
- Identify which routes/pages can be migrated with the lowest risk first.

Output format:
- Current frontend architecture summary
- Current Strapi backend summary
- Gap analysis table
- Recommended migration plan by phase
- Risks / caution areas
```

---

## Phase 2 — Build the Strapi schema foundation through MCP - COMPLETED

Use this after the gap analysis.

```txt
Using the connected Strapi MCP server, build the ZdravLife Strapi schema foundation.

Create these Strapi components first:
- shared.seo
- shared.cta
- shared.image-with-alt
- shared.rich-link
- shared.social-link
- layout.hero
- layout.stat-item
- layout.faq-item
- product.spec-item

Then create these single types:
- site-setting
- home-page

Then create these collection types:
- author
- category
- tag
- post
- video
- gallery-item
- product-category
- product
- review
- comment
- testimonial
- faq
- legal-page

Field requirements:

shared.seo:
- metaTitle
- metaDescription
- ogTitle
- ogDescription
- ogImage
- canonicalUrl
- noindex
- nofollow
- keywords

shared.cta:
- label
- href
- variant

shared.image-with-alt:
- image
- alt
- caption

shared.rich-link:
- title
- href
- description

shared.social-link:
- platform
- label
- href

layout.hero:
- eyebrow
- heading
- subheading
- backgroundImage
- primaryCta
- secondaryCta

layout.stat-item:
- label
- value

layout.faq-item:
- question
- answer

product.spec-item:
- label
- value

site-setting:
- siteName
- siteUrl
- tagline
- defaultSeo
- logo
- favicon
- defaultOgImage
- socialLinks
- newsletterHeading
- newsletterText
- footerText
- contactEmail
- youtubeUrl
- instagramUrl
- tiktokUrl
- githubUrl
- themeNotes

home-page:
- hero
- featuredPosts
- featuredProducts
- featuredVideos
- featuredGalleryItems
- featuredTestimonials
- homepageSeo
- optional section toggles if justified

author:
- name
- slug
- bio
- avatar
- role
- socialLinks
- seo

category:
- name
- slug
- description
- coverImage
- seo

tag:
- name
- slug
- description
- seo

post:
- title
- slug
- subtitle
- excerpt
- content
- coverImage
- gallery
- author
- category
- tags
- featured
- publishedAt
- readingTime
- relatedPosts
- seo
- status
- commentsEnabled

video:
- title
- slug
- platform
- youtubeVideoId
- excerpt
- thumbnail
- category
- tags
- featured
- publishedAt
- duration
- seo

gallery-item:
- title
- slug
- image
- thumbnail
- caption
- mediaType
- category
- tags
- featured
- sourcePlatform
- publishedAt
- seo

product-category:
- name
- slug
- description
- image
- seo

product:
- title
- slug
- subtitle
- shortDescription
- description
- gallery
- featuredImage
- category
- tags
- price
- compareAtPrice
- currency
- stockStatus
- sku
- featured
- specs
- shippingInfo
- faqItems
- relatedProducts
- seo
- reviewsEnabled

review:
- product
- authorName
- rating
- title
- content
- verifiedPurchase
- helpfulCount
- approved
- createdAtOverride

comment:
- entityType
- entitySlug
- parentComment
- authorName
- authorEmail
- authorWebsite
- avatar
- content
- status
- likes
- createdAtOverride

testimonial:
- name
- role
- avatar
- quote
- featured
- order

faq:
- question
- answer
- category
- featured

legal-page:
- title
- slug
- content
- seo

Rules:
- Use consistent API IDs and clean naming.
- Use slugs where appropriate.
- Add SEO component to all public-facing content types.
- Create relations carefully and explicitly.
- Do not improvise unrelated fields.
- If Strapi requires slight naming adjustments, keep them production-grade and explain them.

After creation:
1. inspect the resulting schema through MCP,
2. list all created content types and components,
3. list all relations,
4. report anything still missing.
```

---

## Phase 3 — Configure Strapi public-read policy and content exposure plan - COMPLETED

Use this after schema creation.

```txt
Inspect the newly created Strapi schema through MCP and prepare the safe public exposure plan for the ZdravLife site.

Task:
1. Review all content types and determine which ones should have public read access.
2. Do NOT enable open public write access for reviews, comments, or contact submissions.
3. Produce a precise permission plan for:
   - Public
   - Authenticated (if relevant later)
   - Admin/editor-only content management
4. Document how the frontend should access each content type safely.
5. If role/permission changes can be automated safely, implement them carefully; otherwise document exact manual steps.

Public read should cover:
- site-setting
- home-page
- author
- category
- tag
- post
- video
- gallery-item
- product-category
- product
- faq
- legal-page
- testimonial
- approved reviews/comments only if surfaced through controlled endpoints

Requirements:
- Keep moderation-sensitive writes server-side only.
- Do not expose anything that invites spam or abuse.
- Explain what the Next.js app should call directly from Strapi versus what should remain behind Next.js route handlers.

Output:
- Permissions matrix
- Recommended API exposure strategy
- Any manual admin steps
```

---

## Phase 4 — Build seed/migration scripts from current JSON into Strapi - COMPLETED

Use this after schema creation and permissions planning.

```txt
Create the migration/seed layer to move the existing ZdravLife JSON data into Strapi.

Task:
1. Inspect the current frontend data directory and identify all JSON files currently used as the content source.
2. Create a one-off migration script system in Node/TypeScript to read those JSON files and seed Strapi.
3. Create clean mapping logic from current JSON shapes into the Strapi schema.
4. Seed in this order:
   - categories
   - tags
   - authors
   - FAQs
   - testimonials
   - site settings
   - homepage
   - posts
   - videos
   - gallery items
   - product categories
   - products
   - reviews
   - comments
   - legal pages
5. Keep image/media references simple at first. If media upload automation is not yet stable, preserve image paths/URLs in a documented placeholder-safe way.

Requirements:
- Do not hardcode secrets in scripts.
- Use environment variables for Strapi base URL and API token.
- Make the scripts idempotent where feasible, or clearly document non-idempotent behavior.
- Create small reusable migration helpers rather than one giant script.
- Log useful progress and failure messages.
- Keep the script folder clearly separated from app runtime code.

Expected deliverables:
- migration folder structure
- migration runner
- per-domain seed logic or clearly separated seed steps
- mapping helpers
- README instructions for running the migration
```

---

## Phase 5 — Add frontend Strapi client, repositories, and adapters without changing UI behavior - COMPLETED

Use this before swapping pages to Strapi.

```txt
Migrate the ZdravLife frontend data layer to support Strapi as a source without changing UI behavior yet.

Task:
1. Inspect the current service/data layer and domain type definitions.
2. Introduce a Strapi client layer with reusable server-side helpers such as:
   - getStrapi<T>()
   - postStrapi<T>()
3. Introduce domain repositories such as:
   - site.repository.ts
   - posts.repository.ts
   - products.repository.ts
   - media.repository.ts
   - comments.repository.ts
   - reviews.repository.ts
4. Introduce mapper/adapters such as:
   - mapStrapiSiteSettings
   - mapStrapiHomePage
   - mapStrapiPostToPost
   - mapStrapiProductToProduct
   - mapStrapiVideoToVideo
   - mapStrapiGalleryItemToGalleryItem
   - mapStrapiCommentToComment
   - mapStrapiReviewToReview
5. Keep the current domain types stable where possible.
6. Keep the JSON-backed source available as a fallback until each section is proven stable.

Requirements:
- Do not let raw Strapi response shapes leak into page or component code.
- Keep list fetches light and detail fetches richer using populate rules carefully.
- Centralize Strapi query construction where helpful.
- Use environment variables like:
  - NEXT_PUBLIC_STRAPI_URL
  - STRAPI_API_TOKEN (server-side only)
- Do not migrate actual pages yet unless necessary for testing repository functions.
- Keep build passing.

Output:
- clear file-level changes
- repository/adapters added
- source-switching strategy documented
- verification checklist
```

---

## Phase 6 — Migrate site settings + homepage to Strapi - COMPLETED

Use this as the first real frontend swap.

```txt
Migrate the ZdravLife frontend site settings and homepage data source from local JSON to Strapi.

Task:
1. Inspect the existing homepage implementation and identify all data dependencies.
2. Replace the source of truth for global site settings and homepage content with Strapi-backed repositories and adapters.
3. Keep the current homepage layout and design exactly as implemented.
4. Preserve all existing animations, section ordering, and component usage.
5. Keep fallback behavior reasonable if Strapi content is missing.

Homepage domains to migrate:
- global site settings
- hero content
- featured post references
- featured product references
- featured video references
- featured gallery item references
- featured testimonials
- homepage SEO

Requirements:
- No redesign.
- No visual regressions.
- Preserve metadata behavior.
- Preserve current section components.
- Keep current route and build stable.

At the end:
- verify homepage renders from Strapi,
- verify metadata,
- verify navbar/footer global settings where applicable,
- report any remaining JSON dependencies.
```

---

## Phase 7 — Migrate blog domain: authors, categories, tags, posts - COMPLETED

Use this after homepage is stable.

```txt
Migrate the ZdravLife blog domain from local JSON to Strapi while preserving the current UI and routes.

Scope:
- authors
- categories
- tags
- posts
- post detail pages
- category landing pages
- tag landing pages
- blog index filters/search/pagination behavior where already implemented

Task:
1. Inspect the current blog-related pages, loaders, services, and SEO logic.
2. Replace JSON-backed blog data with Strapi repositories and adapters.
3. Preserve current route structure and slugs.
4. Preserve existing category/tag filtering behavior.
5. Preserve related posts behavior if currently supported.
6. Preserve reading time and metadata behavior.
7. Keep comments disabled or JSON-backed for now unless already isolated cleanly.

Requirements:
- No redesign.
- No route changes.
- Preserve current card layouts and article layout.
- Preserve breadcrumbs if present.
- Ensure category/tag landing pages resolve correctly.
- Keep list queries efficient.
- Keep detail queries sufficiently populated.

At the end:
- verify blog index,
- verify blog detail,
- verify category pages,
- verify tag pages,
- verify SEO metadata,
- list any leftover JSON dependencies.
```

---

## Phase 8 — Migrate media domain: videos, gallery items, testimonials, FAQs, legal pages - COMPLETED

Use this after blog is stable.

```txt
Migrate the ZdravLife media and supporting-content domain from local JSON to Strapi.

Scope:
- videos
- gallery items / instagram-style feed
- testimonials
- FAQs
- legal pages
- media-related landing pages already implemented in the frontend

Task:
1. Inspect the current routes/pages/components for media, gallery, legal, FAQ, and testimonial usage.
2. Replace JSON-backed sources with Strapi repositories/adapters.
3. Preserve current UI and route behavior.
4. Preserve image handling and placeholder safety for now.
5. Keep future YouTube/Instagram sync compatibility in mind.

Requirements:
- No redesign.
- Keep legal content simple and editable.
- Keep media card/list behavior intact.
- Preserve homepage references that may already use media/testimonial data.
- Keep metadata support where relevant.

At the end:
- verify videos page,
- verify gallery/media page,
- verify FAQ usage,
- verify legal pages,
- verify testimonial sections,
- report any missing seed content or media upload blockers.
```

---

## Phase 9 — Migrate commerce domain: product categories, products, reviews - COMPLETED

Use this after media is stable.

```txt
Migrate the ZdravLife commerce/catalog domain from local JSON to Strapi.

Scope:
- product categories
- products
- product detail pages
- review data
- featured product references on homepage or elsewhere

Task:
1. Inspect the current product/shop implementation, filters, sorting, cards, detail page layout, and review rendering.
2. Replace JSON-backed product and review sources with Strapi repositories/adapters.
3. Preserve all current UI and page routes.
4. Preserve current pricing and stock fields where already modeled.
5. Preserve current review summaries and detail rendering.
6. Keep actual checkout/payment logic out of scope unless already scaffolded.

Requirements:
- No redesign.
- No route changes.
- Keep existing SEO/product metadata patterns.
- Keep related products behavior if present.
- Keep review writes closed for now; only read approved reviews through controlled access.

At the end:
- verify shop index,
- verify product detail pages,
- verify product filtering/sorting if implemented,
- verify review display,
- report any remaining JSON dependencies.
```

---

## Phase 10 — Migrate comments to moderated Strapi-backed storage via Next.js handlers

Use this only after read-side migrations are stable.

```txt
Implement the ZdravLife comments migration using Strapi as storage, while keeping writes moderated and controlled through Next.js server-side handlers.

Task:
1. Inspect the current comment UI, routes, and any existing API handlers.
2. Keep the frontend comment UI intact.
3. Build a safe Next.js server-side write flow for comments:
   - validate input
   - sanitize input
   - forward to Strapi using server-side credentials
   - default new comments to pending moderation unless existing rules dictate otherwise
4. Read comments from Strapi using controlled repository functions.
5. Support threaded replies using parentComment where the UI already supports it.
6. Keep comments associated via entityType + entitySlug or equivalent stable key.

Requirements:
- Do not expose open public write permissions directly on Strapi.
- Preserve the current comment component API where possible.
- Add anti-spam-friendly structure if justified, but do not overbuild.
- Keep approval status respected on read side.

At the end:
- verify comment reads,
- verify comment submission flow,
- verify moderation-safe behavior,
- document env vars and tokens required.
```

---

## Phase 11 — Optional contact submissions via Next.js → Strapi - COMPLETED

Use only if you want contact messages in Strapi too.

```txt
Implement contact form submission storage for ZdravLife using Next.js server-side handlers forwarding to Strapi.

Task:
1. Inspect the current contact page/form implementation.
2. Create an optional Strapi collection type for contact submissions if not already present.
3. Keep the current contact UI unchanged.
4. Validate and sanitize submissions in Next.js.
5. Forward accepted submissions to Strapi using server-side credentials.

Requirements:
- No public write permissions directly on Strapi.
- Keep spam and abuse concerns in mind.
- Document the exact flow.

At the end:
- verify form behavior,
- verify Strapi storage,
- document any future anti-spam improvements.
```

---

## Phase 12 — Media upload strategy and placeholder asset migration - COMPLETED

Use once data migration is stable.

```txt
Prepare the ZdravLife media migration and upload strategy.

Task:
1. Inspect the current image/media paths and placeholder usage in the frontend.
2. Cross-reference them with the current Strapi content model and seeded content.
3. Produce a migration plan for:
   - logo
   - default OG image
   - about portrait
   - blog covers
   - product images
   - video thumbnails
   - gallery images
   - testimonial/review avatars
4. If feasible, implement helper scripts or documentation for uploading media into Strapi and linking it to entries.
5. Keep current placeholder-safe frontend behavior intact until media is fully migrated.

Requirements:
- Do not break existing image rendering.
- Prefer stability over premature automation.
- Keep room for later object storage / cloud media.

Output:
- media migration checklist
- optional upload script plan
- mapping notes between current public assets and Strapi media fields
```

---

## Phase 13 — Final cleanup, removal of obsolete JSON dependencies, README and changelog updates - COMPLETED

Use only when the migration is truly stable.

```txt
Finalize the ZdravLife migration from local JSON to Strapi.

Task:
1. Inspect the frontend for any remaining obsolete JSON dependencies.
2. Remove only the JSON-backed code paths that are now fully replaced by stable Strapi-backed repositories.
3. Keep any intentional fallback/mock utilities only if clearly justified and documented.
4. Update README with:
   - current architecture
   - Strapi setup summary
   - environment variables
   - migration status
   - how content now flows through the system
5. Update CHANGELOG with a clean summary of the migration phases completed.
6. Produce a final verification checklist for:
   - homepage
   - blog
   - media
   - shop
   - legal pages
   - comments
   - SEO
   - builds

Requirements:
- Do not delete useful migration scripts or docs.
- Do not remove JSON files unless sure they are no longer required.
- Keep the codebase understandable for future work.

Output:
- final migration summary
- leftover technical debt list
- future recommended work
```

---

# Bonus prompts

## Bonus A — Strapi schema verification after any backend phase

```txt
Use the Strapi MCP server to inspect the current backend state.
List:
1. all custom components,
2. all custom content types,
3. all relations,
4. any missing fields relative to the ZdravLife migration plan,
5. any naming inconsistencies,
6. any likely frontend integration issues.
```

## Bonus B — Frontend verification after any migration phase

```txt
Inspect the current frontend implementation and verify whether the latest Strapi migration phase preserved:
- route structure,
- domain types,
- component props,
- metadata generation,
- filtering/pagination behavior,
- build stability.

Then list:
1. what changed,
2. what might break,
3. what still uses JSON,
4. what should be migrated next.
```

## Bonus C — Seed content verification

```txt
Inspect the current Strapi content through the MCP-accessible schema and compare it against the current frontend usage expectations.
Identify:
- missing required entries,
- missing relations,
- missing SEO fields,
- broken slugs,
- likely empty-state risks in the frontend.
```

---

# Recommended usage sequence

Use the prompts in this order:

1. Phase 1 — gap analysis
2. Phase 2 — Strapi schema creation
3. Phase 3 — permissions/public exposure plan
4. Phase 4 — seed/migration scripts
5. Phase 5 — frontend repository/adapters
6. Phase 6 — homepage/site settings
7. Phase 7 — blog
8. Phase 8 — media/legal/testimonials/faq
9. Phase 9 — shop/products/reviews
10. Phase 10 — comments
11. Phase 11 — contact submissions (optional)
12. Phase 12 — media upload strategy
13. Phase 13 — cleanup/docs

---

# Final operating advice

When using Cursor on this migration:

- keep **Strapi repo** and **frontend repo** both available in the workspace if possible
- run one phase at a time
- make Cursor inspect before it edits
- require a summary after each phase
- keep builds passing after each phase
- do not let Cursor do a silent broad rewrite
- prefer small validated commits between phases

If Cursor starts drifting, reset it with this sentence:

```txt
Do not redesign the site. Preserve the existing ZdravLife frontend design, routes, component structure, and UX. This is a source-of-truth migration from JSON to Strapi, not a product redesign.
```

