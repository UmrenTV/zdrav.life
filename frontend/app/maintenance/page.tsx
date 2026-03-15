import Link from 'next/link';
import { Construction, Youtube, Instagram, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSiteConfig } from '@/lib/data/data-source';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Under Construction',
  description: 'We’re cooking something great. Check back soon.',
  robots: { index: false, follow: true },
};

export default async function MaintenancePage() {
  const config = await getSiteConfig();
  const social = [
    { icon: Youtube, href: config.links?.youtube, label: 'YouTube' },
    { icon: Instagram, href: config.links?.instagram, label: 'Instagram' },
    { icon: Twitter, href: config.links?.twitter, label: 'X' },
  ].filter((s) => s.href);

  return (
    <div className="fixed inset-0 z-[100] flex min-h-screen flex-col items-center justify-center gap-8 bg-gradient-to-b from-background via-background to-muted/30 px-4">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="rounded-full border-4 border-primary/20 bg-primary/5 p-6">
          <Construction className="h-16 w-16 text-primary md:h-24 md:w-24" strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
            Under construction
          </h1>
          <p className="mt-2 max-w-md text-muted-foreground">
            We’re building something better. Check back soon — or stay in the loop below.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {social.map(({ icon: Icon, href, label }) => (
          <Button
            key={label}
            variant="outline"
            size="lg"
            className="gap-2"
            asChild
          >
            <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
              <Icon className="h-5 w-5" />
              {label}
            </a>
          </Button>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        Follow for updates and early access.
      </p>

      <Link href="/" className="mt-4">
        <Button variant="ghost" size="sm">
          Try home
        </Button>
      </Link>
    </div>
  );
}
