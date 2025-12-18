import type { User } from './schema';
import type { teamSubscriptionStatusEnum } from './schema';

/**
 * Mock database queries for static mode (when database is disabled)
 * These functions return null/empty data to allow the app to run without a database
 */

export async function getUser(): Promise<null> {
  return null;
}

export async function getUserActiveSubscriptionDetails(
  userId: number,
): Promise<{
  hasActiveSubscription: boolean;
  status: (typeof teamSubscriptionStatusEnum.enumValues)[number] | null;
}> {
  return { hasActiveSubscription: false, status: null };
}

export async function getUserByStripeCustomerId(
  customerId: string,
): Promise<null> {
  return null;
}

export async function updateUserSubscription(
  userId: number,
  subscriptionData: {
    stripeSubscriptionId: string | null;
    stripeProductId: string | null;
    planName: string | null;
    subscriptionStatus: User['subscriptionStatus'];
    credits?: number | null;
  },
): Promise<void> {
  console.warn('Database is disabled. updateUserSubscription is a no-op.');
}

export async function setUserCreditsByStripeCustomerId(
  stripeCustomerId: string,
  newCredits: number,
): Promise<void> {
  console.warn(
    'Database is disabled. setUserCreditsByStripeCustomerId is a no-op.',
  );
}

export async function getActivityLogs(): Promise<[]> {
  return [];
}
