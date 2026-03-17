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

    const name = (body.name ?? '').trim();
    const email = (body.email ?? '').trim().toLowerCase();
    const subject = (body.subject ?? '').trim() || undefined;
    const message = (body.message ?? '').trim();

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const ip = getClientIp(request);

    if (!isStrapiEnabled) {
      return NextResponse.json(
        { message: 'Message received (Strapi not configured — submission not persisted)' },
        { status: 201 },
      );
    }

    const entry = await createEntry('contact-submissions', {
      name,
      email,
      subject,
      message,
      status: 'new',
      submittedAt: new Date().toISOString(),
      ipAddress: ip,
    });

    if (!entry) {
      return NextResponse.json({ error: 'Failed to save message' }, { status: 503 });
    }

    return NextResponse.json({ message: 'Message sent successfully' }, { status: 201 });
  } catch (error) {
    console.error('Contact submission error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
