import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ZdravLife - Engineer Your Vitality',
    short_name: 'ZdravLife',
    description:
      'Build strength. Master discipline. Ride further. Live deeper. A lifestyle brand at the intersection of calisthenics, nutrition, motorcycle travel, and software engineering.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0b1220',
    theme_color: '#3b82f6',
    orientation: 'portrait-primary',
    categories: ['health', 'fitness', 'lifestyle'],
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [],
  };
}
