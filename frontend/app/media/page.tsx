import Link from 'next/link';
import Image from 'next/image';
import { getFeaturedVideos, getFeaturedGalleryItems, getSiteConfig } from '@/lib/data/data-source';
import { generateMetadata as genMeta } from '@/lib/seo/metadata';
import { Button } from '@/components/ui/button';
import { Play, ArrowRight } from 'lucide-react';

export async function generateMetadata() {
  const config = await getSiteConfig();
  return genMeta(
    {
      title: 'Media',
      description: 'Videos, gallery, and social content from ZdravLife. Training, travel, and behind-the-scenes.',
      ogType: 'website',
    },
    config
  );
}

export default async function MediaPage() {
  const [videos, galleryItems, config] = await Promise.all([
    getFeaturedVideos(3),
    getFeaturedGalleryItems(6),
    getSiteConfig(),
  ]);

  return (
    <div className="pt-24 pb-16">
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="max-w-2xl mx-auto text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 mb-6">
            Media Hub
          </span>
          <h1 className="text-heading-1 font-heading font-bold mb-6">
            Videos & Gallery
          </h1>
          <p className="text-xl text-muted-foreground">
            Training tutorials, adventure vlogs, and moments from the road and the gym.
          </p>
        </div>
      </section>

      {/* Videos Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-heading-3 font-heading font-semibold">Latest Videos</h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/videos" className="flex items-center gap-2">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Link
              key={video.id}
              href={`https://youtube.com/watch?v=${video.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-xl overflow-hidden border bg-card hover:border-primary/50 transition-colors"
            >
              <div className="relative aspect-video">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                  <div className="h-14 w-14 rounded-full bg-primary/90 flex items-center justify-center">
                    <Play className="h-6 w-6 text-white ml-1" fill="white" />
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-xs">
                  {video.duration}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-heading font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                  {video.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{video.category}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Gallery Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-heading-3 font-heading font-semibold">Gallery</h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/gallery" className="flex items-center gap-2">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryItems.map((item) => (
            <Link
              key={item.id}
              href="/gallery"
              className="group block relative aspect-square rounded-xl overflow-hidden border bg-muted hover:border-primary/50 transition-colors"
            >
              <Image
                src={item.image}
                alt={item.caption || 'Gallery image'}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                <p className="text-white text-sm font-medium line-clamp-1">{item.caption || item.category}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center p-8 rounded-xl bg-muted/50 border">
          <p className="text-muted-foreground mb-4">
            Subscribe on YouTube for weekly videos. Follow on Instagram for daily glimpses.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild>
              <Link href={config.links?.youtube || 'https://youtube.com/@zdravlife'} target="_blank" rel="noopener noreferrer">
                YouTube
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={config.links?.instagram || 'https://instagram.com/zdravlife'} target="_blank" rel="noopener noreferrer">
                Instagram
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
