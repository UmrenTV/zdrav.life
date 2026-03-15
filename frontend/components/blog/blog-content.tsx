'use client';

import { cn } from '@/lib/utils';

interface BlogContentProps {
  content: string;
  className?: string;
}

export function BlogContent({ content, className }: BlogContentProps) {
  return (
    <div
      className={cn(
        'prose-custom',
        className
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
