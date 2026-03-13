'use client';

import { motion } from 'framer-motion';
import { Mail, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const benefits = [
  'Weekly training insights and protocols',
  'Exclusive content and early access',
  'Nutrition tips and fasting strategies',
  'Adventure stories and ride logs',
  'Product drops and special offers',
];

export function NewsletterSection() {
  return (
    <section className="section-padding bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-background to-vitality/10 border p-8 md:p-12 lg:p-16"
        >
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-vitality/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Mail className="h-4 w-4" />
                Newsletter
              </div>
              <h2 className="text-heading-1 font-heading font-semibold mb-4">
                Join the System
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                Get weekly insights on training, nutrition, and the pursuit of
                vitality. No spam, just value. Unsubscribe anytime.
              </p>

              {/* Benefits List */}
              <ul className="space-y-3">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Form */}
            <div className="bg-card border rounded-xl p-6 md:p-8">
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label
                    htmlFor="newsletter-name"
                    className="block text-sm font-medium mb-2"
                  >
                    Name
                  </label>
                  <Input
                    id="newsletter-name"
                    type="text"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="newsletter-email"
                    className="block text-sm font-medium mb-2"
                  >
                    Email
                  </label>
                  <Input
                    id="newsletter-email"
                    type="email"
                    placeholder="you@example.com"
                  />
                </div>
                <Button type="submit" size="lg" className="w-full group">
                  Subscribe
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </form>
              <p className="text-xs text-muted-foreground text-center mt-4">
                By subscribing, you agree to receive emails from ZdravLife.
                Unsubscribe anytime.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
