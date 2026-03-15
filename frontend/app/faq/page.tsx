import { getAllFAQs, getSiteConfig } from '@/lib/data/data-source';
import { generateMetadata as genMeta } from '@/lib/seo/metadata';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export async function generateMetadata() {
  const config = await getSiteConfig();
  return genMeta(
    {
      title: 'FAQ',
      description: 'Frequently asked questions about ZdravLife products, shipping, returns, and more.',
      ogType: 'website',
    },
    config
  );
}

export default async function FAQPage() {
  const [faqs, config] = await Promise.all([getAllFAQs(), getSiteConfig()]);
  const contactEmail = config.author?.email || 'hello@zdrav.life';
  const categories = Array.from(new Set(faqs.map((f) => f.category)));

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 mb-4">
            Support
          </span>
          <h1 className="text-heading-1 font-heading font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground">
            Find answers to common questions about products, shipping, returns, and more.
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="max-w-3xl mx-auto space-y-8">
          {categories.map((category) => {
            const categoryFaqs = faqs.filter((f) => f.category === category);
            
            return (
              <div key={category}>
                <h2 className="text-heading-4 font-heading font-semibold mb-4 capitalize">
                  {category}
                </h2>
                <Accordion type="single" collapsible className="space-y-2">
                  {categoryFaqs.map((faq) => (
                    <AccordionItem
                      key={faq.id}
                      value={faq.id}
                      className="border rounded-lg px-4 data-[state=open]:border-primary/50"
                    >
                      <AccordionTrigger className="text-left hover:no-underline py-4">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-4">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            );
          })}
        </div>

        {/* Contact CTA */}
        <div className="max-w-2xl mx-auto text-center mt-16 p-8 bg-muted/50 rounded-xl">
          <h2 className="text-heading-4 font-heading font-semibold mb-2">
            Still have questions?
          </h2>
          <p className="text-muted-foreground mb-4">
            Can't find the answer you're looking for? Feel free to reach out.
          </p>
          <a
            href={`mailto:${contactEmail}`}
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
