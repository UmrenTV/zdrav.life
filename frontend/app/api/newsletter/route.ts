import { NextResponse } from 'next/server';
import { isStrapiEnabled, createEntry } from '@/lib/strapi/client';

export const dynamic = 'force-dynamic';

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0]?.trim() || realIp || 'unknown';
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = (body.email ?? '').trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const formSource = (body.formSource ?? '').trim();
    if (!formSource) {
      return NextResponse.json({ error: 'formSource is required' }, { status: 400 });
    }

    const name = (body.name ?? '').trim() || undefined;
    const ip = getClientIp(request);

    if (!isStrapiEnabled) {
      return NextResponse.json(
        { message: 'Subscribed (Strapi not configured — submission not persisted)' },
        { status: 201 },
      );
    }

    const entry = await createEntry('newsletter-subscriptions', {
      email,
      name,
      formSource,
      status: 'active',
      subscribedAt: new Date().toISOString(),
      ipAddress: ip,
    });

    if (!entry) {
      return NextResponse.json({ error: 'Failed to save subscription' }, { status: 503 });
    }

    return NextResponse.json({ message: 'Subscribed successfully' }, { status: 201 });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
