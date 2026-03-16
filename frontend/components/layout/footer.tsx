'use client';

import Link from 'next/link';
import { Youtube, Instagram, Twitter, Github, Mail, Check, ArrowRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSiteConfig } from '@/lib/context/site-config';
import { SiteBranding } from '@/components/layout/site-branding';
import { getLucideIcon } from '@/lib/lucide-icon';

const socialIcons = { youtube: Youtube, instagram: Instagram, twitter: Twitter, github: Github } as const;

const FALLBACK_LEGAL_LINKS: { label: string; href: string }[] = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Service', href: '/terms' },
];

export function Footer() {
  const siteConfig = useSiteConfig();
  const footerLinkGroups = siteConfig.footerLinkGroups ?? [];
  const legalLinks = (siteConfig.footerLegalLinks?.length ? siteConfig.footerLegalLinks : FALLBACK_LEGAL_LINKS) as { label: string; href: string }[];
  const form = siteConfig.footerForm;
  const showNewsletter = form != null && form.enabled;

  const socialLinks = [
    siteConfig.links?.youtube && { icon: socialIcons.youtube, href: siteConfig.links.youtube, label: 'YouTube' },
    siteConfig.links?.instagram && { icon: socialIcons.instagram, href: siteConfig.links.instagram, label: 'Instagram' },
    siteConfig.links?.twitter && { icon: socialIcons.twitter, href: siteConfig.links.twitter, label: 'X' },
    siteConfig.links?.github && { icon: socialIcons.github, href: siteConfig.links.github, label: 'GitHub' },
  ].filter(Boolean) as { icon: typeof Youtube; href: string; label: string }[];

  const PillIcon = form?.pillIcon ? getLucideIcon(form.pillIcon) : Mail;
  const ButtonIcon = form?.buttonIcon ? getLucideIcon(form.buttonIcon) : ArrowRight;
  const heading = form?.heading ?? 'Join the System';
  const subheading = form?.subheading ?? 'Get weekly insights on training, nutrition, and the pursuit of vitality.';
  const emailPlaceholder = form?.emailPlaceholder ?? 'Enter your email';
  const buttonLabel = form?.buttonLabel ?? 'Subscribe';
  const pillLabel = form?.pillLabel;
  const hasBenefits = form?.benefits && form.benefits.length > 0;
  const showName = !!form?.namePlaceholder;

  const lgCols = 1 + footerLinkGroups.length + (showNewsletter ? 2 : 0);

  return (
    <footer className="w-full max-w-full overflow-x-hidden bg-muted/50 border-t">
      <div className="container mx-auto w-full max-w-full min-w-0 px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div
          className="flex flex-col gap-8 lg:grid lg:gap-6 mb-12"
          style={{ gridTemplateColumns: `repeat(${lgCols}, minmax(0, 1fr))` }}
        >
          {/* Site info */}
          <div>
            <div className="mb-4">
              <SiteBranding siteConfig={siteConfig} size="footer" />
            </div>
            {(siteConfig.footerText ?? '').trim() ? (
              <p className="text-sm text-muted-foreground max-w-xs mb-4">{siteConfig.footerText}</p>
            ) : null}
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 rounded-lg bg-background border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link groups: 2-col sub-grid on mobile, "contents" on desktop */}
          {footerLinkGroups.length > 0 && (
            <div className="grid grid-cols-2 gap-8 lg:contents">
              {footerLinkGroups.map((group) => (
                <div key={group.title}>
                  <h4 className="font-semibold mb-4 text-sm">{group.title}</h4>
                  <ul className="space-y-2">
                    {group.links.map((link) => (
                      <li key={link.href + link.label}>
                        <Link
                          href={link.href}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Compact newsletter card */}
          {showNewsletter && (
            <div className="lg:col-span-2 rounded-xl border bg-gradient-to-br from-primary/5 via-background to-vitality/5 p-5 sm:p-6">
              {pillLabel && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
                  {PillIcon && <PillIcon className="h-3.5 w-3.5" />}
                  {pillLabel}
                </div>
              )}
              <h4 className="font-heading font-semibold text-base mb-1">
                {heading}
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                {subheading}
              </p>

              {hasBenefits && (
                <ul className="space-y-1.5 mb-4">
                  {form!.benefits!.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              )}

              <form
                className={showName
                  ? 'flex flex-col gap-2 sm:grid sm:grid-cols-[1fr_1fr_auto] sm:gap-2'
                  : 'flex gap-2'
                }
                onSubmit={(e) => e.preventDefault()}
              >
                {showName && (
                  <Input
                    type="text"
                    placeholder={form!.namePlaceholder}
                    className="h-9 text-sm"
                    aria-label="Name"
                  />
                )}
                <Input
                  type="email"
                  placeholder={emailPlaceholder}
                  className={showName ? 'h-9 text-sm' : 'flex-1 h-9 text-sm'}
                  aria-label="Email for newsletter"
                />
                <Button type="submit" size="sm" className="group shrink-0">
                  {buttonLabel}
                  {ButtonIcon && (
                    <ButtonIcon className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  )}
                </Button>
              </form>

              {form?.disclaimer && (
                <p className="text-xs text-muted-foreground mt-3">
                  {form.disclaimer}
                </p>
              )}
            </div>
          )}
        </div>

        <Separator className="mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {siteConfig.name || 'ZdravLife'}. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
