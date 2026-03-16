import { getFeaturedTestimonials } from '@/lib/data/data-source';
import { TestimonialsSectionClient } from './testimonials-section-client';
import type { HomePageData } from '@/types';

export async function TestimonialsSection({ home }: { home?: HomePageData }) {
  const testimonials = await getFeaturedTestimonials(4);
  if (testimonials.length === 0) return null;
  return <TestimonialsSectionClient testimonials={testimonials} section={home?.sectionTestimonials} />;
}
