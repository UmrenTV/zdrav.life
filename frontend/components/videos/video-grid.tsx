'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { VideoWhitebox } from '@/components/videos/video-whitebox';
import { formatRelativeTime } from '@/lib/utils';
import type { VideoItem } from '@/types';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface VideoGridProps {
  videos: VideoItem[];
}

export function VideoGrid({ videos }: VideoGridProps) {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  if (videos.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">No videos found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video, index) => (
          <motion.article
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <button
              type="button"
              onClick={() => setSelectedVideo(video)}
              className="block group w-full text-left"
            >
              <div className="bg-card border rounded-xl overflow-hidden hover:border-primary/50 transition-colors">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-14 w-14 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="h-5 w-5 text-white ml-1" fill="white" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/70 text-white text-xs font-medium">
                    {video.duration}
                  </div>
                  {video.featured && (
                    <div className="absolute top-3 left-3">
                      <Badge variant="default">Featured</Badge>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <Badge variant="secondary" className="mb-2">
                    {video.category}
                  </Badge>
                  <h3 className="font-heading font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                    {video.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {video.viewCount} views
                    </span>
                    <span>{formatRelativeTime(video.publishedAt)}</span>
                  </div>
                </div>
              </div>
            </button>
          </motion.article>
        ))}
      </div>

      <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
        <DialogContent
          hideClose
          className="max-w-4xl p-0 gap-0 overflow-hidden max-h-[100dvh] sm:max-h-[95vh] overflow-y-auto bg-transparent border-none shadow-none"
        >
          <VisuallyHidden>
            <DialogTitle>{selectedVideo?.title ?? 'Video'}</DialogTitle>
          </VisuallyHidden>
          {selectedVideo && (
            <VideoWhitebox
              video={selectedVideo}
              onClose={() => setSelectedVideo(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
