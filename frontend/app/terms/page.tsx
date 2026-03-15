import { generateMetadata as genMeta } from '@/lib/seo/metadata';
import { getSiteConfig } from '@/lib/data/data-source';
import Link from 'next/link';

export async function generateMetadata() {
  const config = await getSiteConfig();
  return genMeta(
    {
      title: 'Terms of Service',
      description: 'Terms of service for using ZdravLife website and services.',
      ogType: 'website',
    },
    config
  );
}

export default async function TermsPage() {
  const config = await getSiteConfig();
  const siteName = config.name || 'ZdravLife';
  const siteHost = config.url ? new URL(config.url).hostname : 'zdrav.life';
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">Terms of Service</span>
        </nav>

        <h1 className="text-heading-1 font-heading font-bold mb-8">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-12">Last updated: {new Date().toLocaleDateString('en-US')}</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-heading-4 font-heading font-semibold mb-4">1. Acceptance</h2>
            <p className="text-muted-foreground">
              By accessing or using the {siteName} website ({siteHost}), you agree to these Terms of Service. If you do not agree, please do not use the site.
            </p>
          </section>

          <section>
            <h2 className="text-heading-4 font-heading font-semibold mb-4">2. Use of the Site</h2>
            <p className="text-muted-foreground mb-4">
              You may use the site for personal, non-commercial purposes. You agree not to misuse the site (e.g. spam, harassment, automated scraping, or distribution of malware). Content and advice on the site are for informational purposes; they are not professional medical, legal, or financial advice.
            </p>
          </section>

          <section>
            <h2 className="text-heading-4 font-heading font-semibold mb-4">3. Intellectual Property</h2>
            <p className="text-muted-foreground mb-4">
              Content on the site (text, images, design, branding) is owned by ZdravLife or its licensors. You may not copy, modify, or redistribute it without permission, except for limited personal use (e.g. sharing links).
            </p>
          </section>

          <section>
            <h2 className="text-heading-4 font-heading font-semibold mb-4">4. Products & Purchases</h2>
            <p className="text-muted-foreground mb-4">
              Any purchases are subject to the terms presented at checkout and our Shipping & Returns policy. We reserve the right to refuse or cancel orders and to change product availability and pricing.
            </p>
          </section>

          <section>
            <h2 className="text-heading-4 font-heading font-semibold mb-4">5. Limitation of Liability</h2>
            <p className="text-muted-foreground mb-4">
              The site is provided &quot;as is&quot;. To the fullest extent permitted by law, {siteName} is not liable for any indirect, incidental, or consequential damages arising from your use of the site or any content thereon.
            </p>
          </section>

          <section>
            <h2 className="text-heading-4 font-heading font-semibold mb-4">6. Changes</h2>
            <p className="text-muted-foreground">
              We may update these terms at any time. The &quot;Last updated&quot; date will reflect the latest version. Continued use of the site after changes constitutes acceptance.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t">
          <Link href="/contact" className="text-primary hover:underline">Contact us</Link>
          <span className="text-muted-foreground mx-2">·</span>
          <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>
          <span className="text-muted-foreground mx-2">·</span>
          <Link href="/" className="text-primary hover:underline">Home</Link>
        </div>
      </div>
    </div>
  );
}
