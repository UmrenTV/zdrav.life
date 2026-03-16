'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Testimonial, SectionConfig } from '@/types';

interface TestimonialsSectionClientProps {
  testimonials: Testimonial[];
  section?: SectionConfig;
}

export function TestimonialsSectionClient({ testimonials, section }: TestimonialsSectionClientProps) {
  const heading = section?.heading ?? "What the Community Says";
  const subheading = section?.subheading ?? "Real stories from real people who've embraced the ZdravLife philosophy.";

  return (
    <section className="section-padding">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-heading-2 font-heading font-semibold mb-4">
            {heading}
          </h2>
          <p className="text-muted-foreground">
            {subheading}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.article
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative p-6 bg-card border rounded-xl"
            >
              {/* Quote Icon */}
              <Quote className="absolute top-6 right-6 h-8 w-8 text-primary/20" />

              {/* Rating */}
              {testimonial.rating && (
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating!
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Content */}
              <p className="text-foreground mb-6 leading-relaxed">
                &quot;{testimonial.content}&quot;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  {testimonial.authorAvatar && (
                    <AvatarImage
                      src={testimonial.authorAvatar}
                      alt={testimonial.authorName}
                    />
                  )}
                  <AvatarFallback>
                    {testimonial.authorName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-sm">
                    {testimonial.authorName}
                  </div>
                  {testimonial.authorTitle && (
                    <div className="text-xs text-muted-foreground">
                      {testimonial.authorTitle}
                    </div>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
