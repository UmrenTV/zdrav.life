import * as React from 'react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const SIZE_CLASSES = {
  xs: 'text-[10px] px-1.5 py-0 gap-1',
  sm: 'text-xs px-2.5 py-0.5 gap-1',
  md: 'text-sm px-3 py-1 gap-1.5',
  lg: 'text-base px-4 py-1.5 gap-2',
} as const;

const ICON_SIZE_CLASSES = {
  xs: 'h-2.5 w-2.5',
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
} as const;

export interface PillProps {
  text: string;
  icon?: LucideIcon;
  size?: keyof typeof SIZE_CLASSES;
  bg?: string;
  border?: string;
  textColor?: string;
  hoverBg?: string;
  hoverBorder?: string;
  hoverTextColor?: string;
  href?: string;
  /** When inside an anchor, use span instead of Link to avoid nested <a> */
  insideLink?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}

export function Pill({
  text,
  icon: Icon,
  size = 'sm',
  bg = 'bg-secondary',
  border = 'border-transparent',
  textColor = 'text-secondary-foreground',
  hoverBg,
  hoverBorder,
  hoverTextColor,
  href,
  insideLink = false,
  onClick,
  className,
}: PillProps) {
  const sizeClass = SIZE_CLASSES[size];
  const iconClass = ICON_SIZE_CLASSES[size];

  const hoverClasses = [
    hoverBg && `hover:${hoverBg}`,
    hoverBorder && `hover:${hoverBorder}`,
    hoverTextColor && `hover:${hoverTextColor}`,
  ].filter(Boolean).join(' ');

  const pillClass = cn(
    'inline-flex items-center rounded-full border font-medium leading-4 transition-colors',
    sizeClass,
    bg,
    border,
    textColor,
    href && 'cursor-pointer',
    hoverClasses,
    !hoverBg && href && 'hover:opacity-80',
    className,
  );

  const inner = (
    <>
      {Icon && <Icon className={iconClass} />}
      {text}
    </>
  );

  if (href) {
    if (insideLink) {
      return (
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClick?.(e); window.location.href = href; }}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); window.location.href = href; } }}
          className="relative z-10 inline-flex"
        >
          <span className={pillClass}>{inner}</span>
        </span>
      );
    }
    return (
      <Link
        href={href}
        onClick={(e) => { e.stopPropagation(); onClick?.(e); }}
        className="relative z-10 inline-flex"
      >
        <span className={pillClass}>{inner}</span>
      </Link>
    );
  }

  return <span className={pillClass}>{inner}</span>;
}
