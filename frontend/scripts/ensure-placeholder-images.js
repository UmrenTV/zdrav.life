/**
 * Creates all image paths referenced by the site with a minimal valid JPG
 * so the app runs without 404s. Replace with real assets later.
 * Run: node scripts/ensure-placeholder-images.js
 * (from project root)
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');

// Minimal valid 1x1 pixel JPEG (binary)
const MINIMAL_JPEG = Buffer.from(
  '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oADAMBEQACEQADAPwA/9k=',
  'base64'
);

const IMAGE_PATHS = [
  'images/blog/fasting-protocol.jpg',
  'images/blog/balkan-journey.jpg',
  'images/blog/balkan-1.jpg',
  'images/blog/balkan-2.jpg',
  'images/blog/balkan-3.jpg',
  'images/blog/calisthenics-system.jpg',
  'images/blog/discipline-systems.jpg',
  'images/blog/supplement-stack.jpg',
  'images/blog/one-arm-pullup.jpg',
  'images/products/hoodie-black-1.jpg',
  'images/products/hoodie-black-2.jpg',
  'images/products/hoodie-navy-1.jpg',
  'images/products/tee-white-1.jpg',
  'images/products/tee-black-1.jpg',
  'images/products/sticker-pack-1.jpg',
  'images/products/sticker-pack-2.jpg',
  'images/products/guide-cover.jpg',
  'images/products/guide-preview.jpg',
  'images/products/fasting-guide-cover.jpg',
  'images/products/oap-guide-cover.jpg',
  'images/products/journal-1.jpg',
  'images/products/journal-2.jpg',
  'images/products/discipline-tee-1.jpg',
  'images/products/discipline-tee-2.jpg',
  'images/gallery/balkan-sunset.jpg',
  'images/gallery/balkan-sunset-thumb.jpg',
  'images/gallery/morning-training.jpg',
  'images/gallery/morning-training-thumb.jpg',
  'images/gallery/hornet-mountain-road.jpg',
  'images/gallery/hornet-mountain-road-thumb.jpg',
  'images/gallery/breaking-fast.jpg',
  'images/gallery/breaking-fast-thumb.jpg',
  'images/gallery/nature-hike.jpg',
  'images/gallery/nature-hike-thumb.jpg',
  'images/gallery/one-arm-pushup.jpg',
  'images/gallery/one-arm-pushup-thumb.jpg',
  'images/gallery/canyon-view.jpg',
  'images/gallery/canyon-view-thumb.jpg',
  'images/gallery/workspace.jpg',
  'images/gallery/workspace-thumb.jpg',
  'images/gallery/front-lever.jpg',
  'images/gallery/front-lever-thumb.jpg',
  'images/gallery/camping-sunrise.jpg',
  'images/gallery/camping-sunrise-thumb.jpg',
  'images/gallery/handstand-practice.jpg',
  'images/gallery/handstand-practice-thumb.jpg',
  'images/gallery/behind-scenes.jpg',
  'images/gallery/behind-scenes-thumb.jpg',
  'images/videos/day-in-life-thumb.jpg',
  'images/videos/balkan-adventure-thumb.jpg',
  'images/videos/oap-tutorial-thumb.jpg',
  'images/videos/gym-cancel-thumb.jpg',
  'images/videos/fasting-meals-thumb.jpg',
  'images/videos/home-gym-thumb.jpg',
  'images/videos/moto-camping-thumb.jpg',
  'images/videos/front-lever-thumb.jpg',
  'images/videos/handstand-thumb.jpg',
  'images/videos/supplements-thumb.jpg',
  'images/author-avatar.jpg',
  'images/og-default.jpg',
  'images/about-portrait.jpg',
  'images/avatars/marcus.jpg',
  'images/avatars/sarah.jpg',
  'images/avatars/alex.jpg',
  'images/avatars/chris.jpg',
  'images/avatars/michael.jpg',
  'images/avatars/thomas.jpg',
  'images/avatars/marcus-chen.jpg',
  'images/avatars/elena-rodriguez.jpg',
  'images/avatars/david-park.jpg',
  'images/avatars/sarah-mitchell.jpg',
  'images/avatars/james-wilson.jpg',
  'images/avatars/ana-kowalski.jpg',
  'images/avatars/thomas-berg.jpg',
  'images/avatars/lisa-chang.jpg',
  'images/avatars/daniel.jpg',
  'images/avatars/robert.jpg',
  'images/avatars/jason.jpg',
  'images/avatars/kevin.jpg',
  'images/avatars/brian.jpg',
];

function ensurePlaceholderImages() {
  let created = 0;
  for (const rel of IMAGE_PATHS) {
    const fullPath = path.join(PUBLIC, rel);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(fullPath)) {
      fs.writeFileSync(fullPath, MINIMAL_JPEG);
      created++;
      console.log('Created:', rel);
    }
  }
  console.log('Done. Created', created, 'placeholder image(s).');
}

ensurePlaceholderImages();
