# ZdravLife

**Engineer Your Vitality**

A premium personal lifestyle brand website built with Next.js, TypeScript, and Tailwind CSS. This is a production-grade, SEO-optimized, and highly scalable website for the ZdravLife brand at the intersection of high-performance living, calisthenics, motorcycle travel, and software engineering.

## Features

- **Modern Tech Stack**: Next.js 14+ with App Router, TypeScript, Tailwind CSS
- **Premium Design System**: Custom color palette, typography, and component library
- **Theme Support**: Light/Dark mode with system preference detection
- **SEO Optimized**: Full metadata architecture, structured data, sitemap, robots.txt
- **Blog System**: Editorial-grade blog with categories, tags, comments
- **E-commerce Ready**: Product catalog, reviews, cart architecture
- **Media Hub**: YouTube videos, Instagram gallery
- **Animations**: Framer Motion for smooth, premium interactions
- **API Ready**: Route handlers prepared for future CMS/e-commerce integration

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 3.4+
- **UI Components**: shadcn/ui + Radix UI primitives
- **Animations**: Framer Motion
- **Fonts**: Inter (body), Space Grotesk (headings), JetBrains Mono (code)
- **Icons**: Lucide React

## Project Structure

```
zdravlife/
├── app/                    # Next.js App Router
│   ├── api/               # API route handlers
│   ├── blog/              # Blog pages
│   ├── shop/              # E-commerce pages
│   ├── about/             # About page
│   ├── videos/            # Videos page
│   ├── gallery/           # Gallery page
│   ├── faq/               # FAQ page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── sitemap.ts         # Sitemap generator
│   └── robots.ts          # Robots.txt generator
├── components/            # React components
│   ├── ui/               # UI primitives (shadcn)
│   ├── layout/           # Layout components
│   ├── sections/         # Page sections
│   ├── blog/             # Blog components
│   ├── shop/             # Shop components
│   ├── videos/           # Video components
│   └── gallery/          # Gallery components
├── lib/                   # Utility functions
│   ├── data/             # Data access layer
│   ├── seo/              # SEO utilities
│   └── utils.ts          # General utilities
├── types/                 # TypeScript types
├── data/                  # JSON data files
├── public/                # Static assets
└── styles/                # Global styles
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/zdravlife/zdravlife-website.git
cd zdravlife-website
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

## Data Architecture

The project uses a JSON-based data layer that can be easily swapped for a real API:

- **Posts**: `/data/posts.json`
- **Products**: `/data/products.json`
- **Reviews**: `/data/reviews.json`
- **Comments**: `/data/comments.json`
- **Videos**: `/data/videos.json`
- **Gallery**: `/data/gallery.json`
- **FAQs**: `/data/faqs.json`
- **Testimonials**: `/data/testimonials.json`

### API Routes

All data is accessible via RESTful API routes:

- `GET /api/posts` - List posts
- `GET /api/posts/[slug]` - Get single post
- `GET /api/products` - List products
- `GET /api/products/[slug]` - Get single product
- `GET /api/reviews?productId=xxx` - Get product reviews
- `GET /api/comments?entityType=xxx&entityId=xxx` - Get comments
- `GET /api/search?q=xxx` - Search content
- `GET /api/media?type=videos|gallery` - Get media

## Customization

### Colors

Edit the CSS variables in `app/globals.css`:

```css
:root {
  --primary: 221 83% 53%;
  --background: 210 40% 98%;
  --foreground: 222 47% 11%;
  /* ... */
}
```

### Fonts

Fonts are configured in `app/layout.tsx`:

```tsx
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });
```

### SEO

Update site configuration in `data/site-config.json` and SEO helpers in `lib/seo/metadata.ts`.

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Deploy

### Other Platforms

```bash
npm run build
# Export static files to `dist` folder
```

## Future Integrations

The architecture is designed for easy integration with:

- **Headless CMS**: Contentful, Sanity, Strapi
- **E-commerce**: Shopify, Stripe
- **Database**: Supabase, PostgreSQL
- **Auth**: NextAuth.js, Clerk
- **Search**: Algolia, Meilisearch
- **Newsletter**: ConvertKit, Mailchimp
- **Analytics**: Plausible, Fathom, Google Analytics

## License

MIT License - see LICENSE file for details.

## Credits

Built with passion by Zdrav.

---

**Engineer Your Vitality.**
