# How to Apply the ZdravLife Schema in Strapi and Fix 404 / Missing Permissions

If you get **404** when running the seed, or you **don’t see Site setting, Category, Post, etc.** under **Settings → Users & Permissions → Roles → Public**, Strapi hasn’t loaded the content types. Follow these steps.

---

## 1. Check your Strapi version

The export is for **Strapi v5**. Check:

```powershell
cd path\to\your\strapi\project
npm list @strapi/strapi
```

Use v5 (e.g. 5.x). If you’re on v4, the schema format differs; either upgrade to v5 or we’d need a v4-compatible export.

---

## 2. Copy the schema **and** routes/controllers into the Strapi project (exact structure)

From the **zdrav.life** repo, copy into your **Strapi project** so that the **contents** of the export folders end up inside the Strapi `src` folder, **not** an extra `src` inside `src`.

**Why the "Application" section was missing:** Strapi's permission screen says: *"Only actions bound by a route are listed below."* If each API has only a `content-types/.../schema.json` and **no** `routes/` or `controllers/`, Strapi loads the types in Content Manager but **does not register any API routes**, so no permission entries appear and there is no **Application** section. The export now includes **routes** and **controllers** for every API; you must copy the **full** `src/api/` tree (including those files).

**Correct (recommended):**

- Copy **contents** of `zdrav.life/strapi-schema-export/src/components/`  
  → into `your-strapi-project/src/components/`  
  (so you get `shared/`, `layout/`, `product/` with their `.json` files)

- Copy **contents** of `zdrav.life/strapi-schema-export/src/api/`  
  → into `your-strapi-project/src/api/`  
  (so you get each API folder with **content-types/**, **routes/**, **controllers/**, and **services/** — e.g. `category/content-types/`, `category/routes/`, `category/controllers/`, `category/services/`).

**Wrong (causes “types not found”):**

- Copying the whole `strapi-schema-export/src` **folder** into Strapi’s `src`  
  → gives `your-strapi-project/src/src/api/...` and Strapi will **not** load those APIs.
- Copying only `content-types` and omitting `routes` and `controllers`
  → Content Manager shows the types, but **Settings → Roles → Public** will not show an **Application** section.

So after copying you should have for example:

- `your-strapi-project/src/api/category/content-types/category/schema.json`
- `your-strapi-project/src/api/category/routes/category.js`
- `your-strapi-project/src/api/category/controllers/category.js`
- `your-strapi-project/src/api/category/services/category.js`
- `your-strapi-project/src/api/site-setting/content-types/site-setting/schema.json`
- `your-strapi-project/src/components/shared/seo.json`
- etc.

---

## 3. Rebuild and restart Strapi

New APIs/components are only registered when Strapi builds and starts. In the **Strapi project** directory:

```powershell
npm run build
npm run develop
```

(Or `yarn build` / `yarn develop` if you use yarn.)

If the build fails, fix the reported errors (e.g. component not found, invalid attribute type). Once the build succeeds and you run `develop`, Strapi will load the new content types.

---

## 4. Confirm the content types appear in the admin

After Strapi is running:

1. Open the **left sidebar** in the admin panel.
2. Under **Content Manager** you should see:
   - **Collection types:** Category, Tag, Author, Post, Video, Gallery item, Product category, Product, Review, Comment, Testimonial, FAQ, Legal page
   - **Single types:** Site setting, Home page

If these **do not** appear, the schema is still not loaded (wrong paths, wrong Strapi version, or build errors). Re-check steps 1–3.

---

## 5. Set Public role permissions (find / findOne)

Only **after** the types appear in Content Manager:

1. Go to **Settings** (left sidebar).
2. Under **Users & Permissions**, open **Roles**.
3. Click **Public** (or the edit/pencil icon for the Public role).
4. On the permissions page you will see **several collapsible sections** (e.g. **Application**, Content-Manager, Email, **Users-permissions**, Media Library, etc.).
   - **Do not** only expand **“Users-permissions”** — that section only shows AUTH, PERMISSIONS, ROLE, USER (plugin-internal actions).
   - **Expand the “Application” section** (or similarly named section that lists your APIs). There you should see **Category**, **Post**, **Site setting**, **Home page**, Author, Tag, etc.
5. Under **Application**, for each of the ZdravLife types, enable:
   - **find**
   - **findOne**
6. Do **not** enable create, update, delete for Public.
7. Click **Save**.

Now the REST API will respond for those content types (e.g. `GET /api/categories`) and the seed script can run.

### If you don’t see an “Application” section or your content types

- **Scroll the page** — Application is often above or below “Users-permissions”.
- If **Application** (or your content types) still don’t appear:
  1. In your **Strapi project** folder, delete the **`build`** and **`.cache`** folders (PowerShell: `Remove-Item -Recurse -Force build, .cache`).
  2. Run `npm run build` then `npm run develop`.
  3. Open **Settings → Users & Permissions → Roles → Public** again — **Application** should then list Category, Post, Site setting, etc.
- **Most common cause:** Only `content-types/` was copied; **routes** and **controllers** were missing. Re-copy the full `strapi-schema-export/src/api/` (each API must have `routes/` and `controllers/` with the `.js` files), then clear `build` and `.cache`, rebuild and restart.

---

## 6. Run the seed again

From the **zdrav.life** project (where the seed script lives):

```powershell
pnpm run strapi-seed
```

---

## 7. Enabling Draft & Publish when the UI returns 400

If you enable **Draft & Publish** in Content-Type Builder (edit collection type → Advanced settings → tick Draft & Publish → Save) and get a generic "error occurred" with **400** on `POST /content-type-builder/update-schema`, the UI path is often failing for existing types or when data already exists.

**Workaround — enable via schema file:**

1. In your **Strapi project**, open the schema for the collection type, e.g.  
   `src/api/category/content-types/category/schema.json`
2. Set Draft & Publish in `options`:
   ```json
   "options": {
     "draftAndPublish": true
   }
   ```
3. Save the file, then in the Strapi project run:
   ```powershell
   npm run build
   npm run develop
   ```
4. Restart Strapi. The content type will now use Draft & Publish. Existing entries are usually treated as published; if any show as draft, open them in Content Manager and use **Publish** once.

To see the exact error from the UI, open DevTools → Network, trigger Save again, and inspect the response body of the `update-schema` request (400).

---

## Quick checklist

| Step | What to check |
|------|----------------|
| 1 | Strapi v5 |
| 2 | Each API has `content-types/`, `routes/`, `controllers/`, `services/` (e.g. `src/api/category/services/category.js`); `src/components/shared/...` exist (no extra `src/src`) |
| 3 | `npm run build` and `npm run develop` run without errors |
| 4 | Content Manager sidebar shows Category, Post, Site setting, etc. |
| 5 | Settings → Roles → Public shows those types; find + findOne enabled and saved |
| 6 | Seed runs without 404 |

If the types still don’t show after a correct copy and a successful build, check the terminal for schema/validation errors and your Strapi version; the export is aimed at **Strapi 5.x**.
