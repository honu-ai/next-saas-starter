import { redirect } from 'next/navigation';
import { getUser } from '@/lib/db';
import GeneralPage from './general';
import {
  getStripeProducts,
  getSerializedSubscription,
} from '@/lib/payments/stripe';
import Stripe from 'stripe';

export default async function SettingsPage() {
  const user = await getUser();

  if (!user) {
    redirect('/sign-in');
  }

  const products: Stripe.Product[] = await getStripeProducts();

  const subscription = user.stripeSubscriptionId
    ? await getSerializedSubscription(user.stripeSubscriptionId)
    : undefined;

  return (
    <GeneralPage user={user} products={products} subscription={subscription} />
  );
}
