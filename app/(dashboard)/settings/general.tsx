'use client';

import { startTransition, use, useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useUser } from '@/lib/auth';
import { updateAccount } from '@/app/(login)/actions';
import { customerPortalAction } from '@/lib/payments/actions';
import { User } from '@/lib/db/schema';
import { SerializedSubscription } from '@/lib/payments/stripe';
import Stripe from 'stripe';

type ActionState = {
  error?: string;
  success?: string;
};

export default function GeneralPage({
  user: initialUser,
  products,
  subscription,
}: {
  user: User;
  products: Stripe.Product[];
  subscription?: SerializedSubscription;
}) {
  const { userPromise } = useUser();
  const user = use(userPromise);
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    updateAccount,
    { error: '', success: '' },
  );
  const [portalState, portalAction, isPortalPending] = useActionState<
    ActionState,
    FormData
  >(customerPortalAction, { error: '', success: '' });
  const product = products.find(
    (product) => product.id === initialUser.stripeProductId,
  );
  const userCredits = initialUser.credits || 0;
  const creditAllowance =
    initialUser.subscriptionStatus === 'trialing'
      ? parseInt(product?.metadata.trial_period_credits || '0')
      : parseInt(product?.metadata.credits_allowance || '0');

  // Calculate next renewal date from billing_cycle_anchor and subscription interval
  const renewDate =
    subscription?.billing_cycle_anchor && subscription.items.data[0]
      ? (() => {
          const anchor = new Date(subscription.billing_cycle_anchor * 1000);
          const interval = subscription.items.data[0].price.interval;
          const intervalCount = subscription.items.data[0].price.interval_count;

          const nextRenewal = new Date(anchor);
          const now = new Date();

          // Keep adding intervals until we get a future date
          while (nextRenewal <= now) {
            if (interval === 'month') {
              nextRenewal.setMonth(nextRenewal.getMonth() + intervalCount);
            } else if (interval === 'year') {
              nextRenewal.setFullYear(
                nextRenewal.getFullYear() + intervalCount,
              );
            } else if (interval === 'week') {
              nextRenewal.setDate(nextRenewal.getDate() + 7 * intervalCount);
            } else if (interval === 'day') {
              nextRenewal.setDate(nextRenewal.getDate() + intervalCount);
            }
          }

          return nextRenewal;
        })()
      : undefined;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(() => {
      formAction(new FormData(event.currentTarget));
    });
  };

  return (
    <section className='flex-1 p-4 lg:p-8'>
      <h1 className='mb-6 text-lg font-medium lg:text-2xl'>General Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form className='space-y-4' onSubmit={handleSubmit}>
            <div>
              <Label htmlFor='name'>Name</Label>
              <Input
                id='name'
                name='name'
                placeholder='Enter your name'
                defaultValue={user?.name || ''}
                required
              />
            </div>
            <div>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                name='email'
                type='email'
                placeholder='Enter your email'
                defaultValue={user?.email || ''}
                required
              />
            </div>
            {state.error && (
              <p className='text-sm text-red-500'>{state.error}</p>
            )}
            {state.success && (
              <p className='text-sm text-green-500'>{state.success}</p>
            )}
            <Button
              type='submit'
              className='bg-orange-500 text-white hover:bg-orange-600'
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card className='mt-8 mb-8'>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='flex flex-col items-start justify-between sm:flex-row sm:items-center'>
              <div className='mb-4 sm:mb-0'>
                {(initialUser.subscriptionStatus === 'active' ||
                  initialUser.subscriptionStatus === 'trialing') && (
                  <>
                    <p className='font-medium'>
                      Current Plan: {initialUser.planName}
                    </p>
                    <p className='font-medium'>
                      Available Credits: {userCredits}/{creditAllowance}
                    </p>

                    {renewDate && (
                      <p className='text-muted-foreground text-sm'>
                        Renews on {renewDate.toLocaleDateString()}
                      </p>
                    )}
                  </>
                )}
                <p className='text-muted-foreground text-sm'>
                  {initialUser.subscriptionStatus === 'active'
                    ? 'Billed monthly'
                    : initialUser.subscriptionStatus === 'trialing'
                      ? 'Trial period'
                      : 'No active subscription'}
                </p>
              </div>
              <form action={portalAction}>
                <Button
                  type='submit'
                  variant='outline'
                  disabled={isPortalPending}
                >
                  Manage Subscription
                </Button>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
