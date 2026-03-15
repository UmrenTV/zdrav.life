# Strapi Seed Scripts

Two entry points:

1. **Schema seed (bootstrap only)** — `npm run strapi-seed`  
   Seeds **Site Setting** and **Home Page** only (no dummy content). Use after copying schema from `strapi-schema-export/` to your Strapi project. If `data/site-config.json` is missing, minimal defaults are used.

2. **Dummy data (full content)** — `npm run strapi-dummy-data`  
   Seeds all content from `data/*.json` (categories, tags, authors, posts, products, videos, gallery, reviews, comments, FAQs, testimonials, legal pages, site-setting, home-page). Run after the schema seed when you want sample content.

## Prerequisites

1. Strapi project running with the ZdravLife schema applied (see `strapi-schema-export/` and `docs/STRAPI_APPLY_SCHEMA.md`).
2. Environment variables:
   - `STRAPI_URL` — e.g. `http://localhost:1337`
   - `STRAPI_API_TOKEN` — API token with create/update permission for the content types being seeded

## Run from project root

```powershell
# Schema bootstrap only (Site Setting + Home Page)
npm run strapi-seed

# Full dummy content (all steps, requires data/*.json)
npm run strapi-dummy-data
```

Or with tsx directly:

```powershell
npx tsx scripts/strapi-seed/run.ts
npx tsx scripts/strapi-seed/run-dummy-data.ts
```

## Order of steps

1. **01-categories** — From posts, videos, gallery (id + slug maps).
2. **02-tags** — From posts.
3. **03-authors** — From posts.
4. **04-faqs** — FAQs.
5. **05-testimonials** — Testimonials (authorName→name, content→quote).
6. **06-site-setting** — Single type from site-config.json.
7. **08-posts** — Posts (author, category, tags relations).
8. **09-videos** — Videos (category by slug).
9. **10-gallery** — Gallery items (category by slug).
10. **11-product-categories** — From products.
11. **12-products** — Products (category; no media/tags in seed).
12. **13-reviews** — Reviews (product relation, approved=true).
13. **14-comments** — Comments (entityType + entitySlug from post id→slug).
14. **15-legal-pages** — Privacy, terms, shipping-returns (placeholder content).
15. **07-home-page** — Single type featured relations (posts, products, videos, gallery, testimonials).

## Idempotency

- Categories, tags, authors, product-categories, posts, videos, gallery, products: skip create if a document with the same slug already exists.
- FAQs, testimonials, reviews, comments: always create (not idempotent for re-runs).
- Site-setting and home-page: overwrite/update.

## Media

Image/media fields are not uploaded by these scripts. Use Phase 12 (media upload strategy) to upload logo, covers, product images, etc., and link them in Strapi.

## Troubleshooting

- **403 / Forbidden:** Check API token has create and update permissions for the relevant content types.
- **404 on single types:** Ensure you have opened and saved the single types (site-setting, home-page) once in Strapi Admin so they exist.
- **Relation errors:** Ensure seed order is respected (categories/tags/authors before posts, etc.).
