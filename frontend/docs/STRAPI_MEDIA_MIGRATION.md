# Strapi media: serving images through Strapi

## Option A: Seed script (recommended)

The strapi-seed script **uploads images from `public/` to Strapi** and links them to content:

- **Posts:** `coverImage` + `gallery` from `data/posts.json` paths (e.g. `/images/blog/fasting-protocol.jpg` → file at `public/images/blog/fasting-protocol.jpg`).
- **Products:** `images[].url` → `featuredImage` (primary) + `gallery`.
- **Authors:** `author.avatar` → `avatar`.
- **Testimonials:** `authorAvatar` → `avatar`.

**Steps:**

1. Put your real image files under `public/images/` (blog, products, avatars, etc.) so paths in `data/posts.json`, `data/products.json`, `data/testimonials.json`, and posts’ `author.avatar` match (e.g. `/images/blog/my-cover.jpg` → `public/images/blog/my-cover.jpg`).
2. Start Strapi: `cd cms && npm run develop`.
3. From project root, run the seed (creates entries and uploads media):
   ```bash
   npm run strapi-seed
   ```
   Or with env from `.env`: ensure `STRAPI_URL` and `STRAPI_API_TOKEN` are set, then `npx tsx scripts/strapi-seed/run.ts`.

If an image path in data doesn’t exist under `public/`, the script logs a warning and skips that file; the entry is still created.

## Option B: Manual upload in Strapi Admin

- **Media Library:** Upload files in Strapi Admin, then edit each Post / Product / Author / Testimonial and attach the media to the correct field (coverImage, gallery, featuredImage, avatar).
- **Site setting:** Upload logo, favicon, default OG image in Media Library and set them in **Site setting** (single type).

## Frontend: how image URLs are built

- The app uses **`strapiMediaUrl()`** in mappers. When Strapi returns a media object (e.g. `{ url: '/uploads/...' }`), the URL is turned into an absolute URL using **`STRAPI_URL`** (server) or **`NEXT_PUBLIC_STRAPI_URL`** (client). Set **`STRAPI_URL`** in `.env` so server-rendered pages get correct image URLs; only set `NEXT_PUBLIC_STRAPI_URL` if you need to build image URLs in the browser.
- **Next.js Image:** `next.config.js` allows Strapi media via `remotePatterns` (localhost:1337 for dev). For production, add your Strapi host to `images.remotePatterns` if you use a different domain for Strapi.
