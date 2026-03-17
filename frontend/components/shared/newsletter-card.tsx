'use client';

import { useState } from 'react';
import { Mail, ArrowRight, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getLucideIcon } from '@/lib/lucide-icon';
import type { FormData } from '@/types';

interface NewsletterCardProps {
  form: FormData;
  siteName?: string;
  /** Identifies which form was used — stored in Strapi for segmentation */
  formSource?: string;
}

export function NewsletterCard({ form, siteName, formSource }: NewsletterCardProps) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const PillIcon = form.pillIcon ? getLucideIcon(form.pillIcon) : Mail;
  const ButtonIcon = form.buttonIcon ? getLucideIcon(form.buttonIcon) : ArrowRight;
  const pillLabel = form.pillLabel ?? 'Newsletter';
  const heading = form.heading ?? 'Join the System';
  const subheading = form.subheading ?? 'Get weekly insights on training, nutrition, and the pursuit of vitality. No spam, just value. Unsubscribe anytime.';
  const emailPlaceholder = form.emailPlaceholder ?? 'you@example.com';
  const buttonLabel = form.buttonLabel ?? 'Subscribe';
  const disclaimer = form.disclaimer ?? `By subscribing, you agree to receive emails from ${siteName || 'ZdravLife'}. Unsubscribe anytime.`;

  const hasBenefits = form.benefits && form.benefits.length > 0;
  const showName = !!form.namePlaceholder;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    const fd = new window.FormData(e.currentTarget);
    const email = (fd.get('email') as string)?.trim();
    const name = (fd.get('name') as string)?.trim() || undefined;

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          formSource: formSource || form.name || 'Unknown',
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error || 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }

      setStatus('success');
    } catch {
      setErrorMsg('Network error. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-background to-vitality/10 border p-6 sm:p-8 md:p-10 lg:p-12">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-vitality/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="relative grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            {PillIcon && <PillIcon className="h-4 w-4" />}
            {pillLabel}
          </div>
          <h2 className="text-heading-2 lg:text-heading-1 font-heading font-semibold mb-3">
            {heading}
          </h2>
          <p className="text-muted-foreground text-base lg:text-lg mb-5">
            {subheading}
          </p>

          {hasBenefits && (
            <ul className="space-y-2.5">
              {form.benefits!.map((benefit) => (
                <li key={benefit} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-card border rounded-xl p-5 sm:p-6 md:p-8">
          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-1">You&apos;re in!</h3>
              <p className="text-sm text-muted-foreground">Thanks for subscribing. Check your inbox soon.</p>
            </div>
          ) : (
            <>
              <form className="space-y-4" onSubmit={handleSubmit}>
                {showName && (
                  <div>
                    <label htmlFor="newsletter-name" className="block text-sm font-medium mb-2">
                      Name
                    </label>
                    <Input
                      id="newsletter-name"
                      name="name"
                      type="text"
                      placeholder={form.namePlaceholder}
                    />
                  </div>
                )}
                <div>
                  <label htmlFor="newsletter-email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <Input
                    id="newsletter-email"
                    name="email"
                    type="email"
                    required
                    placeholder={emailPlaceholder}
                  />
                </div>
                <Button type="submit" size="lg" className="w-full group" disabled={status === 'sending'}>
                  {status === 'sending' ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Subscribing...</>
                  ) : (
                    <>
                      {buttonLabel}
                      {ButtonIcon && (
                        <ButtonIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      )}
                    </>
                  )}
                </Button>
              </form>
              {status === 'error' && (
                <p className="text-xs text-destructive text-center mt-3">{errorMsg}</p>
              )}
              {disclaimer && (
                <p className="text-xs text-muted-foreground text-center mt-4">
                  {disclaimer}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
