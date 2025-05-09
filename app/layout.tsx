import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { UserProvider } from '@/lib/auth';
import { getUser } from '@/lib/db/queries';
import Script from 'next/script';

import ThemeProvider from '@/components/theme-provider';
import PostHogProvider from '@/components/posthog-provider';
import { getBootstrapData } from '@/lib/posthog';
import { Suspense } from 'react';
// Uncomment to enable Formbricks integration
// import FormbricksProvider from '@/components/formbricks-provider';

import content from '../content.json';

export const metadata: Metadata = {
  title: content.metadata.title,
  description: content.metadata.description,
};

export const viewport: Viewport = {
  maximumScale: 1,
};

const manrope = Manrope({ subsets: ['latin'] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userPromise = getUser();
  const gtmId = process.env.GTM_ID; // Access the GTM ID from the environment
  const bootstrap = await getBootstrapData();

  return (
    <html lang='en' className={`${manrope.className}`} suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <Script id='gtm-script' strategy='afterInteractive'>
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

        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <PostHogProvider bootstrap={bootstrap}>
            <UserProvider userPromise={userPromise}>
              {/* Uncomment to enable Formbricks integration */}
              {/* <Suspense>
                <FormbricksProvider />
              </Suspense> */}
              {children}
            </UserProvider>
          </PostHogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
