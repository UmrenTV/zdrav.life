# ZdravLife Strapi — Public Read Policy & Content Exposure Plan

**Phase 3 deliverable.** Use this after the schema is created (Phase 2).

---

## 1. Permissions matrix

| Content type     | Public find | Public findOne | Public create | Public update | Public delete | Notes                          |
|------------------|-------------|----------------|---------------|---------------|---------------|---------------------------------|
| site-setting     | ✅          | ✅             | ❌            | ❌            | ❌            | Single type; read-only          |
| home-page        | N/A         | ✅             | ❌            | ❌            | ❌            | Single type; read-only          |
| author           | ✅          | ✅             | ❌            | ❌            | ❌            |                                |
| category         | ✅          | ✅             | ❌            | ❌            | ❌            |                                |
| tag              | ✅          | ✅             | ❌            | ❌            | ❌            |                                |
| post             | ✅          | ✅             | ❌            | ❌            | ❌            | Filter by publishedAt in API    |
| video            | ✅          | ✅             | ❌            | ❌            | ❌            | Filter by publishedAt           |
| gallery-item     | ✅          | ✅             | ❌            | ❌            | ❌            | Filter by publishedAt           |
| product-category | ✅          | ✅             | ❌            | ❌            | ❌            |                                |
| product          | ✅          | ✅             | ❌            | ❌            | ❌            |                                |
| faq              | ✅          | ✅             | ❌            | ❌            | ❌            |                                |
| legal-page       | ✅          | ✅             | ❌            | ❌            | ❌            |                                |
| testimonial      | ✅          | ✅             | ❌            | ❌            | ❌            |                                |
| review           | ✅*         | ✅*            | ❌            | ❌            | ❌            | *Only approved; filter in API   |
| comment          | ✅*         | ✅*            | ❌            | ❌            | ❌            | *Only approved; filter in API   |
| contact-submission (optional) | ❌  | ❌             | ❌            | ❌            | ❌            | No public access; Next.js writes only |

---

## 2. Recommended API exposure strategy

### What the Next.js app calls directly from Strapi (with API token)

- **GET** `site-setting`, `home-page` (single types: no filters).
- **GET** `authors`, `categories`, `tags`, `posts`, `videos`, `gallery-items`, `product-categories`, `products`, `faqs`, `legal-pages`, `testimonials` with:
  - `populate` as needed (e.g. author, category, tags, coverImage).
  - For **posts**, **videos**, **gallery-items**: use `publicationState=live` or filter `publishedAt` not null so only published entries are returned.
- **GET** `reviews`: only where `approved = true` (use `filters[approved][$eq]=true`).
- **GET** `comments`: only where `status = approved` and filter by `entityType` + `entitySlug` (use `filters[entityType][$eq]=...` and `filters[entitySlug][$eq]=...`).

### What must NOT be exposed to public / client

- **Create/Update/Delete** on any content type from the browser. The Next.js app must use a **server-side API token** (e.g. `STRAPI_API_TOKEN`) so only the Next.js server can call Strapi with elevated permissions if ever needed (e.g. for internal tools). For normal reads, a token with **find/findOne** only is enough.
- **Review creation**: do not allow public POST to Strapi reviews. Use Next.js API route that validates input, then uses server-side token to create the review (e.g. with `approved: false`) or forward to Strapi.
- **Comment creation**: same as reviews — Next.js API route validates/sanitizes, then POST to Strapi with server-side token; new comments use `status: pending`.
- **Contact submissions**: if you add `contact-submission`, only the Next.js server should POST to it; no public create permission.

---

## 3. Manual admin steps

1. **Strapi Admin → Settings → Users & Permissions → Roles → Public**
   - For each of: **Author**, **Category**, **Tag**, **Post**, **Video**, **Gallery-item**, **Product-category**, **Product**, **FAQ**, **Legal-page**, **Testimonial**:
     - Enable **find** and **findOne**.
     - Leave **create**, **update**, **delete** disabled.
   - For **Site-setting** and **Home-page** (single types): enable **find** and **findOne** only.
   - For **Review** and **Comment**: enable **find** and **findOne** only (frontend will filter by `approved` / `status` in queries).
   - Do **not** enable any create/update/delete for Public.

2. **API token for Next.js (server-side)**
   - Create an API token (e.g. “ZdravLife Next.js”) with:
     - **Full access** for content types you need to read (or custom role with find/findOne on all the above).
     - **Comment**: enable **find**, **findOne**, and **create** so the Next.js API route can create comments (new comments appear in Strapi Admin; approve via **commentStatus**).
     - If you will use Next.js to create reviews/contact from the server: add **create** (and possibly **update**) only for **review**, and optionally **contact-submission**.
   - Store the token in `STRAPI_API_TOKEN` and never expose it to the client. If new comments do not appear in Strapi Admin, ensure the token has **create** on **Comment**.

3. **CORS**
   - In Strapi, allow your Next.js origin (e.g. `http://localhost:3000`, `https://zdrav.life`) so that server-side requests from Next.js are allowed. If all Strapi calls are made from the Next.js server only, CORS is less critical but still set correctly for admin.

---

## 4. Summary

- **Public read** covers site-setting, home-page, author, category, tag, post, video, gallery-item, product-category, product, faq, legal-page, testimonial; and approved reviews/comments only (enforced by query filters).
- **No public write** for any content type; moderation-sensitive writes (reviews, comments, contact) go through Next.js server-side handlers that call Strapi with a server-side token.
- **Next.js** uses `STRAPI_URL` + `STRAPI_API_TOKEN` for all Strapi requests; keep token server-only and use populate/filters for efficient, safe reads.
