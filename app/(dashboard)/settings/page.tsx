import { redirect } from 'next/navigation';
import { getTeamForUser, getUser } from '@/lib/db/queries';
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

  const teamData = await getTeamForUser(user.id);
  const products: Stripe.Product[] = await getStripeProducts();

  if (!teamData) {
    throw new Error('Team not found');
  }
  const subscription = teamData.stripeSubscriptionId
    ? await getSerializedSubscription(teamData.stripeSubscriptionId)
    : undefined;

  if (!teamData) {
    throw new Error('Team not found');
  }

  return (
    <GeneralPage
      teamData={teamData}
      products={products}
      subscription={subscription}
    />
  );
}
