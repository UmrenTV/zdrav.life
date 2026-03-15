# ZdravLife

**Engineer Your Vitality.**

A premium personal lifestyle brand website for **ZdravLife** (zdrav.life), built with Next.js, TypeScript, and Tailwind CSS. The brand sits at the intersection of **high-performance living**, **calisthenics and hypertrophy**, **nutrition and longevity**, **motorcycle travel and adventure**, and **software engineering**—combining discipline, systems thinking, and the pursuit of vitality with the freedom of the open road.

The site functions as a **premium lifestyle magazine**, **creator storefront**, **performance blog**, **adventure journal**, and **media hub**: editorial content, product catalog, videos, gallery, and content pillars (training, nutrition, philosophy, adventures) with full SEO, theme support, and an API-ready data layer.

---

## What This Website Is About

- **Brand**: ZdravLife — “Engineer your vitality.” Premium personal brand for a software engineer / creator / athlete / rider focused on body and mind mastery, calisthenics, nutrition, fasting, motorcycle travel, and systems thinking.
- **Audience**: People interested in high-performance living, training, nutrition, moto travel, discipline, and premium digital experiences.
- **Content pillars**: Training (calisthenics, hypertrophy), Nutrition (fasting, longevity), Adventures (moto travel, road stories), Philosophy (discipline, mindset), Lifestyle & Journal (routines, essays).
- **Commerce**: Product catalog (apparel, digital guides, accessories) with reviews and future-ready cart/checkout structure.
- **Media**: YouTube-style videos and Instagram-style gallery, with a central Media hub.

---

## Features

- **Modern tech stack**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Framer Motion
- **Premium design**: Custom palette, typography, light/dark theme, system preference detection
- **SEO**: Full metadata, structured data (article, product, video, FAQ, breadcrumb), sitemap, robots.txt
- **Blog**: Editorial blog with categories, tags, comments, related posts, category and tag landing pages
- **Shop**: Product catalog, filters, reviews, related products, product detail with tabs
- **Media**: Videos page, gallery page, Media hub aggregator
- **Content pillars**: Dedicated pages for Adventures, Nutrition, Training, Philosophy, Lifestyle, Journal
- **Search**: Site-wide search (posts, products, videos) with URL-based state
- **Legal & support**: Contact, FAQ, Privacy Policy, Terms of Service, Shipping & Returns
- **API-ready**: REST-style route handlers over JSON data; easy swap to CMS/e-commerce/API later

---

## Tech Stack

| Area        | Choice                          |
|------------|----------------------------------|
| Framework  | Next.js 14+ (App Router)         |
| Language   | TypeScript (strict)              |
| Styling    | Tailwind CSS 3.4+                |
| UI         | shadcn/ui + Radix UI             |
| Motion     | Framer Motion                    |
| Fonts      | Inter, Space Grotesk, JetBrains Mono |
| Icons      | Lucide React                     |

---

## Project Structure

```
zdravlife/
├── app/                      # Next.js App Router
│   ├── api/                  # API route handlers
│   ├── about/                # About page
│   ├── blog/                 # Blog index + [slug]
│   ├── categories/[slug]/    # Category landing pages
│   ├── tags/[slug]/          # Tag landing pages
│   ├── contact/              # Contact page
│   ├── search/               # Search page
│   ├── shop/                 # Shop index + [slug]
│   ├── videos/               # Videos page
│   ├── gallery/              # Gallery page
│   ├── media/                # Media hub
│   ├── adventures/           # Adventures pillar
│   ├── nutrition/            # Nutrition pillar
│   ├── training/             # Training pillar
│   ├── philosophy/           # Philosophy pillar
│   ├── lifestyle/            # Lifestyle pillar
│   ├── journal/              # Journal pillar
│   ├── faq/                  # FAQ page
│   ├── privacy-policy/       # Privacy policy
│   ├── terms/                # Terms of service
│   ├── shipping-returns/     # Shipping & returns
│   ├── layout.tsx
│   ├── page.tsx              # Homepage
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── ui/                   # Primitives (shadcn)
│   ├── layout/               # Navbar, Footer
│   ├── sections/             # Homepage & shared sections
│   ├── blog/                 # Blog components
│   ├── shop/                 # Shop components
│   ├── videos/               # Video components
│   ├── gallery/              # Gallery components
│   ├── search/               # Search form & results
│   └── contact/              # Contact form
├── lib/
│   ├── data/                 # Data access layer (services)
│   ├── seo/                  # Metadata & sitemap helpers
│   └── utils.ts
├── types/                    # TypeScript types
├── data/                     # JSON data
│   ├── posts.json
│   ├── products.json
│   ├── reviews.json
│   ├── comments.json
│   ├── videos.json
│   ├── youtube.json          # YouTube-style (future API)
│   ├── gallery.json
│   ├── instagram.json        # Instagram-style (future API)
│   ├── faqs.json
│   ├── testimonials.json
│   └── site-config.json
└── public/                   # Static assets
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm (or yarn/pnpm)

### Installation

```bash
git clone https://github.com/zdravlife/zdravlife-website.git
cd zdravlife-website
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
npm start
```

### Placeholder images (avoid 404s)

The site references many images (blog, products, gallery, videos, avatars). If you clone without assets, run:

```bash
npm run placeholders
```

This creates minimal placeholder JPGs for every path. See **IMAGES_NEEDED.md** for the full list; replace with real assets for production.

### Lint & type check

```bash
npm run lint
npm run type-check
```

---

## Data Architecture

Content is driven by JSON files in `/data`. The data layer in `lib/data/services.ts` abstracts reads so you can later replace them with a headless CMS, REST API, or database without changing page components.

| Data        | File              | Purpose                    |
|------------|-------------------|----------------------------|
| Posts      | `posts.json`      | Blog articles              |
| Products   | `products.json`   | Shop catalog               |
| Reviews    | `reviews.json`    | Product reviews            |
| Comments   | `comments.json`   | Post/video comments        |
| Videos     | `videos.json`     | YouTube-style videos       |
| YouTube    | `youtube.json`    | Same structure, API-ready  |
| Gallery    | `gallery.json`    | Image gallery              |
| Instagram  | `instagram.json`  | Instagram-style feed data  |
| FAQs       | `faqs.json`       | FAQ accordion              |
| Testimonials | `testimonials.json` | Homepage testimonials  |
| Site config | `site-config.json` | Global config            |

### Strapi (optional)

You can run the site against a **Strapi v5** CMS instead of JSON. Set:

- `STRAPI_URL` (e.g. `http://localhost:1337`)
- `STRAPI_API_TOKEN` (server-side; create in Strapi Admin → Settings → API Tokens)

Then all content (site settings, homepage, blog, shop, media, FAQs, testimonials, reviews, comments) is read from Strapi. The data layer lives in `lib/data/data-source.ts` and delegates to `lib/strapi/repositories` when Strapi is enabled.

- **Schema:** Copy `strapi-schema-export/` into your Strapi project (see `strapi-schema-export/README.md`).
- **Seed:** After applying the schema, run `npm run strapi-seed` (with `STRAPI_URL` and `STRAPI_API_TOKEN` set) to migrate `data/*.json` into Strapi.
- **Setup:** See `docs/STRAPI_SETUP.md` and `docs/STRAPI_PERMISSIONS_PLAN.md`.

### API routes

- `GET /api/posts`, `GET /api/posts/[slug]`
- `GET /api/products`, `GET /api/products/[slug]`
- `GET /api/categories?type=posts|products`
- `GET /api/tags`
- `GET /api/reviews?productId=xxx`
- `GET /api/comments?entityType=xxx&entityId=xxx`
- `GET /api/search?q=xxx&type=xxx`
- `GET /api/media?type=videos|gallery&...`

---

## Strapi CMS

To use **Strapi** as the CMS and database (blog, products, comments, etc.) and connect **Strapi MCP** in Cursor, see **[docs/STRAPI_SETUP.md](docs/STRAPI_SETUP.md)**. It covers:

- Creating and running a Strapi project
- Configuring Strapi MCP in Cursor (`~/.cursor/mcp.json`)
- Content types that mirror the app
- Next.js env vars (`STRAPI_URL`, `STRAPI_API_TOKEN`)
- Optional client in `lib/strapi/client.ts` for when you switch the data layer to Strapi

---

## Customization

- **Colors / theme**: `app/globals.css` (CSS variables)
- **Fonts**: `app/layout.tsx` (next/font)
- **SEO defaults**: `lib/seo/metadata.ts` and `data/site-config.json`

---

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history and recent additions (new routes, pillar pages, legal pages, data files, sitemap).

---

## License

MIT. See LICENSE file.

---

**Engineer Your Vitality.**  
Build strength. Master discipline. Ride further. Live deeper.
