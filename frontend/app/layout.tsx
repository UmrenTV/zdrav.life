import type { Metadata } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Providers } from '@/app/providers';
import { SiteConfigProvider } from '@/lib/context/site-config';
import { LayoutChrome } from '@/components/layout/layout-chrome';
import { getSiteConfig } from '@/lib/data/data-source';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();
  const title = config.seo.defaultTitle || 'ZdravLife - Engineer Your Vitality';
  const description = config.seo.defaultDescription || 'Build strength. Master discipline. Ride further. Live deeper.';
  const siteName = config.name || 'ZdravLife';
  const baseUrl = (config.url || 'https://zdrav.life').replace(/\/$/, '');
  const ogPath = config.ogImage || '/images/og-default.jpg';
  const ogImage = ogPath.startsWith('http') ? ogPath : `${baseUrl}${ogPath.startsWith('/') ? ogPath : '/' + ogPath}`;
  const defaultKeywords = [
    'calisthenics',
    'hypertrophy',
    'fasting',
    'nutrition',
    'longevity',
    'motorcycle travel',
    'personal development',
    'discipline',
    'lifestyle systems',
    'high-performance living',
  ];
  return {
    title,
    description,
    keywords: (config.seo.keywords?.length ? config.seo.keywords : defaultKeywords),
    authors: [{ name: config.author.name || 'Zdrav' }],
    creator: siteName,
    publisher: siteName,
    metadataBase: new URL(config.url || 'https://zdrav.life'),
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: config.url,
      siteName,
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      site: config.seo.twitterHandle || '@zdravlife',
      creator: config.seo.twitterHandle || '@zdravlife',
      title,
      description,
      images: [ogImage],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 } },
    verification: { google: 'YOUR_GOOGLE_VERIFICATION_CODE' },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteConfig = await getSiteConfig();
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen w-full max-w-full bg-background font-sans antialiased overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SiteConfigProvider config={siteConfig}>
            <Providers>
              <LayoutChrome>{children}</LayoutChrome>
            </Providers>
          </SiteConfigProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
