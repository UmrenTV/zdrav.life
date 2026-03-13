import type { Metadata } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
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

export const metadata: Metadata = {
  title: 'ZdravLife - Engineer Your Vitality',
  description:
    'Build strength. Master discipline. Ride further. Live deeper. A software engineer\'s journey into high-performance living at the intersection of calisthenics, motorcycle travel, and mindful optimization.',
  keywords: [
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
  ],
  authors: [{ name: 'Zdrav' }],
  creator: 'Zdrav',
  publisher: 'ZdravLife',
  metadataBase: new URL('https://zdrav.life'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://zdrav.life',
    siteName: 'ZdravLife',
    title: 'ZdravLife - Engineer Your Vitality',
    description:
      'Build strength. Master discipline. Ride further. Live deeper.',
    images: [
      {
        url: '/images/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'ZdravLife - Engineer Your Vitality',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@zdravlife',
    creator: '@zdravlife',
    title: 'ZdravLife - Engineer Your Vitality',
    description:
      'Build strength. Master discipline. Ride further. Live deeper.',
    images: ['/images/og-default.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'YOUR_GOOGLE_VERIFICATION_CODE',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
