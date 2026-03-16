'use client';

import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, ExternalLink, Calendar, Clock, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { CommentSection } from '@/components/shared/comment-section';
import { formatDate } from '@/lib/utils';
import type { Post } from '@/types';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface ArticlePreviewModalProps {
  article: Post | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ArticlePreviewModal({ article, open, onOpenChange }: ArticlePreviewModalProps) {
  if (!article) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 gap-0 overflow-hidden max-h-[100dvh] sm:max-h-[95vh] overflow-y-auto">
        <VisuallyHidden>
          <DialogTitle>{article.title}</DialogTitle>
        </VisuallyHidden>

        {article.coverImage && (
          <div className="relative w-full aspect-[2/1] bg-muted">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        <div className="p-6 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{article.category.name}</Badge>
            {article.tags?.slice(0, 3).map((tag) => (
              <Badge key={tag.id} variant="outline" className="text-xs">
                #{tag.name}
              </Badge>
            ))}
          </div>

          <h3 className="text-xl sm:text-2xl font-heading font-semibold">{article.title}</h3>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {article.author && (
              <span className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                {article.author.name}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(article.publishedAt)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {article.readingTime} min read
            </span>
          </div>

          {article.excerpt && (
            <p className="text-muted-foreground">{article.excerpt}</p>
          )}

          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href={`/blog/${article.slug}`}>
                <BookOpen className="h-4 w-4 mr-2" />
                Read Full Article
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/blog">
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Blog
              </Link>
            </Button>
          </div>

          <Separator />

          <CommentSection
            entityType="post"
            entityId={article.slug}
            compact
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
