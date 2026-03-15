import { generateMetadata as genMeta } from '@/lib/seo/metadata';
import { getSiteConfig } from '@/lib/data/data-source';
import { Mail, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ContactForm } from '@/components/contact/contact-form';

export async function generateMetadata() {
  const config = await getSiteConfig();
  return genMeta(
    {
      title: 'Contact',
      description: 'Get in touch with ZdravLife. Questions about training, products, or collaborations? Reach out.',
      ogType: 'website',
    },
    config
  );
}

export default async function ContactPage() {
  const config = await getSiteConfig();
  const contactEmail = config.author?.email || 'hello@zdrav.life';
  return (
    <div className="pt-24 pb-16">
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="max-w-2xl mx-auto text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 mb-6">
            Get in Touch
          </span>
          <h1 className="text-heading-1 font-heading font-bold mb-6">
            Let&apos;s Connect
          </h1>
          <p className="text-xl text-muted-foreground">
            Questions about training, products, or collaborations? I read every message.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div>
            <h2 className="text-heading-3 font-heading font-semibold mb-4">
              Send a message
            </h2>
            <p className="text-muted-foreground mb-8">
              Use the form for general inquiries, partnership ideas, or feedback. I typically respond within 48 hours.
            </p>
            <ContactForm contactEmail={config.author?.email} />
          </div>
          <div>
            <h2 className="text-heading-3 font-heading font-semibold mb-4">
              Other ways to reach me
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border">
                <Mail className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <span className="font-medium block">Email</span>
                  <a href={`mailto:${contactEmail}`} className="text-primary hover:underline">
                    {contactEmail}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border">
                <MessageSquare className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <span className="font-medium block">Community</span>
                  <p className="text-muted-foreground text-sm">
                    Join the conversation on YouTube comments or socials. Links in the footer.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
