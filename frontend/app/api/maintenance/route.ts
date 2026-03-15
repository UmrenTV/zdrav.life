import { NextResponse } from 'next/server';
import { getSiteConfig } from '@/lib/data/data-source';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Returns { maintenanceMode, features } for middleware (redirects when maintenance or feature disabled).
 */
export async function GET() {
  try {
    const config = await getSiteConfig();
    return NextResponse.json({
      maintenanceMode: config.maintenanceMode ?? false,
      features: config.features ?? { shop: true, blog: true, gallery: true, videos: true },
    });
  } catch {
    return NextResponse.json({
      maintenanceMode: false,
      features: { shop: true, blog: true, gallery: true, videos: true },
    });
  }
}
