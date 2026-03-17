import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MapPin, Calendar, Camera, LinkIcon, Tag, ExternalLink } from 'lucide-react';
import { getGalleryItemBySlug, getCommentsByEntity, getSiteConfig } from '@/lib/data/data-source';
import { generateMetadata as genMeta } from '@/lib/seo/metadata';
import { CommentSection } from '@/components/shared/comment-section';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

interface GalleryDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: GalleryDetailPageProps) {
  const [item, config] = await Promise.all([
    getGalleryItemBySlug(params.slug),
    getSiteConfig(),
  ]);
  if (!item) {
    return genMeta({ title: 'Image Not Found' }, config);
  }
  return genMeta(
    {
      title: item.caption || 'Gallery Image',
      description: [item.caption, item.location, item.category].filter(Boolean).join(' — '),
      ogImage: item.image || undefined,
    },
    config,
  );
}

export default async function GalleryDetailPage({ params }: GalleryDetailPageProps) {
  const item = await getGalleryItemBySlug(params.slug);
  if (!item) notFound();

  const comments = await getCommentsByEntity('gallery', item.slug || item.id);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link href="/gallery">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Gallery
          </Link>
        </Button>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Image */}
          <div className="relative bg-black rounded-xl overflow-hidden">
            <Image
              src={item.image}
              alt={item.caption || 'Gallery image'}
              width={1200}
              height={800}
              className="object-contain w-full max-h-[70vh]"
              priority
              sizes="(max-width: 1024px) 100vw, 896px"
            />
          </div>

          {/* Info */}
          <div className="space-y-4">
            {item.caption && (
              <h1 className="text-2xl sm:text-3xl font-heading font-semibold">{item.caption}</h1>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-muted-foreground">
              <div className="flex flex-wrap items-center gap-4">
                {item.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {item.location}
                  </span>
                )}
                {item.takenAt && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(item.takenAt)}
                  </span>
                )}
                <Link
                  href={`/gallery?category=${item.category}`}
                  className="inline-flex items-center gap-1 capitalize text-xs bg-muted px-2 py-0.5 rounded hover:bg-muted/70 transition-colors cursor-pointer"
                >
                  <Tag className="h-3 w-3" />
                  {item.category}
                </Link>
              </div>
            </div>

            {item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Taken by / Related to — these are real crawlable backlinks */}
            {(item.takenByLabel || item.relatedToLabel) && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm">
                {item.takenByLabel && item.takenByHref && (
                  <span className="flex items-center gap-1.5">
                    <Camera className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Taken by:</span>
                    <a
                      href={item.takenByHref}
                      target={item.takenByNewTab ? '_blank' : undefined}
                      rel={item.takenByNewTab ? 'noopener noreferrer' : undefined}
                      className="text-primary font-medium hover:underline"
                    >
                      {item.takenByLabel}
                    </a>
                  </span>
                )}
                {item.relatedToLabel && item.relatedToHref && (
                  <span className="flex items-center gap-1.5">
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Related to:</span>
                    <a
                      href={item.relatedToHref}
                      target={item.relatedToNewTab ? '_blank' : undefined}
                      rel={item.relatedToNewTab ? 'noopener noreferrer' : undefined}
                      className="text-primary font-medium hover:underline"
                    >
                      {item.relatedToLabel}
                    </a>
                  </span>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <Button asChild variant="outline" size="sm">
                <Link href="/gallery">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Browse Gallery
                </Link>
              </Button>
            </div>

            <Separator />

            <CommentSection
              entityType="gallery"
              entityId={item.slug || item.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
