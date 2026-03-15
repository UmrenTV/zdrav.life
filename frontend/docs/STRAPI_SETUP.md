# Strapi CMS + MCP Setup for ZdravLife

This guide covers:

1. **Strapi MCP** – Connect Cursor IDE to Strapi (manage content from the editor).
2. **Strapi project** – Create and run Strapi as your CMS/database.
3. **Next.js** – Use Strapi as the data source for blog, products, comments, etc.

---

## Prerequisites

- **Node.js 18+** (20+ recommended for Strapi 5)
- **npm** or **pnpm**
- **Cursor** (for MCP) or any editor that supports MCP

---

## Part 1: Create and run Strapi

### 1.1 Create a Strapi project

Create Strapi in a sibling folder (or monorepo package) so it runs separately from the Next.js app:

```powershell
# From a folder of your choice (e.g. D:\Coding\Own)
npx create-strapi-app@latest zdravlife-cms --quickstart
cd zdravlife-cms
```

- `--quickstart` uses **SQLite** and opens the admin on first run. For production you’ll want PostgreSQL (see Strapi docs).
- If the command asks for a project name, use `zdravlife-cms`.

### 1.2 First run and admin user

```powershell
cd zdravlife-cms
npm run develop
```

- Strapi runs at **http://localhost:1337**
- On first open you’ll be asked to create the **first admin user** (email + password). Use real credentials; you’ll need them for MCP and for creating an API token.

### 1.3 Create an API token (for Next.js)

1. In Strapi admin: **Settings → API Tokens → Create new API Token**.
2. Name: e.g. `ZdravLife Next.js`.
3. Token type: **Full access** (or a custom role with read for the content types you use).
4. Copy the token and store it securely (e.g. in Next.js `.env.local`).

---

## Part 2: Strapi MCP (Cursor)

Strapi MCP lets Cursor (or other MCP clients) talk to your Strapi instance: list/create/update content types and entries, upload media, etc.

### 2.1 Install the MCP server (optional, for running manually)

```powershell
npm install -g strapi-mcp
# or in a folder you use for MCP tools:
npm install strapi-mcp
```

### 2.2 Cursor MCP configuration

1. Open (or create) the MCP config file:
   - **Windows:** `%USERPROFILE%\.cursor\mcp.json`
   - **Mac/Linux:** `~/.cursor/mcp.json`

2. Add the **strapi-mcp** server. If you already have other servers, add this block to the same JSON object:

```json
{
  "mcpServers": {
    "strapi-mcp": {
      "command": "npx",
      "args": ["strapi-mcp"],
      "env": {
        "STRAPI_URL": "http://localhost:1337",
        "STRAPI_ADMIN_EMAIL": "YOUR_STRAPI_ADMIN_EMAIL",
        "STRAPI_ADMIN_PASSWORD": "YOUR_STRAPI_ADMIN_PASSWORD"
      }
    }
  }
}
```

Replace:

- `YOUR_STRAPI_ADMIN_EMAIL` – email of the admin user you created in 1.2.
- `YOUR_STRAPI_ADMIN_PASSWORD` – that user’s password.

Optional env vars (see [strapi-mcp](https://github.com/l33tdawg/strapi-mcp)):

- `STRAPI_API_TOKEN` – optional fallback if you don’t want to use admin email/password (some features may need admin).
- `STRAPI_DEV_MODE=true` – for dev-only features.

3. **Restart Cursor** (or reload MCP) so it picks up the new server.

4. **Strapi must be running** (`npm run develop` in `zdravlife-cms`) when you use Strapi MCP tools in Cursor.

---

## Part 3: Content types in Strapi

Your Next.js app currently expects data shaped like the types in `types/index.ts`. In Strapi you create content types that mirror these. Below is a minimal mapping.

| Next.js / types        | Strapi content type | Notes |
|------------------------|---------------------|--------|
| **Post**               | `post`              | title, slug, excerpt, content (richtext), coverImage (media), category (relation), tags (relation), author (relation), featured (boolean), publishedAt, readingTime, status (enum: published/draft) |
| **Category (blog)**    | `category`          | name, slug, description, coverImage (optional) |
| **Tag**                | `tag`               | name, slug |
| **Author**             | `author`            | name, slug, bio, avatar (media), socialLinks (JSON or component) |
| **Product**            | `product`           | title, slug, description, shortDescription, images (media multiple), category (relation), price (decimal), compareAtPrice, ratingAverage, reviewCount, featured, stockStatus (enum), sku, details (JSON or component), shippingInfo (JSON or component) |
| **Product category**   | `product-category`  | name, slug, description, image (optional) |
| **Review**             | `review`            | product (relation), authorName, rating (integer 1–5), title, content, createdAt, verifiedPurchase, helpfulCount |
| **Comment**            | `comment`           | entityType (enum: post/video/adventure/gallery), entityId (text), parentId (optional, relation to comment), authorName, content, status (enum: approved/pending/spam), likes |
| **Video**              | `video`             | youtubeId, title, description, thumbnail (media), duration, publishedAt, viewCount, category, tags (JSON array), featured |
| **Gallery item**       | `gallery-item`      | image (media), caption, category (enum), location, takenAt, tags (JSON), featured |
| **FAQ**                | `faq`               | question, answer, category, order (integer) |
| **Testimonial**        | `testimonial`       | authorName, authorTitle, authorAvatar (media), content, rating, source (enum), featured |

You can create these in Strapi Admin → **Content-Type Builder**, or use Strapi MCP tools from Cursor (e.g. create content types and then create entries). Relations:

- **Post** → category (one), tags (many), author (one).
- **Product** → product-category (one).
- **Review** → product (one).
- **Comment** → optional parent comment (one) for threading.

After creating types, in **Settings → Users & Permissions → Roles → Public**: enable **find** and **findOne** for the content types the frontend needs. For create (e.g. comments/reviews) add **create** where appropriate.

---

## Part 4: Next.js – use Strapi as the data source

### 4.1 Environment variables

In the **Next.js** project (ZdravLife), add to `.env.local`:

```env
# Strapi CMS
STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_api_token_from_strapi_admin
```

- `STRAPI_URL` – Strapi URL (no trailing slash). Use the same in MCP so Cursor and Next.js point to the same instance.
- `STRAPI_API_TOKEN` – the token you created in 1.3.

Optional:

- `NEXT_PUBLIC_STRAPI_URL` – only if you need to call Strapi from the browser (e.g. client-side fetch). Usually you call from the server and only `STRAPI_URL` is needed.

### 4.2 Data layer swap

Your app currently reads from JSON in `lib/data/services.ts`. To use Strapi:

1. **Strapi client**  
   Add a small client that calls Strapi REST API (e.g. `lib/strapi/client.ts`):
   - Base URL from `process.env.STRAPI_URL`
   - Header: `Authorization: Bearer process.env.STRAPI_API_TOKEN`
   - Helpers: `getCollection(collectionName, params?)`, `getBySlug(collectionName, slug)`, etc., using Strapi’s `populate` and filters.

2. **Map Strapi responses to your types**  
   Strapi returns `{ data: { id, attributes: { ... } } }`. Write mappers (e.g. in `lib/strapi/mappers.ts`) from `attributes` + `id` to your existing `Post`, `Product`, `Comment`, etc. so the rest of the app stays unchanged.

3. **Switch services**  
   In `lib/data/services.ts`:
   - If `process.env.STRAPI_URL` is set: use the Strapi client + mappers.
   - Else: keep the current `loadJsonFile` logic (local JSON).

This keeps one code path for “CMS” and one for “local JSON” without duplicating page code.

### 4.3 Strapi REST API examples

- List posts: `GET {STRAPI_URL}/api/posts?populate=*` (or `populate=category,tags,author,coverImage`).
- One post by slug: `GET {STRAPI_URL}/api/posts?filters[slug][$eq]=my-slug&populate=*`.
- Products: `GET {STRAPI_URL}/api/products?populate=*`.
- Create comment: `POST {STRAPI_URL}/api/comments` with body `{ data: { entityType, entityId, authorName, content, ... } }`.

Use the same `STRAPI_URL` and `STRAPI_API_TOKEN` in Next.js and in MCP so Cursor and the site share one Strapi instance.

---

## Checklist

- [ ] Strapi project created (`zdravlife-cms`) and runs at http://localhost:1337  
- [ ] First admin user created in Strapi  
- [ ] API token created in Strapi and stored in Next.js `.env.local` as `STRAPI_API_TOKEN`  
- [ ] MCP config in `~/.cursor/mcp.json` with `STRAPI_URL`, `STRAPI_ADMIN_EMAIL`, `STRAPI_ADMIN_PASSWORD`  
- [ ] Cursor restarted; Strapi running when using MCP  
- [ ] Content types in Strapi (post, category, tag, author, product, product-category, review, comment, video, gallery-item, faq, testimonial)  
- [ ] Permissions set in Strapi for Public (and Authenticated if needed)  
- [ ] Next.js `STRAPI_URL` and `STRAPI_API_TOKEN` set; data layer updated to call Strapi when env is set  

---

## References

- [Strapi MCP (GitHub)](https://github.com/l33tdawg/strapi-mcp) – tools and env vars  
- [Strapi + Next.js (Strapi blog)](https://strapi.io/blog/getting-started-with-next-js-and-strapi-5-beginner-s-guide)  
- [Strapi REST API](https://docs.strapi.io/dev-docs/api/rest)  
- [Cursor MCP](https://cursor.com/help/customization/mcp) – where to put `mcp.json`
