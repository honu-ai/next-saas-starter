import { Metadata } from 'next';
import { Suspense } from 'react';
import { getUser, getUserActiveSubscriptionDetails } from '@/lib/db/queries';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ErrorReportingWidget from '@/components/error-reporting-widget';
import { AutoErrorCapture } from '@/components/auto-error-capture';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Welcome to your SAAS dashboard',
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  const details = user && (await getUserActiveSubscriptionDetails(user.id));
  const hasActiveSubscription = details?.hasActiveSubscription;
  const subscriptionStatus = details?.status;
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  // Allow dashboard access in development or when explicitly enabled
  const isDevelopment =
    process.env.NODE_ENV === 'development' ||
    process.env.NEXT_PUBLIC_ALLOW_DASHBOARD_ACCESS === 'true';

  if (!hasActiveSubscription && !isDevelopment) {
    return (
      <div className='container mx-auto flex h-[calc(100vh-150px)] max-w-6xl flex-col items-center justify-center px-4 py-8 text-center'>
        <div className='rounded-lg bg-white p-8 shadow-xl dark:bg-gray-800'>
          <h1 className='text-navy mb-4 text-3xl font-bold dark:text-white'>
            Subscription Required
          </h1>
          <p className='text-gray mb-6 dark:text-gray-300'>
            To access all features, please subscribe to a plan.
          </p>
          <Button asChild>
            <Link href='/pricing'>View Pricing &amp; Subscribe</Link>
          </Button>
          {subscriptionStatus && (
            <p className='text-gray mt-4 text-sm dark:text-gray-400'>
              Current status:{' '}
              <span className='font-semibold'>{subscriptionStatus}</span>
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen flex-col'>
      <main className='flex-1'>
        <div className='container py-6'>{children}</div>
      </main>
      {posthogKey && posthogHost && (
        <>
          <ErrorReportingWidget />
          <AutoErrorCapture />{' '}
        </>
      )}
    </div>
  );
}
