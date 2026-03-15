import { generateMetadata as genMeta } from '@/lib/seo/metadata';
import { getSiteConfig } from '@/lib/data/data-source';
import Link from 'next/link';
import { Truck, RotateCcw, Package } from 'lucide-react';

export async function generateMetadata() {
  const config = await getSiteConfig();
  return genMeta(
    {
      title: 'Shipping & Returns',
      description: 'Shipping options, delivery times, and returns policy for ZdravLife products.',
      ogType: 'website',
    },
    config
  );
}

export default async function ShippingReturnsPage() {
  const config = await getSiteConfig();
  const contactEmail = config.author?.email || 'hello@zdrav.life';
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-foreground transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-foreground">Shipping & Returns</span>
        </nav>

        <h1 className="text-heading-1 font-heading font-bold mb-8">Shipping & Returns</h1>

        <div className="space-y-12">
          <section className="flex gap-4">
            <div className="shrink-0 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Truck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-heading-4 font-heading font-semibold mb-4">Shipping</h2>
              <p className="text-muted-foreground mb-4">
                We ship worldwide. Standard delivery times are typically 3–5 business days (EU) and 5–10 business days (international). Exact times depend on your location and the carrier.
              </p>
              <p className="text-muted-foreground">
                Free shipping may be available on orders over a certain threshold (see product pages or cart for details). Shipping costs are calculated at checkout.
              </p>
            </div>
          </section>

          <section className="flex gap-4">
            <div className="shrink-0 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-heading-4 font-heading font-semibold mb-4">Order Processing</h2>
              <p className="text-muted-foreground">
                Orders are processed within 1–2 business days. You will receive a confirmation email with tracking information once your order ships.
              </p>
            </div>
          </section>

          <section className="flex gap-4">
            <div className="shrink-0 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <RotateCcw className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-heading-4 font-heading font-semibold mb-4">Returns</h2>
              <p className="text-muted-foreground mb-4">
                We offer a 30-day hassle-free return policy on physical products. Items must be unworn and in original condition with tags attached. Digital products (e.g. guides) may be non-refundable once accessed.
              </p>
              <p className="text-muted-foreground mb-4">
                To start a return, contact us at {contactEmail} with your order details. We will provide a return label or instructions. Refunds are processed within 5–10 business days after we receive the returned item.
              </p>
            </div>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t">
          <Link href="/faq" className="text-primary hover:underline">FAQ</Link>
          <span className="text-muted-foreground mx-2">·</span>
          <Link href="/contact" className="text-primary hover:underline">Contact</Link>
          <span className="text-muted-foreground mx-2">·</span>
          <Link href="/shop" className="text-primary hover:underline">Shop</Link>
        </div>
      </div>
    </div>
  );
}
