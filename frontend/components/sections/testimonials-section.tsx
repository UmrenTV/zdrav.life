import { getFeaturedTestimonials } from '@/lib/data/data-source';
import { TestimonialsSectionClient } from './testimonials-section-client';
export async function TestimonialsSection() {
  const testimonials = await getFeaturedTestimonials(4);

  if (testimonials.length === 0) return null;

  return <TestimonialsSectionClient testimonials={testimonials} />;
}
