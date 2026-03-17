'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, MapPin, Calendar, ExternalLink, Maximize2, Minimize2, Loader2, X, Camera, LinkIcon, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { CommentSection } from '@/components/shared/comment-section';
import { formatDate } from '@/lib/utils';
import type { GalleryItem } from '@/types';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface GalleryModalProps {
  item: GalleryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isGalleryRoute: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

export function GalleryModal({
  item,
  open,
  onOpenChange,
  isGalleryRoute,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false,
}: GalleryModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState('');

  useEffect(() => {
    if (item?.image && item.image !== currentSrc) {
      setImageLoaded(false);
      setCurrentSrc(item.image);
    }
  }, [item?.image, currentSrc]);

  useEffect(() => {
    if (!open) {
      setIsFullscreen(false);
      setImageLoaded(false);
      setCurrentSrc('');
    }
  }, [open]);

  const exitFullscreen = useCallback(() => setIsFullscreen(false), []);

  useEffect(() => {
    if (!isFullscreen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        exitFullscreen();
      }
    };
    window.addEventListener('keydown', handler, true);
    return () => window.removeEventListener('keydown', handler, true);
  }, [isFullscreen, exitFullscreen]);

  if (!item) return null;

  return (
    <>
      {/* keep dialog mounted so it re-opens when exiting fullscreen */}
      <Dialog open={open && !isFullscreen} onOpenChange={(v) => { if (!v && !isFullscreen) onOpenChange(false); }}>
        <DialogContent className="max-w-5xl p-0 gap-0 overflow-hidden max-h-[100dvh] sm:max-h-[95vh] overflow-y-auto">
          <VisuallyHidden>
            <DialogTitle>{item.caption || 'Gallery image'}</DialogTitle>
          </VisuallyHidden>

          <div className="relative bg-black min-h-[200px]">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <Loader2 className="h-8 w-8 animate-spin text-white/60" />
              </div>
            )}
            <Image
              src={item.image}
              alt={item.caption || 'Gallery image'}
              width={1200}
              height={800}
              className={`object-contain w-full max-h-[60vh] transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
            />

            {isGalleryRoute && (
              <>
                {hasPrevious && onPrevious && (
                  <button
                    type="button"
                    onClick={onPrevious}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white/80 hover:text-white hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                )}
                {hasNext && onNext && (
                  <button
                    type="button"
                    onClick={onNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white/80 hover:text-white hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                )}
              </>
            )}

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsFullscreen(true)}
              className="absolute bottom-3 right-3 gap-1.5 bg-neutral-600/80 text-white border-white/20 hover:bg-white/90 hover:text-neutral-800 transition-colors"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              Full Screen
            </Button>
          </div>

          <div className="p-6 space-y-4">
            {item.caption && (
              <h3 className="text-lg font-heading font-semibold">{item.caption}</h3>
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

              {(item.takenByLabel || item.relatedToLabel) && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
                  {item.takenByLabel && item.takenByHref && (
                    <span className="flex items-center gap-1.5">
                      <Camera className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">Taken by:</span>
                      <Link
                        href={item.takenByHref}
                        target={item.takenByNewTab ? '_blank' : undefined}
                        rel={item.takenByNewTab ? 'noopener noreferrer' : undefined}
                        className="text-primary font-medium hover:underline"
                      >
                        {item.takenByLabel}
                      </Link>
                    </span>
                  )}
                  {item.relatedToLabel && item.relatedToHref && (
                    <span className="flex items-center gap-1.5">
                      <LinkIcon className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">Related to:</span>
                      <Link
                        href={item.relatedToHref}
                        target={item.relatedToNewTab ? '_blank' : undefined}
                        rel={item.relatedToNewTab ? 'noopener noreferrer' : undefined}
                        className="text-primary font-medium hover:underline"
                      >
                        {item.relatedToLabel}
                      </Link>
                    </span>
                  )}
                </div>
              )}
            </div>

            {!isGalleryRoute && (
              <Button asChild variant="outline" size="sm">
                <Link href="/gallery">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open the Gallery
                </Link>
              </Button>
            )}

            <Separator />
            <CommentSection
              entityType="gallery"
              entityId={item.id}
              compact
            />
          </div>
        </DialogContent>
      </Dialog>

      {isFullscreen && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
          <Image
            src={item.image}
            alt={item.caption || 'Gallery image'}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
          <button
            type="button"
            onClick={exitFullscreen}
            className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/90 text-white shadow-md transition-colors hover:bg-red-600"
          >
            <X className="h-4 w-4" />
          </button>
          <Button
            variant="secondary"
            size="sm"
            onClick={exitFullscreen}
            className="absolute bottom-4 right-4 z-10 gap-1.5 bg-neutral-600/80 text-white border-white/20 hover:bg-white/90 hover:text-neutral-800 transition-colors"
          >
            <Minimize2 className="h-4 w-4" />
            Exit Full Screen
          </Button>
        </div>
      )}
    </>
  );
}
