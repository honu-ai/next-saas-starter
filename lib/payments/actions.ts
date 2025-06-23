'use server';

import { redirect } from 'next/navigation';
import { createCheckoutSession, createCustomerPortalSession } from './stripe';
import { withTeam } from '@/lib/auth/middleware';

export const checkoutAction = withTeam(async (formData, team) => {
  const priceId = formData.get('priceId') as string;
  const trialPeriodDays = formData.get('trialPeriodDays') as string;

  await createCheckoutSession({
    team: team,
    priceId,
    trialPeriodDays: trialPeriodDays ? Number(trialPeriodDays) : undefined,
  });
});

export const customerPortalAction = withTeam(async (_, team) => {
  const portalSession = await createCustomerPortalSession(team);
  redirect(portalSession.url);
});
