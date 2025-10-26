import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Poppins as poppinsFont } from 'next/font/google';
import { UserProvider } from '@/lib/auth';
import { getUser } from '@/lib/db/queries';
import Script from 'next/script';

import PostHogProvider from '@/components/posthog-provider';
import DynamicFavicon from '@/components/dynamic-favicon';
import { getBootstrapData } from '@/lib/posthog';
import { Toaster } from '@/components/ui/sonner';
import { GlobalErrorBoundary } from '@/components/global-error-boundary';

import content from '../content.json';

export const metadata: Metadata = {
  title: content.metadata.title,
  description: content.metadata.description,
};

export const viewport: Viewport = {
  maximumScale: 1,
};

const poppins = poppinsFont({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userPromise = getUser();
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID; // Access the GTM ID from the environment
  const bootstrap = await getBootstrapData();

  return (
    <html lang='en' className={`${poppins.className}`} suppressHydrationWarning>
      <head>
        {/* Fallback favicon */}
        <link rel='icon' href='/favicon.svg' type='image/svg+xml' />
        <DynamicFavicon />
        {/* Google tag (gtag.js) */}
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${gtmId}`}
        ></Script>
        <Script>
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `}
        </Script>
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
            height='0'
            width='0'
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        <PostHogProvider bootstrap={bootstrap}>
          <UserProvider userPromise={userPromise}>
            <GlobalErrorBoundary>
              {children}
              <Toaster />
            </GlobalErrorBoundary>
          </UserProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
