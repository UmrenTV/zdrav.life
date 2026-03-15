import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getProductBySlug, getRelatedProducts, getReviewsByProduct, getReviewSummary, getSiteConfig } from '@/lib/data/data-source';
import { generateMetadata as generateSEOMetadata, generateProductSchema } from '@/lib/seo/metadata';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductGallery } from '@/components/shop/product-gallery';
import { ProductInfo } from '@/components/shop/product-info';
import { ReviewSection } from '@/components/shop/review-section';
import { RelatedProducts } from '@/components/shop/related-products';
import { Check, Truck, Shield, RotateCcw } from 'lucide-react';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps) {
  const [product, config] = await Promise.all([getProductBySlug(params.slug), getSiteConfig()]);

  if (!product) {
    return generateSEOMetadata(
      { title: 'Product Not Found', description: 'The requested product could not be found.' },
      config
    );
  }

  return generateSEOMetadata(
    {
      title: product.title,
      description: product.shortDescription,
      keywords: product.tags,
      ogImage: product.images[0]?.url,
      ogType: 'product',
      canonicalUrl: `/shop/${product.slug}`,
    },
    config
  );
}

export async function generateStaticParams() {
  const { getAllProducts } = await import('@/lib/data/services');
  const products = await getAllProducts();
  
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const [relatedProducts, reviews, reviewSummary, config] = await Promise.all([
    getRelatedProducts(product.id, 4),
    getReviewsByProduct(product.id),
    getReviewSummary(product.id),
    getSiteConfig(),
  ]);

  const jsonLd = generateProductSchema(product, config);

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <a href="/" className="hover:text-foreground transition-colors">
              Home
            </a>
            <span>/</span>
            <a href="/shop" className="hover:text-foreground transition-colors">
              Shop
            </a>
            <span>/</span>
            <a
              href={`/shop?category=${product.category.slug}`}
              className="hover:text-foreground transition-colors"
            >
              {product.category.name}
            </a>
            <span>/</span>
            <span className="text-foreground truncate">{product.title}</span>
          </nav>

          {/* Product Grid */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Gallery */}
            <ProductGallery images={product.images} title={product.title} />

            {/* Info */}
            <ProductInfo product={product} reviewSummary={reviewSummary} />
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 mb-16 p-6 bg-muted/50 rounded-xl">
            <div className="flex items-center justify-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium hidden sm:inline">Free shipping over $100</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium hidden sm:inline">30-day returns</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <RotateCcw className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium hidden sm:inline">Satisfaction guaranteed</span>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="description" className="mb-16">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
              <TabsTrigger value="reviews">
                Reviews ({reviewSummary.totalReviews})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <div
                className="prose-custom max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </TabsContent>

            <TabsContent value="details" className="mt-6">
              <div className="max-w-2xl">
                <h3 className="font-heading font-semibold mb-4">Product Details</h3>
                <dl className="space-y-3">
                  {product.details.map((detail) => (
                    <div
                      key={detail.label}
                      className="flex justify-between py-2 border-b"
                    >
                      <dt className="text-muted-foreground">{detail.label}</dt>
                      <dd className="font-medium">{detail.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </TabsContent>

            <TabsContent value="shipping" className="mt-6">
              <div className="max-w-2xl">
                <h3 className="font-heading font-semibold mb-4">Shipping Information</h3>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    {product.shippingInfo.shippingTime}
                  </p>
                  {product.shippingInfo.freeShippingThreshold && (
                    <p className="text-muted-foreground">
                      Free shipping on orders over{' '}
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: product.currency,
                      }).format(product.shippingInfo.freeShippingThreshold)}
                      .
                    </p>
                  )}
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Returns Policy</h4>
                    <p className="text-sm text-muted-foreground">
                      {product.shippingInfo.returnsPolicy}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <ReviewSection
                reviews={reviews}
                reviewSummary={reviewSummary}
                productId={product.id}
              />
            </TabsContent>
          </Tabs>

          <Separator className="mb-16" />

          {/* Related Products */}
          <RelatedProducts products={relatedProducts} />
        </div>
      </div>
    </>
  );
}
