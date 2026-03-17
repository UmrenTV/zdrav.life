import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const MAINTENANCE_PATH = '/maintenance';
const ALLOWED_PREFIXES = ['/maintenance', '/api', '/favicon', '/images', '/fonts'];
const CANONICAL_HOST = 'www.zdrav.life';

function isAllowed(pathname: string): boolean {
  return ALLOWED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

type Features = { shop?: boolean; blog?: boolean; gallery?: boolean; videos?: boolean };
type CachedConfig = { maintenanceMode: boolean; features: Features; fetchedAt: number };

let cachedConfig: CachedConfig | null = null;
const CACHE_TTL_MS = 60_000; // re-check every 60s

async function getConfig(origin: string, headers: Headers): Promise<CachedConfig> {
  if (cachedConfig && Date.now() - cachedConfig.fetchedAt < CACHE_TTL_MS) {
    return cachedConfig;
  }
  try {
    const res = await fetch(`${origin}/api/maintenance`, {
      cache: 'no-store',
      headers,
    });
    const data = (await res.json()) as {
      maintenanceMode?: boolean;
      features?: Features;
    };
    cachedConfig = {
      maintenanceMode: !!data.maintenanceMode,
      features: data.features ?? {},
      fetchedAt: Date.now(),
    };
  } catch {
    if (cachedConfig) return cachedConfig;
    cachedConfig = { maintenanceMode: false, features: {}, fetchedAt: Date.now() };
  }
  return cachedConfig;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith('/_next') || pathname.startsWith('_next')) {
    return NextResponse.next();
  }

  // Canonical host redirect: naked domain → www (single hop, 301)
  const host = request.headers.get('host') || '';
  if (
    host &&
    host !== CANONICAL_HOST &&
    !host.startsWith('localhost') &&
    !host.startsWith('127.') &&
    !host.includes(':')
  ) {
    const url = request.nextUrl.clone();
    url.host = CANONICAL_HOST;
    return NextResponse.redirect(url, 301);
  }

  if (isAllowed(pathname)) return NextResponse.next();

  const config = await getConfig(request.nextUrl.origin, request.headers);

  if (config.maintenanceMode) {
    return NextResponse.redirect(new URL(MAINTENANCE_PATH, request.url));
  }

  const { features } = config;
  if ((pathname === '/shop' || pathname.startsWith('/shop/')) && features.shop === false)
    return NextResponse.redirect(new URL('/', request.url));
  if ((pathname === '/blog' || pathname.startsWith('/blog/')) && features.blog === false)
    return NextResponse.redirect(new URL('/', request.url));
  if ((pathname === '/gallery' || pathname.startsWith('/gallery/')) && features.gallery === false)
    return NextResponse.redirect(new URL('/', request.url));
  if ((pathname === '/videos' || pathname.startsWith('/videos/')) && features.videos === false)
    return NextResponse.redirect(new URL('/', request.url));

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|_next/webpack-hmr|favicon\\.ico|.*\\.(?:ico|png|jpg|jpeg|gif|webp|svg|woff2?|css|js)$).*)',
  ],
};
