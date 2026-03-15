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

export async function getFeaturedVideos(limit: number): Promise<VideoItem[]> {
  const list = await getCollection('videos', {
    publicationState: 'live',
    sort: ['publishedAt:desc'],
    populate: VIDEO_POPULATE,
  });
  const videos = list.map((d) => mapStrapiVideoToVideo(d)).filter(Boolean) as VideoItem[];
  return videos.filter((v) => v.featured).slice(0, limit);
}

const GALLERY_POPULATE = ['image', 'thumbnail'];

export async function getAllGalleryItems(): Promise<GalleryItem[]> {
  const list = await getCollection('gallery-items', {
    publicationState: 'live',
    populate: GALLERY_POPULATE,
  });
  return list.map((d) => mapStrapiGalleryItemToGalleryItem(d)).filter(Boolean) as GalleryItem[];
}

export async function getFeaturedGalleryItems(limit: number): Promise<GalleryItem[]> {
  const list = await getCollection('gallery-items', {
    publicationState: 'live',
    populate: GALLERY_POPULATE,
  });
  const items = list.map((d) => mapStrapiGalleryItemToGalleryItem(d)).filter(Boolean) as GalleryItem[];
  return items.filter((i) => i.featured).slice(0, limit);
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

export async function getFeaturedTestimonials(limit: number): Promise<Testimonial[]> {
  const list = await getCollection('testimonials', {
    publicationState: 'live',
    populate: TESTIMONIAL_POPULATE,
  });
  const testimonials = list.map((d) => mapStrapiTestimonialToTestimonial(d)).filter(Boolean) as Testimonial[];
  return testimonials.filter((t) => t.featured).slice(0, limit);
}
