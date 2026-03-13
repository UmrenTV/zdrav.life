'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, ArrowRight, Eye } from 'lucide-react';
import { getFeaturedVideos } from '@/lib/data/services';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatRelativeTime } from '@/lib/utils';

export async function FeaturedVideosSection() {
  const videos = await getFeaturedVideos(3);

  if (videos.length === 0) return null;

  const [featuredVideo, ...otherVideos] = videos;

  return (
    <section className="section-padding">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-heading-2 font-heading font-semibold mb-2">
              Latest Videos
            </h2>
            <p className="text-muted-foreground">
              Training tutorials, adventure vlogs, and deep dives.
            </p>
          </div>
          <Button asChild variant="ghost" className="hidden sm:flex group">
            <Link href="/videos">
              View All
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        {/* Videos Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Featured Video */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group lg:row-span-2"
          >
            <Link
              href={`https://youtube.com/watch?v=${featuredVideo.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-full"
            >
              <div className="relative h-full min-h-[300px] lg:min-h-full rounded-xl overflow-hidden bg-card border group-hover:border-primary/50 transition-colors">
                {/* Thumbnail */}
                <div className="absolute inset-0">
                  <Image
                    src={featuredVideo.thumbnail}
                    alt={featuredVideo.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                </div>

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-16 w-16 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="h-6 w-6 text-white ml-1" fill="white" />
                  </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute top-4 right-4 px-2 py-1 rounded bg-black/70 text-white text-xs font-medium">
                  {featuredVideo.duration}
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                  <Badge variant="secondary" className="mb-3">
                    {featuredVideo.category}
                  </Badge>
                  <h3 className="text-xl font-heading font-semibold text-white mb-2 group-hover:text-primary transition-colors">
                    {featuredVideo.title}
                  </h3>
                  <p className="text-white/70 text-sm line-clamp-2 mb-3">
                    {featuredVideo.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-white/60">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {featuredVideo.viewCount} views
                    </span>
                    <span>{formatRelativeTime(featuredVideo.publishedAt)}</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.article>

          {/* Other Videos */}
          <div className="grid gap-6">
            {otherVideos.map((video, index) => (
              <motion.article
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <Link
                  href={`https://youtube.com/watch?v=${video.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="flex gap-4 p-3 rounded-xl bg-card border hover:border-primary/50 transition-colors">
                    {/* Thumbnail */}
                    <div className="relative w-40 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="160px"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <Play className="h-8 w-8 text-white opacity-80 group-hover:opacity-100 transition-opacity" fill="white" />
                      </div>
                      <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-white text-[10px] font-medium">
                        {video.duration}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col justify-center min-w-0">
                      <Badge variant="secondary" className="w-fit mb-2">
                        {video.category}
                      </Badge>
                      <h3 className="font-heading font-semibold mb-1 group-hover:text-primary transition-colors line-clamp-2 text-sm">
                        {video.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {video.viewCount}
                        </span>
                        <span>{formatRelativeTime(video.publishedAt)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>

        {/* Mobile CTA */}
        <div className="mt-6 sm:hidden">
          <Button asChild variant="outline" className="w-full">
            <Link href="/videos">View All Videos</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
