'use client';

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { VideoWhitebox } from '@/components/videos/video-whitebox';
import type { VideoItem } from '@/types';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface VideoPreviewModalProps {
  video: VideoItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VideoPreviewModal({ video, open, onOpenChange }: VideoPreviewModalProps) {
  if (!video) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        hideClose
        className="max-w-4xl p-0 gap-0 overflow-hidden max-h-[100dvh] sm:max-h-[95vh] overflow-y-auto bg-transparent border-none shadow-none"
      >
        <VisuallyHidden>
          <DialogTitle>{video.title}</DialogTitle>
        </VisuallyHidden>
        <VideoWhitebox video={video} onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
