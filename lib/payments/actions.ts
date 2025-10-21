'use server';

import { redirect } from 'next/navigation';
import { createCheckoutSession, createCustomerPortalSession } from './stripe';
import { validatedActionWithUser } from '@/lib/auth/middleware';
import { z } from 'zod';

const checkoutSchema = z.object({
  priceId: z.string(),
  trialPeriodDays: z.string().optional(),
});

export const checkoutAction = validatedActionWithUser(
  checkoutSchema,
  async (data, _, user) => {
    const { priceId, trialPeriodDays } = data;

    await createCheckoutSession({
      user,
      priceId,
      trialPeriodDays: trialPeriodDays ? Number(trialPeriodDays) : undefined,
    });
  },
);

export const customerPortalAction = validatedActionWithUser(
  z.object({}),
  async (_, __, user) => {
    const portalSession = await createCustomerPortalSession(user);
    redirect(portalSession.url);
  },
);
