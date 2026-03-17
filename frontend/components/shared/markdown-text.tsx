'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface MarkdownTextProps {
  children: string;
  className?: string;
  as?: 'p' | 'span' | 'div';
}

/**
 * Renders a short Markdown string inline (links, bold, italic, etc.)
 * without wrapping in extra block-level tags.
 */
export function MarkdownText({ children, className, as: Tag = 'div' }: MarkdownTextProps) {
  return (
    <Tag className={cn('[&>p]:inline', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children: c }) => <>{c}</>,
          a: ({ href, children: c }) => (
            <a
              href={href}
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="text-primary font-medium hover:underline"
            >
              {c}
            </a>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </Tag>
  );
}
