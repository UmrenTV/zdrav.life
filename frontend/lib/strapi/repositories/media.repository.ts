/**
 * Videos, gallery items, FAQs, testimonials from Strapi. Use when isStrapiEnabled.
 */

import { getCollection } from '@/lib/strapi/client';
import {
  mapStrapiVideoToVideo,
  mapStrapiGalleryItemToGalleryItem,
  mapStrapiFaqToFaq,
  mapStrapiTestimonialToTestimonial,
} from '@/lib/strapi/mappers';
import type { VideoItem, GalleryItem, FAQ, Testimonial } from '@/types';

const VIDEO_POPULATE = ['thumbnail', 'category'];

export async function getAllVideos(): Promise<VideoItem[]> {
  const list = await getCollection('videos', {
    publicationState: 'live',
    sort: ['publishedAt:desc'],
    populate: VIDEO_POPULATE,
  });
  return list.map((d) => mapStrapiVideoToVideo(d)).filter(Boolean) as VideoItem[];
}

export async function getVideoBySlug(slug: string): Promise<VideoItem | null> {
  const list = await getCollection('videos', {
    publicationState: 'live',
    filters: { slug: { $eq: slug } },
    populate: [...VIDEO_POPULATE, 'tags'],
    pagination: { pageSize: 1 },
  });
  if (!list.length) return null;
  return mapStrapiVideoToVideo(list[0]) ?? null;
}

export async function getLatestVideos(limit: number, featuredOnly = false): Promise<VideoItem[]> {
  const list = await getCollection('videos', {
    publicationState: 'live',
    sort: ['publishedAt:desc'],
    populate: VIDEO_POPULATE,
  });
  let videos = list.map((d) => mapStrapiVideoToVideo(d)).filter(Boolean) as VideoItem[];
  if (featuredOnly) videos = videos.filter((v) => v.featured);
  return videos.slice(0, limit);
}

export async function getFeaturedVideos(limit: number): Promise<VideoItem[]> {
  return getLatestVideos(limit, true);
}

const GALLERY_POPULATE = ['image', 'thumbnail'];

export async function getAllGalleryItems(): Promise<GalleryItem[]> {
  const list = await getCollection('gallery-items', {
    publicationState: 'live',
    populate: GALLERY_POPULATE,
  });
  return list.map((d) => mapStrapiGalleryItemToGalleryItem(d)).filter(Boolean) as GalleryItem[];
}

export async function getLatestGalleryItems(limit: number, featuredOnly = false): Promise<GalleryItem[]> {
  const list = await getCollection('gallery-items', {
    publicationState: 'live',
    populate: GALLERY_POPULATE,
  });
  let items = list.map((d) => mapStrapiGalleryItemToGalleryItem(d)).filter(Boolean) as GalleryItem[];
  if (featuredOnly) items = items.filter((i) => i.featured);
  return items.slice(0, limit);
}

export async function getFeaturedGalleryItems(limit: number): Promise<GalleryItem[]> {
  return getLatestGalleryItems(limit, true);
}

export async function getAllFAQs(): Promise<FAQ[]> {
  const list = await getCollection('faqs');
  return list.map((d) => mapStrapiFaqToFaq(d)).filter(Boolean) as FAQ[];
}

const TESTIMONIAL_POPULATE = ['avatar'];

export async function getAllTestimonials(): Promise<Testimonial[]> {
  const list = await getCollection('testimonials', {
    publicationState: 'live',
    populate: TESTIMONIAL_POPULATE,
  });
  return list.map((d) => mapStrapiTestimonialToTestimonial(d)).filter(Boolean) as Testimonial[];
}

export async function getLatestTestimonials(limit: number, featuredOnly = false): Promise<Testimonial[]> {
  const list = await getCollection('testimonials', {
    publicationState: 'live',
    populate: TESTIMONIAL_POPULATE,
  });
  let testimonials = list.map((d) => mapStrapiTestimonialToTestimonial(d)).filter(Boolean) as Testimonial[];
  if (featuredOnly) testimonials = testimonials.filter((t) => t.featured);
  return testimonials.slice(0, limit);
}

export async function getFeaturedTestimonials(limit: number): Promise<Testimonial[]> {
  return getLatestTestimonials(limit, true);
}
