import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  async rewrites() {
    const posthogHost =
      process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com';

    return [
      {
        source: '/ingest/:path*',
        destination: `${posthogHost}/:path*`,
      },
      {
        source: '/ingest/decide',
        destination: `${posthogHost}/decide`,
      },
    ];
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};
const withMDX = createMDX({});

export default withMDX(nextConfig);
