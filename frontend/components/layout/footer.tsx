'use client';

import Link from 'next/link';
import { Youtube, Instagram, Twitter, Github } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSiteConfig } from '@/lib/context/site-config';
import { SiteBranding } from '@/components/layout/site-branding';

const socialIcons = { youtube: Youtube, instagram: Instagram, twitter: Twitter, github: Github } as const;

/** Fallback legal links when footerLegalLinks is not set in site settings */
const FALLBACK_LEGAL_LINKS: { label: string; href: string }[] = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Service', href: '/terms' },
];

export function Footer() {
  const siteConfig = useSiteConfig();
  const footerLinkGroups = siteConfig.footerLinkGroups ?? [];
  const legalLinks = (siteConfig.footerLegalLinks?.length ? siteConfig.footerLegalLinks : FALLBACK_LEGAL_LINKS) as { label: string; href: string }[];
  /** Social links from Site Settings (youtubeUrl, instagramUrl, twitterUrl, githubUrl, socialLinks) */
  const socialLinks = [
    siteConfig.links?.youtube && { icon: socialIcons.youtube, href: siteConfig.links.youtube, label: 'YouTube' },
    siteConfig.links?.instagram && { icon: socialIcons.instagram, href: siteConfig.links.instagram, label: 'Instagram' },
    siteConfig.links?.twitter && { icon: socialIcons.twitter, href: siteConfig.links.twitter, label: 'X' },
    siteConfig.links?.github && { icon: socialIcons.github, href: siteConfig.links.github, label: 'GitHub' },
  ].filter(Boolean) as { icon: typeof Youtube; href: string; label: string }[];

  return (
    <footer className="w-full max-w-full overflow-x-hidden bg-muted/50 border-t">
      <div className="container mx-auto w-full max-w-full min-w-0 px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Newsletter Section - from site settings */}
        <div className="mb-12 pb-12 border-b">
          <div className="max-w-xl">
            <h3 className="text-2xl font-heading font-semibold mb-2">
              {siteConfig.newsletterHeading || 'Join the System'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {siteConfig.newsletterText || 'Get weekly insights on training, nutrition, and the pursuit of vitality. No spam, just value.'}
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1"
                aria-label="Email for newsletter"
              />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
        </div>

        {/* Link columns: Brand (siteName, footerText, social) | Footer link groups */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 mb-12">
          {/* First column: logo + site name (accent from settings), footerText, social links */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
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

          {/* Footer link groups from Site Settings (footerLinkGroups) */}
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

        <Separator className="mb-8" />

        {/* Bottom Bar - legal links from site settings (footerLegalLinks) */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.name || 'ZdravLife'}. All rights reserved.
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
