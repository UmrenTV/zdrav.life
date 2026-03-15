'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { SiteConfig } from '@/types';

function splitNameForAccent(
  name: string,
  position: 'first' | 'last',
  letterCount: number
): { before: string; accent: string } {
  const n = name.length;
  const count = Math.min(letterCount, n);
  if (position === 'last') {
    return { before: name.slice(0, n - count), accent: name.slice(-count) };
  }
  return { before: name.slice(count), accent: name.slice(0, count) };
}

type Size = 'header' | 'footer' | 'mobile';

const sizeClasses: Record<Size, { logo: string; text: string }> = {
  header: { logo: 'h-8 md:h-9 w-auto', text: 'text-xl md:text-2xl' },
  footer: { logo: 'h-10 w-auto', text: 'text-xl' },
  mobile: { logo: 'h-9 w-auto', text: 'text-xl' },
};

export function SiteBranding({
  siteConfig,
  size = 'header',
  className,
  asLink = true,
}: {
  siteConfig: SiteConfig;
  size?: Size;
  className?: string;
  asLink?: boolean;
}) {
  const siteName = siteConfig.name || 'ZdravLife';
  const logoUrl = siteConfig.logo ?? '';
  const accent = siteConfig.nameAccent ?? { useAccent: true, position: 'last' as const, letterCount: 4 };
  const { logo: logoClass, text: textClass } = sizeClasses[size];

  const content = (
    <>
      {logoUrl && (
        <Image
          src={logoUrl}
          alt=""
          width={140}
          height={40}
          className={`${logoClass} flex-shrink-0 object-contain`}
          aria-hidden
        />
      )}
      <span className={`font-heading font-bold tracking-tight min-w-0 truncate ${textClass} ${logoUrl ? 'ml-2' : ''}`}>
        {accent.useAccent && siteName.length > 0 ? (() => {
          const { before, accent: accentPart } = splitNameForAccent(siteName, accent.position, accent.letterCount);
          return accent.position === 'first' ? (
            <>
              <span className="text-primary">{accentPart}</span>
              <span className="text-foreground">{before}</span>
            </>
          ) : (
            <>
              <span className="text-foreground">{before}</span>
              <span className="text-primary">{accentPart}</span>
            </>
          );
        })() : (
          <span className="text-foreground">{siteName}</span>
        )}
      </span>
    </>
  );

  if (asLink) {
    return (
      <Link
        href="/"
        className={`inline-flex items-center ${className ?? ''}`}
        aria-label={`${siteName} Home`}
      >
        {content}
      </Link>
    );
  }
  return <span className={`inline-flex items-center ${className ?? ''}`}>{content}</span>;
}
