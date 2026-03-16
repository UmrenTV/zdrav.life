'use client';

import { ExternalLink, Youtube, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CommentSection } from '@/components/shared/comment-section';
import { useSiteConfig } from '@/lib/context/site-config';
import type { VideoItem, Comment } from '@/types';

interface VideoWhiteboxProps {
  video: VideoItem;
  comments?: Comment[];
  onClose?: () => void;
}

export function VideoWhitebox({ video, comments, onClose }: VideoWhiteboxProps) {
  const siteConfig = useSiteConfig();
  const youtubeChannelUrl = siteConfig.links?.youtube || 'https://youtube.com';

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-card rounded-2xl border shadow-2xl overflow-hidden">
      {onClose && (
        <div className="flex items-center justify-end px-3 py-2 bg-card border-b">
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/90 text-white shadow-md transition-colors hover:bg-red-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="relative w-full aspect-video bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>

      <div className="p-6 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {video.category && (
            <Badge variant="secondary">{video.category}</Badge>
          )}
          {video.tags?.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              #{tag}
            </Badge>
          ))}
          {video.duration && (
            <span className="text-xs text-muted-foreground ml-auto">{video.duration}</span>
          )}
        </div>

        <h2 className="text-xl sm:text-2xl font-heading font-semibold">{video.title}</h2>

        {video.description && (
          <p className="text-muted-foreground text-sm">{video.description}</p>
        )}

        <div className="flex flex-wrap gap-3">
          <Button asChild variant="default" size="sm">
            <a
              href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Watch on YouTube
            </a>
          </Button>
          <Button asChild variant="outline" size="sm">
            <a href={youtubeChannelUrl} target="_blank" rel="noopener noreferrer">
              <Youtube className="h-4 w-4 mr-2" />
              YouTube Channel
            </a>
          </Button>
        </div>

        <Separator />

        <CommentSection
          entityType="video"
          entityId={video.slug || video.id}
          comments={comments}
          compact
        />
      </div>
    </div>
  );
}
