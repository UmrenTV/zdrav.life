# Images Required by the ZdravLife Website

All paths are relative to `public/`. The script `scripts/ensure-placeholder-images.js` creates these paths with a minimal placeholder JPG so the app runs without 404s. **Replace with real assets** (your own photos, AI-generated, or stock) for production.

---

## Blog (`public/images/blog/`)

| File | Used for |
|------|----------|
| `fasting-protocol.jpg` | Post: 20/4 Fasting Protocol |
| `balkan-journey.jpg` | Post: Balkan Motorcycle Journey |
| `balkan-1.jpg` | Post gallery |
| `balkan-2.jpg` | Post gallery |
| `balkan-3.jpg` | Post gallery |
| `calisthenics-system.jpg` | Post: Calisthenics Hypertrophy System |
| `discipline-systems.jpg` | Post: Discipline Over Motivation |
| `supplement-stack.jpg` | Post: Supplement Stack Longevity |
| `one-arm-pullup.jpg` | Post: One-Arm Pullup Roadmap |

**Suggested:** 1200×630 or 16:10 for covers; same aspect for gallery.

---

## Products (`public/images/products/`)

| File | Used for |
|------|----------|
| `hoodie-black-1.jpg` | Premium Hoodie – front |
| `hoodie-black-2.jpg` | Premium Hoodie – back |
| `hoodie-navy-1.jpg` | Premium Hoodie – navy |
| `tee-white-1.jpg` | Vitality Tee – white |
| `tee-black-1.jpg` | Vitality Tee – black |
| `sticker-pack-1.jpg` | Sticker pack |
| `sticker-pack-2.jpg` | Sticker pack layout |
| `guide-cover.jpg` | Calisthenics Mastery Guide |
| `guide-preview.jpg` | Guide preview |
| `fasting-guide-cover.jpg` | 20/4 Fasting Guide |
| `oap-guide-cover.jpg` | One-Arm Pullup Roadmap Guide |
| `journal-1.jpg` | Training Journal |
| `journal-2.jpg` | Journal interior |
| `discipline-tee-1.jpg` | Discipline Tee – front |
| `discipline-tee-2.jpg` | Discipline Tee – back |

**Suggested:** Square or 4:5 for products; 1200×630 for digital guide covers.

---

## Gallery (`public/images/gallery/`)

| File | Used for |
|------|----------|
| `balkan-sunset.jpg` | Travel – sunset |
| `balkan-sunset-thumb.jpg` | Thumbnail |
| `morning-training.jpg` | Training |
| `morning-training-thumb.jpg` | Thumbnail |
| `hornet-mountain-road.jpg` | Bike / road |
| `hornet-mountain-road-thumb.jpg` | Thumbnail |
| `breaking-fast.jpg` | Food |
| `breaking-fast-thumb.jpg` | Thumbnail |
| `nature-hike.jpg` | Nature |
| `nature-hike-thumb.jpg` | Thumbnail |
| `one-arm-pushup.jpg` | Training |
| `one-arm-pushup-thumb.jpg` | Thumbnail |
| `canyon-view.jpg` | Travel |
| `canyon-view-thumb.jpg` | Thumbnail |
| `workspace.jpg` | Lifestyle |
| `workspace-thumb.jpg` | Thumbnail |
| `front-lever.jpg` | Training |
| `front-lever-thumb.jpg` | Thumbnail |
| `camping-sunrise.jpg` | Travel |
| `camping-sunrise-thumb.jpg` | Thumbnail |
| `handstand-practice.jpg` | Training |
| `handstand-practice-thumb.jpg` | Thumbnail |
| `behind-scenes.jpg` | Behind the scenes |
| `behind-scenes-thumb.jpg` | Thumbnail |

**Suggested:** 800×800 or similar for full; 256px or 400px for thumbs.

---

## Videos (`public/images/videos/`)

| File | Used for |
|------|----------|
| `day-in-life-thumb.jpg` | Video thumbnail |
| `balkan-adventure-thumb.jpg` | Video thumbnail |
| `oap-tutorial-thumb.jpg` | Video thumbnail |
| `gym-cancel-thumb.jpg` | Video thumbnail |
| `fasting-meals-thumb.jpg` | Video thumbnail |
| `home-gym-thumb.jpg` | Video thumbnail |
| `moto-camping-thumb.jpg` | Video thumbnail |
| `front-lever-thumb.jpg` | Video thumbnail |
| `handstand-thumb.jpg` | Video thumbnail |
| `supplements-thumb.jpg` | Video thumbnail |

**Suggested:** 16:9, e.g. 640×360 or 1280×720.

---

## Avatars & global (`public/images/`)

| File | Used for |
|------|----------|
| `author-avatar.jpg` | Post author, comments, site config |
| `og-default.jpg` | Default OG image (layout, SEO) – **1200×630** |
| `about-portrait.jpg` | About page hero |
| `logo.png` | Optional: navbar/header logo |

---

## Review & testimonial avatars (`public/images/avatars/`)

| File | Used for |
|------|----------|
| `marcus.jpg` | Reviews |
| `sarah.jpg` | Reviews |
| `alex.jpg` | Reviews |
| `chris.jpg` | Reviews |
| `michael.jpg` | Reviews |
| `thomas.jpg` | Reviews |
| `marcus-chen.jpg` | Testimonials |
| `elena-rodriguez.jpg` | Testimonials |
| `david-park.jpg` | Testimonials |
| `sarah-mitchell.jpg` | Testimonials |
| `james-wilson.jpg` | Testimonials |
| `ana-kowalski.jpg` | Testimonials |
| `thomas-berg.jpg` | Testimonials |
| `lisa-chang.jpg` | Testimonials |
| `daniel.jpg` | Comments |
| `robert.jpg` | Comments |
| `jason.jpg` | Comments |
| `kevin.jpg` | Comments |
| `brian.jpg` | Comments |

**Suggested:** 100×100 or 200×200, square.

---

## Summary

- **Blog:** 9 images (6 covers + 3 gallery).
- **Products:** 15 images.
- **Gallery:** 24 images (12 full + 12 thumbs).
- **Videos:** 10 thumbnails.
- **Global:** author-avatar, og-default, about-portrait (and optional logo).
- **Avatars:** 19 (reviews, testimonials, comments).

**Total:** ~80+ image files. Run `node scripts/ensure-placeholder-images.js` to create placeholder JPGs for all of them so the site runs without 404s; then replace with real assets.
