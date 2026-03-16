'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, ArrowRight, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VideoPreviewModal } from '@/components/videos/video-preview-modal';
import { formatRelativeTime } from '@/lib/utils';
import type { VideoItem } from '@/types';

interface FeaturedVideosSectionClientProps {
  videos: VideoItem[];
  section?: { heading?: string; subheading?: string; viewAllLabel?: string; viewAllHref?: string };
}

export function FeaturedVideosSectionClient({ videos, section }: FeaturedVideosSectionClientProps) {
  const [featuredVideo, ...otherVideos] = videos;
  const heading = section?.heading ?? 'Latest Videos';
  const subheading = section?.subheading ?? 'Training tutorials, adventure vlogs, and deep dives.';
  const viewAllHref = section?.viewAllHref ?? '/videos';
  const viewAllLabel = section?.viewAllLabel ?? 'View All';
  const viewAllVideosLabel = 'View All Videos';

  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openVideo = (video: VideoItem) => {
    setSelectedVideo(video);
    setModalOpen(true);
  };

  return (
    <section className="section-padding">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-heading-2 font-heading font-semibold mb-2">
              {heading}
            </h2>
            <p className="text-muted-foreground">
              {subheading}
            </p>
          </div>
          <Button asChild variant="ghost" className="hidden sm:flex group">
            <Link href={viewAllHref}>
              {viewAllLabel}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Featured (left) video — full height */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group"
          >
            <button
              type="button"
              onClick={() => openVideo(featuredVideo)}
              className="block w-full h-full text-left"
            >
              <div className="relative h-full min-h-[300px] lg:h-[360px] rounded-xl overflow-hidden bg-card border group-hover:border-primary/50 transition-colors">
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
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-16 w-16 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="h-6 w-6 text-white ml-1" fill="white" />
                  </div>
                </div>
                <div className="absolute top-4 right-4 px-2 py-1 rounded bg-black/70 text-white text-xs font-medium">
                  {featuredVideo.duration}
                </div>
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
            </button>
          </motion.article>

          {/* Right side — scrollable list, matched height */}
          <div className="flex flex-col gap-4 max-h-[360px] overflow-y-auto scrollbar-thin pr-1 lg:h-[360px]">
            {otherVideos.map((video, index) => (
              <motion.article
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group shrink-0"
              >
                <button
                  type="button"
                  onClick={() => openVideo(video)}
                  className="block w-full text-left"
                >
                  <div className="flex gap-4 p-3 rounded-xl bg-card border hover:border-primary/50 transition-colors">
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
                </button>
              </motion.article>
            ))}
          </div>
        </div>

        <div className="mt-6 sm:hidden">
          <Button asChild variant="outline" className="w-full">
            <Link href={viewAllHref}>{viewAllVideosLabel}</Link>
          </Button>
        </div>
      </div>

      <VideoPreviewModal
        video={selectedVideo}
        open={modalOpen}
        onOpenChange={(v) => {
          setModalOpen(v);
          if (!v) setSelectedVideo(null);
        }}
      />
    </section>
  );
}
