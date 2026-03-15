# Changelog

All notable changes to the ZdravLife website project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.2.0] - 2025-03-13

### Added

- **Strapi CMS migration** – Optional Strapi v5 + PostgreSQL backend. When `STRAPI_URL` and `STRAPI_API_TOKEN` are set, the site reads content from Strapi instead of local JSON.
- **Data source layer** (`lib/data/data-source.ts`) – Single entry point for all content; delegates to Strapi repositories or JSON services based on env.
- **Strapi client** (`lib/strapi/client.ts`) – REST helpers: `getCollection`, `getBySlug`, `getSingleType`, `createEntry`.
- **Strapi repositories** – Site, posts, products, media, reviews, comments, legal; all return existing domain types via mappers.
- **Strapi mappers** (`lib/strapi/mappers/`) – Map Strapi responses to ZdravLife types (no raw Strapi in UI).
- **Schema export** (`strapi-schema-export/`) – Full Strapi v5 schema (components, single types, collection types) for copy into a Strapi project.
- **Seed scripts** (`scripts/strapi-seed/`) – Migrate `data/*.json` into Strapi (categories, tags, authors, FAQs, testimonials, site setting, posts, videos, gallery, product categories, products, reviews, comments, legal pages, home page).
- **Docs** – `docs/MIGRATION_GAP_ANALYSIS.md`, `docs/STRAPI_PERMISSIONS_PLAN.md`, `docs/STRAPI_MEDIA_MIGRATION.md`, `docs/STRAPI_SETUP.md`.

### Changed

- Homepage, blog, shop, media, FAQ, and API routes now use `data-source`; with Strapi env set, they read from Strapi.
- SEO metadata and sitemap use data-source for posts, products, categories, tags.

---

## [1.1.0] - 2025-03-13

### Added

- **Contact page** (`/contact`) – Contact form and email/social contact info.
- **Search page** (`/search`) – Full-site search across posts, products, and videos with URL-based query state and optional type filter.
- **Category landing pages** (`/categories/[slug]`) – Dedicated pages for each blog category (e.g. `/categories/nutrition`, `/categories/adventure`) with SEO metadata and post grids.
- **Tag landing pages** (`/tags/[slug]`) – Dedicated pages for each tag (e.g. `/tags/calisthenics`) with SEO metadata and post grids.
- **Media hub** (`/media`) – Aggregator page for videos and gallery with featured content and links to `/videos` and `/gallery`.
- **Content pillar pages**:
  - `/adventures` – Motorcycle travel and adventure content.
  - `/nutrition` – Fasting, meal systems, and nutrition.
  - `/training` – Calisthenics, hypertrophy, and strength.
  - `/philosophy` – Discipline, mindset, and systems thinking.
  - `/lifestyle` – Life design and routines (latest posts).
  - `/journal` – Latest journal/blog articles.
- **Legal & support pages**:
  - `/privacy-policy` – Privacy policy (data collection, use, cookies, rights).
  - `/terms` – Terms of service.
  - `/shipping-returns` – Shipping options and returns policy.
- **Data layer (PLAN alignment)**:
  - `data/youtube.json` – YouTube-style video data (mirror of `videos.json` for future API swap).
  - `data/instagram.json` – Instagram-style post data (media, captions, timestamps) for future API/CMS integration.
- **Services** – `getCategoryBySlug()` and `getTagBySlug()` in the data layer for category/tag pages.
- **Sitemap** – Entries for `/media`, `/search`, `/journal`, `/lifestyle`, `/shipping-returns`, and dynamic entries for all `/categories/[slug]` and `/tags/[slug]`.
- **Navigation** – Search icon in navbar links to `/search`.

### Changed

- Sitemap generation now includes categories and tags for full PLAN coverage.

---

## [1.0.0] - Initial release

### Added

- Next.js 14 App Router with TypeScript.
- Premium design system (light/dark theme, Tailwind, shadcn/ui).
- Homepage with hero, featured content, pillars, about preview, videos, gallery, blog, shop, testimonials, newsletter, and CTA sections.
- Blog system: index, post detail, categories, tags, comments, related posts.
- Shop: product listing, product detail, filters, reviews, related products.
- Media: videos page (YouTube-style), gallery page (masonry).
- About, FAQ, 404 pages.
- API routes: posts, products, categories, tags, comments, reviews, search, media.
- JSON data: posts, products, reviews, comments, videos, gallery, FAQs, testimonials, site config.
- SEO: metadata helpers, sitemap, robots.txt, structured data (article, product, video, FAQ, breadcrumb).
- Framer Motion animations, theme toggle, responsive layout, footer and navbar.

---

**Engineer Your Vitality.**
