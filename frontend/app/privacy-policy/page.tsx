import { generateMetadata as genMeta } from '@/lib/seo/metadata';
import { getSiteConfig } from '@/lib/data/data-source';
import Link from 'next/link';

export async function generateMetadata() {
  const config = await getSiteConfig();
  return genMeta(
    {
      title: 'Privacy Policy',
      description: 'Privacy policy for ZdravLife. How we collect, use, and protect your data.',
      ogType: 'website',
    },
    config
  );
}

export default async function PrivacyPolicyPage() {
  const config = await getSiteConfig();
  const siteName = config.name || 'ZdravLife';
  const siteHost = config.url ? new URL(config.url).hostname : 'zdrav.life';
  const contactEmail = config.author?.email || 'hello@zdrav.life';
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">Privacy Policy</span>
        </nav>

        <h1 className="text-heading-1 font-heading font-bold mb-8">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-12">Last updated: {new Date().toLocaleDateString('en-US')}</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-heading-4 font-heading font-semibold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground">
              {siteName} (&quot;we&quot;, &quot;our&quot;) respects your privacy. This policy describes how we collect, use, and protect information when you use our website at {siteHost}.
            </p>
          </section>

          <section>
            <h2 className="text-heading-4 font-heading font-semibold mb-4">2. Information We Collect</h2>
            <p className="text-muted-foreground mb-4">
              We may collect information you provide directly (e.g. when you contact us, subscribe to the newsletter, or leave a comment), including name, email address, and message content. We also collect technical data such as IP address, browser type, and usage data via cookies or similar technologies where applicable.
            </p>
          </section>

          <section>
            <h2 className="text-heading-4 font-heading font-semibold mb-4">3. How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">
              We use collected information to respond to inquiries, send newsletters (with your consent), improve the website, and comply with legal obligations. We do not sell your personal data to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-heading-4 font-heading font-semibold mb-4">4. Cookies & Analytics</h2>
            <p className="text-muted-foreground mb-4">
              The site may use cookies for essential functionality and, if enabled, analytics to understand how visitors use the site. You can control cookie preferences via your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-heading-4 font-heading font-semibold mb-4">5. Data Retention & Security</h2>
            <p className="text-muted-foreground mb-4">
              We retain your data only as long as necessary for the purposes described. We implement appropriate technical and organizational measures to protect your data against unauthorized access or misuse.
            </p>
          </section>

          <section>
            <h2 className="text-heading-4 font-heading font-semibold mb-4">6. Your Rights</h2>
            <p className="text-muted-foreground mb-4">
              Depending on your jurisdiction, you may have the right to access, correct, delete, or port your data, or to object to or restrict processing. To exercise these rights or ask questions, contact us at {contactEmail}.
            </p>
          </section>

          <section>
            <h2 className="text-heading-4 font-heading font-semibold mb-4">7. Changes</h2>
            <p className="text-muted-foreground">
              We may update this policy from time to time. The &quot;Last updated&quot; date at the top will reflect the latest version. Continued use of the site after changes constitutes acceptance.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t">
          <Link href="/contact" className="text-primary hover:underline">Contact us</Link>
          <span className="text-muted-foreground mx-2">·</span>
          <Link href="/" className="text-primary hover:underline">Home</Link>
        </div>
      </div>
    </div>
  );
}
