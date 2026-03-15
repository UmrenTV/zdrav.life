'use client';

import Script from 'next/script';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();

/**
 * Google Analytics 4 (GA4). Renders nothing if NEXT_PUBLIC_GA_MEASUREMENT_ID is not set.
 * Add NEXT_PUBLIC_GA_MEASUREMENT_ID to .env (e.g. G-XXXXXXXXXX from GA4 property).
 */
export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
