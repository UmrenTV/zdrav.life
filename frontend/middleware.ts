import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const MAINTENANCE_PATH = '/maintenance';
const ALLOWED_PREFIXES = ['/maintenance', '/api', '/favicon', '/images', '/fonts'];

function isAllowed(pathname: string): boolean {
  return ALLOWED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

type Features = { shop?: boolean; blog?: boolean; gallery?: boolean; videos?: boolean };

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Never touch Next.js internals or static assets (fixes 404/MIME when matcher is broad)
  if (pathname.startsWith('/_next') || pathname.startsWith('_next')) {
    return NextResponse.next();
  }
  if (isAllowed(pathname)) return NextResponse.next();

  try {
    const origin = request.nextUrl.origin;
    const res = await fetch(`${origin}/api/maintenance`, {
      cache: 'no-store',
      headers: request.headers,
    });
    const data = (await res.json()) as {
      maintenanceMode?: boolean;
      features?: Features;
    };
    if (data.maintenanceMode) {
      return NextResponse.redirect(new URL(MAINTENANCE_PATH, request.url));
    }
    const features: Features = data.features ?? {};
    if (pathname === '/shop' || pathname.startsWith('/shop/')) {
      if (features.shop === false) return NextResponse.redirect(new URL('/', request.url));
    }
    if (pathname === '/blog' || pathname.startsWith('/blog/')) {
      if (features.blog === false) return NextResponse.redirect(new URL('/', request.url));
    }
    if (pathname === '/gallery' || pathname.startsWith('/gallery/')) {
      if (features.gallery === false) return NextResponse.redirect(new URL('/', request.url));
    }
    if (pathname === '/videos' || pathname.startsWith('/videos/')) {
      if (features.videos === false) return NextResponse.redirect(new URL('/', request.url));
    }
  } catch {
    // If API fails, allow request
  }
  return NextResponse.next();
}

// Exclude _next, static files, and common assets so middleware never runs for them
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|_next/webpack-hmr|favicon\\.ico|.*\\.(?:ico|png|jpg|jpeg|gif|webp|svg|woff2?|css|js)$).*)',
  ],
};
