import { getLatestTestimonialsDs } from '@/lib/data/data-source';
import { TestimonialsSectionClient } from './testimonials-section-client';
import type { HomePageData } from '@/types';

export async function TestimonialsSection({ home }: { home?: HomePageData }) {
  const cfg = home?.sectionTestimonials;
  if (cfg?.enableSection === false) return null;

  const count = cfg?.latestCount ?? 4;
  const featuredOnly = cfg?.featuredOnly ?? true;

  const testimonials = await getLatestTestimonialsDs(count, featuredOnly);
  if (testimonials.length === 0) return null;
  return <TestimonialsSectionClient testimonials={testimonials} section={cfg} />;
}
