import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, X } from 'lucide-react';
import { getVideoBySlug, getCommentsByEntity, getSiteConfig } from '@/lib/data/data-source';
import { generateMetadata as genMeta } from '@/lib/seo/metadata';
import { VideoWhitebox } from '@/components/videos/video-whitebox';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

interface VideoPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: VideoPageProps) {
  const [video, config] = await Promise.all([
    getVideoBySlug(params.slug),
    getSiteConfig(),
  ]);
  if (!video) {
    return genMeta({ title: 'Video Not Found' }, config);
  }
  return genMeta(
    {
      title: video.title,
      description: video.description,
      ogType: 'video.other',
    },
    config,
  );
}

export default async function VideoDetailPage({ params }: VideoPageProps) {
  const video = await getVideoBySlug(params.slug);
  if (!video) notFound();

  const comments = await getCommentsByEntity('video', video.slug || video.id);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 overflow-y-auto">
      <div className="min-h-screen flex flex-col items-center py-8 px-4">
        <div className="w-full max-w-4xl flex justify-between items-center mb-4">
          <Button asChild variant="ghost" size="sm" className="text-white/70 hover:text-white">
            <Link href="/videos">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Videos
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="text-white/70 hover:text-white">
            <Link href="/videos">
              <X className="h-5 w-5" />
            </Link>
          </Button>
        </div>
        <VideoWhitebox video={video} comments={comments} />
      </div>
    </div>
  );
}
