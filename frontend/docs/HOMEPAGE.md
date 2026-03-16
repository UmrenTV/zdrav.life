# Home Page – Structure & Content Analysis

This document describes every section on the home page: HTML structure, hardcoded texts, data sources, and how they map to a Strapi-driven schema. No layout or styling is changed; only content is made editable from Strapi.

---

## Page structure (order)

1. **Hero**
2. **Featured Content** (blog posts – 1 large + 2 small)
3. **Pillars** (6 cards)
4. **About Preview** (image + copy + stats + CTA)
5. **Featured Videos** (1 large + 2 small) – feature-flagged
6. **Gallery Strip** (horizontal scroll) – feature-flagged
7. **Featured Blog** (3 cards) – feature-flagged
8. **Featured Shop** (4 product cards) – feature-flagged
9. **Testimonials** (2x2 grid)
10. **Newsletter** (form + benefits)
11. **CTA Banner** (heading, subheading, 2 buttons)

Feature flags come from site config (`features.videos`, `features.gallery`, `features.blog`, `features.shop`). Section visibility is unchanged; only copy and relations are driven by Strapi.

---

## Section 1: Hero

**File:** `components/sections/hero-section.tsx`

**Structure:**
- Full-viewport section, centered content, background gradient and grid overlay.
- **Pill/badge:** single line, small, rounded, primary-style.
- **Main headline:** two lines; first line default (foreground) color, second line gradient (accent).
- **Subheadline:** one or two sentences, muted, max-width.
- **CTA row:** 3 buttons (primary, outline, secondary) with optional icon left or right.
- **Stats row:** 3 items, each: big number + small label.
- **Scroll indicator:** fixed at bottom (no copy).

**Content (current):**

| Element           | Type   | Current value |
|------------------|--------|----------------|
| Pill             | string | "Software Engineer & Problem Solver" |
| Heading line 1   | string | "Engineer Your" (foreground) |
| Heading line 2   | string | "Vitality" (gradient/accent) |
| Subheading      | text   | "Build strength. Master discipline. Ride further. Live deeper.\nA software engineer's journey into high-performance living." |
| Button 1        | label  | "Explore the Blog" | href | /blog | icon | ArrowRight (right) |
| Button 2        | label  | "Watch the Journey" | href | /videos | icon | Play (left) |
| Button 3        | label  | "Shop the Brand" | href | /shop | icon | ShoppingBag (left) |
| Stat 1          | value  | "50K+" | label | "Subscribers" |
| Stat 2          | value  | "100+" | label | "Videos" |
| Stat 3          | value  | "5K+" | label | "Community" |

**Schema (natural language):**
- `hero.pillText`: string
- `hero.headingWhite`: string (first line)
- `hero.headingAccent`: string (second line, gradient)
- `hero.subheading`: text (multiline)
- `hero.buttons`: repeatable component: `label`, `href`, `icon` (Lucide name), `iconPosition` (enum: "left" | "right")
- `hero.stats`: repeatable component: `value` (string), `label` (string)

---

## Section 2: Featured Content

**Files:** `featured-content-section.tsx` (server), `featured-content-section-client.tsx` (client)

**Data:** Posts from `getFeaturedPosts(3)`. Content (title, excerpt, category, date, reading time) is from API; only section titles and CTA are copy.

**Structure:**
- Section header: heading (h2) + subheading (p).
- Desktop: "View All" link with ArrowRight (right).
- Grid: 1 large featured post card + 2 smaller post cards. Card content = post data (category badge, title, excerpt, date, reading time).
- Mobile: "View All Articles" button.

**Content (current):**

| Element        | Type   | Current value |
|----------------|--------|----------------|
| Heading        | string | "Featured Content" |
| Subheading     | string | "Deep dives into training, nutrition, and the pursuit of excellence." |
| View All label | string | "View All" (desktop link) |
| Mobile CTA     | string | "View All Articles" |

**Schema:**
- `sectionFeaturedContent.heading`: string
- `sectionFeaturedContent.subheading`: string
- `sectionFeaturedContent.viewAllLabel`: string (optional, default "View All")
- `sectionFeaturedContent.viewAllHref`: string (optional, default "/blog")
- Content: existing relation `featuredPosts` (order = display order).

---

## Section 3: Pillars

**File:** `components/sections/pillars-section.tsx`

**Structure:**
- Section header: heading (h2) + subheading (p), centered, max-width.
- Grid of 6 cards. Each card: icon (in primary box), title (h3), description (p), link (href). Hover: gradient overlay by `color` (Tailwind gradient class name).

**Content (current):**

| Card   | icon        | title       | description | href        | color (hover) |
|--------|-------------|------------|--------------|-------------|----------------|
| 1      | Dumbbell    | Training   | Calisthenics, hypertrophy... | /training   | from-blue-500/20 to-cyan-500/20 |
| 2      | Utensils    | Nutrition  | Fasting protocols... | /nutrition  | from-green-500/20 to-emerald-500/20 |
| 3      | Bike        | Adventures | Motorcycle journeys... | /adventures | from-orange-500/20 to-amber-500/20 |
| 4      | Brain       | Philosophy | Discipline, mindset... | /philosophy | from-purple-500/20 to-violet-500/20 |
| 5      | Video       | Videos     | Training tutorials... | /videos     | from-red-500/20 to-rose-500/20 |
| 6      | ShoppingBag | Shop       | Premium apparel... | /shop       | from-primary/20 to-vitality/20 |

Section header:
- Heading: "Explore the Pillars"
- Subheading: "A comprehensive approach to high-performance living. Each pillar represents a key area of focus in the pursuit of vitality."

**Schema:**
- `pillars.heading`: string
- `pillars.subheading`: string
- `pillars.items`: repeatable: `icon` (string, Lucide name), `title`, `description`, `href`, `colorKey` (string, e.g. "blue", "green", "orange", "purple", "red", "primary" – frontend maps to existing gradient classes).

---

## Section 4: About Preview

**File:** `components/sections/about-preview-section.tsx`

**Not the same as the /about page.** This is a homepage block: image, stats card, copy, icon labels, one CTA.

**Structure:**
- Two columns (image left, content right; on small screens stacked).
- **Left:** Image (aspect 4/5), optional overlay. Floating stats card (3 items: value + label). Decorative blurs.
- **Right:** Eyebrow with icon: "About {siteName}" (siteName from site config). Two-line heading: line 1 default, line 2 gradient "Vitality Architect". Rich text block (3 paragraphs). Row of 3 icon+text items (Engineering, Training, Adventure). One button with icon (e.g. "Read My Story" + ArrowRight).

**Content (current):**

| Element          | Type   | Current value |
|------------------|--------|----------------|
| Image            | media  | /images/about-portrait.jpg (alt: "Zdrav - Software Engineer & Athlete") |
| Image stats 1   | value  | "5+" | label | "Years Training" |
| Image stats 2   | value  | "100K+" | label | "Lines of Code" |
| Image stats 3   | value  | "50K+" | label | "KM Ridden" |
| Eyebrow          | string | "About {siteName}" (icon: Code) – can be template or fixed "About" + siteName from config |
| Heading line 1   | string | "Software Engineer by Day." |
| Heading accent   | string | "Vitality Architect" (gradient) |
| Heading line 2   | string | "by Choice." |
| Paragraph 1      | text   | "I'm a software engineer who approaches health and fitness..." |
| Paragraph 2      | text   | "{siteName} is the intersection of my passions..." |
| Paragraph 3      | text   | "This isn't about being perfect. It's about being consistent..." |
| IconText 1       | icon   | Code | text | "Engineering" |
| IconText 2       | icon   | Dumbbell | text | "Training" |
| IconText 3       | icon   | Bike | text | "Adventure" |
| Button label     | string | "Read My Story" |
| Button href      | string | /about |
| Button icon      | string | ArrowRight (right) |

**Schema:**
- `aboutPreview.image`: media (single)
- `aboutPreview.imageAlt`: string
- `aboutPreview.imageStats`: repeatable: `value`, `label`
- `aboutPreview.eyebrow`: string (or leave "About" + siteName in code)
- `aboutPreview.headingLine1`: string
- `aboutPreview.headingAccent`: string
- `aboutPreview.headingLine2`: string
- `aboutPreview.description`: rich text (blocks)
- `aboutPreview.iconTexts`: repeatable: `icon` (Lucide), `text`
- `aboutPreview.buttonLabel`: string
- `aboutPreview.buttonHref`: string
- `aboutPreview.buttonIcon`: string (optional)

---

## Section 5: Featured Videos

**Files:** `featured-videos-section.tsx`, `featured-videos-section-client.tsx`

**Data:** `getFeaturedVideos(3)`. Card content (title, thumbnail, category, duration, view count, date) from API.

**Copy only:**
- Heading: "Latest Videos"
- Subheading: "Training tutorials, adventure vlogs, and deep dives."
- View All: "View All" (desktop), "View All Videos" (mobile)

**Schema:**
- `sectionVideos.heading`: string
- `sectionVideos.subheading`: string
- `sectionVideos.viewAllLabel`: string
- `sectionVideos.viewAllHref`: string (default /videos)
- Content: relation `featuredVideos`.

---

## Section 6: Gallery Strip

**Files:** `gallery-strip-section.tsx`, `gallery-strip-section-client.tsx`

**Data:** `getFeaturedGalleryItems(8)`. Cards show image, category, caption, location from API.

**Copy only:**
- Heading: "Life in Frames"
- Subheading: "Training, travel, and everything in between."
- View All: "View Gallery" (desktop + mobile)

**Schema:**
- `sectionGallery.heading`: string
- `sectionGallery.subheading`: string
- `sectionGallery.viewAllLabel`: string
- Content: relation `featuredGalleryItems`.

---

## Section 7: Featured Blog (From the Journal)

**Files:** `featured-blog-section.tsx`, `featured-blog-section-client.tsx`

**Data:** `getLatestPosts(3)` (or featured from home relation). Card content from posts.

**Copy only:**
- Heading: "From the Journal"
- Subheading: "Thoughts on training, nutrition, discipline, and the pursuit of excellence."
- View All: "Read All" (desktop), "Read All Articles" (mobile)

**Schema:**
- `sectionBlog.heading`: string
- `sectionBlog.subheading`: string
- `sectionBlog.viewAllLabel`: string
- `sectionBlog.viewAllHref`: string
- Content: relation `featuredPosts` (or keep current data source).

---

## Section 8: Featured Shop

**Files:** `featured-shop-section.tsx`, `featured-shop-section-client.tsx`

**Data:** `getFeaturedProducts(4)`. Card content from products.

**Copy only:**
- Heading: "Shop the Brand"
- Subheading: "Premium apparel, digital guides, and gear for the pursuit of vitality."
- View All: "View All" (desktop), "View All Products" (mobile)

**Schema:**
- `sectionShop.heading`: string
- `sectionShop.subheading`: string
- `sectionShop.viewAllLabel`: string
- Content: relation `featuredProducts`.

---

## Section 9: Testimonials

**Files:** `testimonials-section.tsx`, `testimonials-section-client.tsx`

**Data:** `getFeaturedTestimonials(4)`. Card content (quote, author, avatar, rating) from API.

**Copy only:**
- Heading: "What the Community Says"
- Subheading: "Real stories from real people who've embraced the ZdravLife philosophy."

**Schema:**
- `sectionTestimonials.heading`: string
- `sectionTestimonials.subheading`: string
- Content: relation `featuredTestimonials`.

---

## Section 10: Newsletter

**File:** `components/sections/newsletter-section.tsx`

**Structure:**
- Pill/badge: icon (Mail) + "Newsletter".
- Heading (h2), subheading (p).
- Bullet list with Check icon per item.
- Form: Name, Email, Subscribe button (with ArrowRight). Footer line: "By subscribing, you agree to receive emails from {siteName}. Unsubscribe anytime." (siteName from config; form HTML stays as-is.)

**Content (current):**

| Element    | Type   | Current value |
|-----------|--------|----------------|
| Pill icon | Mail   | + label "Newsletter" |
| Heading   | string | "Join the System" |
| Subheading| string | "Get weekly insights on training, nutrition, and the pursuit of vitality. No spam, just value. Unsubscribe anytime." |
| Benefits  | list   | "Weekly training insights and protocols", "Exclusive content and early access", "Nutrition tips and fasting strategies", "Adventure stories and ride logs", "Product drops and special offers" |

**Schema:**
- `newsletter.pillIcon`: string (Lucide) – optional
- `newsletter.pillLabel`: string
- `newsletter.heading`: string
- `newsletter.subheading`: text
- `newsletter.benefits`: repeatable component or repeatable text: single field `text` per item. Form stays static.

---

## Section 11: CTA Banner

**File:** `components/sections/cta-banner-section.tsx`

**Structure:**
- Full-width block, primary background, primary-foreground text. Grid pattern and circles (decorative).
- Heading (h2), subheading (p).
- Two buttons: primary = "Start Reading" (secondary variant) + ArrowRight; secondary = "Learn More" (outline variant). The outline button currently has low contrast (black on black / white on white) and must be fixed in CSS.

**Content (current):**

| Element     | Type   | Current value |
|------------|--------|----------------|
| Heading    | string | "Ready to Engineer Your Vitality?" |
| Subheading | string | "Start your journey today. Explore the blog, watch the videos, or join the community of like-minded individuals pursuing excellence." |
| Button 1   | label  | "Start Reading" | href | /blog | icon | ArrowRight (right) |
| Button 2   | label  | "Learn More" | href | /about | (no icon) |

**Schema:**
- `cta.heading`: string
- `cta.subheading`: text
- `cta.primaryButton.label`: string
- `cta.primaryButton.href`: string
- `cta.primaryButton.icon`: string (optional)
- `cta.secondaryButton.label`: string
- `cta.secondaryButton.href`: string
- `cta.secondaryButton.icon`: string (optional)

**Bug:** Second button uses `variant="outline"` and `border-primary-foreground/30 hover:bg-primary-foreground/10` on a primary background, so text/background are same tone. Fix: use a visible outline and text color (e.g. border and text that contrast with primary-foreground on both light and dark).

---

## Summary: Strapi home-page single type

**Existing:** `hero` (layout.hero), `featuredPosts`, `featuredProducts`, `featuredVideos`, `featuredGalleryItems`, `featuredTestimonials`, `homepageSeo`.

**New/updated:**

- **Hero:** Replace or extend with home-hero component: `pillText`, `headingWhite`, `headingAccent`, `subheading`, `buttons[]` (label, href, icon, iconPosition), `stats[]` (value, label).
- **Section labels (each optional):** `sectionFeaturedContent`, `sectionPillars`, `sectionAboutPreview`, `sectionVideos`, `sectionGallery`, `sectionBlog`, `sectionShop`, `sectionTestimonials` – each: `heading`, `subheading`, `viewAllLabel` (and `viewAllHref` where applicable).
- **Pillars:** `pillars` component: `heading`, `subheading`, `items[]` (icon, title, description, href, colorKey).
- **About preview:** `aboutPreview` component: image, imageAlt, imageStats[], eyebrow, headingLine1, headingAccent, headingLine2, description (richtext), iconTexts[], buttonLabel, buttonHref, buttonIcon.
- **Newsletter:** `newsletter` component: pillLabel, pillIcon, heading, subheading, benefits[] (text).
- **CTA:** `cta` component: heading, subheading, primaryButton (label, href, icon), secondaryButton (label, href, icon).

Relations for featured content stay as they are. When a section label is empty in Strapi, fall back to current hardcoded default so behaviour and layout stay the same.
