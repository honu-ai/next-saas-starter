import Stripe from 'stripe';
import { redirect } from 'next/navigation';
import { Team } from '@/lib/db/schema';
import {
  getTeamByStripeCustomerId,
  getUser,
  updateTeamSubscription,
  setTeamCreditsByStripeCustomerId,
} from '@/lib/db/queries';

export const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

export async function createCheckoutSession({
  team,
  priceId,
  usageType,
}: {
  team: Team | null;
  priceId: string;
  usageType?: string;
}) {
  const user = await getUser();

  if (!team || !user) {
    redirect(`/sign-up?redirect=checkout&priceId=${priceId}`);
  }
  if (team.stripeCustomerId) {
    const subscriptions = await stripe.subscriptions.list({
      customer: team.stripeCustomerId || undefined,
      status: 'all',
      limit: 1, // We only need to check if at least one active subscription exists
    });

    const relevantSubscription = subscriptions.data.find((sub) =>
      ['active', 'trialing'].includes(sub.status),
    );

    if (relevantSubscription) {
      const portalSession = await createCustomerPortalSession(team);
      redirect(portalSession.url);
    }
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: usageType === 'metered' ? undefined : 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.BASE_URL}/api/stripe/checkout?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.BASE_URL}/pricing`,
    customer: team.stripeCustomerId || undefined,
    client_reference_id: user.id.toString(),
    allow_promotion_codes: true,
  });

  redirect(session.url!);
}

export async function createCustomerPortalSession(team: Team) {
  if (!team.stripeCustomerId || !team.stripeProductId) {
    redirect('/pricing');
  }

  let configuration: Stripe.BillingPortal.Configuration;
  const configurations = await stripe.billingPortal.configurations.list();

  if (configurations.data.length > 0) {
    configuration = configurations.data[0];
  } else {
    const product = await stripe.products.retrieve(team.stripeProductId);
    if (!product.active) {
      throw new Error("Team's product is not active in Stripe");
    }

    const prices = await stripe.prices.list({
      product: product.id,
      active: true,
    });
    if (prices.data.length === 0) {
      throw new Error("No active prices found for the team's product");
    }

    configuration = await stripe.billingPortal.configurations.create({
      business_profile: {
        headline: 'Manage your subscription',
      },
      features: {
        subscription_update: {
          enabled: true,
          default_allowed_updates: ['price', 'quantity', 'promotion_code'],
          proration_behavior: 'create_prorations',
          products: [
            {
              product: product.id,
              prices: prices.data.map((price) => price.id),
            },
          ],
        },
        subscription_cancel: {
          enabled: true,
          mode: 'at_period_end',
          cancellation_reason: {
            enabled: true,
            options: [
              'too_expensive',
              'missing_features',
              'switched_service',
              'unused',
              'other',
            ],
          },
        },
      },
    });
  }

  return stripe.billingPortal.sessions.create({
    customer: team.stripeCustomerId,
    return_url: `${process.env.BASE_URL}/dashboard`,
    configuration: configuration.id,
  });
}

export interface SerializedSubscription {
  id: string;
  status: string;
  current_period_end: number;
  current_period_start: number;
  cancel_at_period_end: boolean;
  canceled_at: number | null;
  items: {
    data: Array<{
      id: string;
      price: {
        id: string;
        unit_amount: number | null;
        currency: string;
        interval: string;
        interval_count: number;
      };
    }>;
  };
}

function serializeSubscription(
  subscription: Stripe.Subscription,
): SerializedSubscription {
  return {
    id: subscription.id,
    status: subscription.status,
    current_period_end: subscription.current_period_end,
    current_period_start: subscription.current_period_start,
    cancel_at_period_end: subscription.cancel_at_period_end,
    canceled_at: subscription.canceled_at,
    items: {
      data: subscription.items.data.map((item) => ({
        id: item.id,
        price: {
          id: item.price.id,
          unit_amount: item.price.unit_amount,
          currency: item.price.currency,
          interval: item.price.recurring?.interval || 'month',
          interval_count: item.price.recurring?.interval_count || 1,
        },
      })),
    },
  };
}

export async function getSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  return subscription;
}

export async function getSerializedSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  return serializeSubscription(subscription);
}

export async function handleSubscriptionChange(
  subscription: Stripe.Subscription,
) {
  const customerId = subscription.customer as string;
  const subscriptionId = subscription.id;
  const status = subscription.status;
  console.log('status', status);
  const team = await getTeamByStripeCustomerId(customerId);

  if (!team) {
    console.error('Team not found for Stripe customer:', customerId);
    return;
  }

  if (status === 'active' || status === 'trialing') {
    const plan = subscription.items.data[0]?.plan;
    await updateTeamSubscription(team.id, {
      stripeSubscriptionId: subscriptionId,
      stripeProductId: plan?.product as string,
      planName: (plan?.product as Stripe.Product).name,
      subscriptionStatus: status,
    });
  } else if (status === 'canceled' || status === 'unpaid') {
    await updateTeamSubscription(team.id, {
      stripeSubscriptionId: null,
      stripeProductId: null,
      planName: null,
      subscriptionStatus: status,
      credits: null,
      subscriptionCreatedAt: null,
    });
  }
}

export async function getStripePrices() {
  const prices = await stripe.prices.list({
    expand: ['data.product'],
    active: true,
    type: 'recurring',
  });

  return prices.data.map((price) => ({
    id: price.id,
    productId:
      typeof price.product === 'string' ? price.product : price.product.id,
    unitAmount: price.unit_amount,
    currency: price.currency,
    interval: price.recurring?.interval,
    trialPeriodDays: price.recurring?.trial_period_days,
  }));
}

export async function getStripeProducts() {
  const products = await stripe.products.list({
    active: true,
    expand: ['data.default_price'],
  });
  const prices = await stripe.prices.list();
  console.log('prices', products.data);

  return products.data.map((product) => ({
    ...product,
    id: product.id,
    name: product.name,
    description: product.description,
    metadata: product.metadata,
    defaultPriceId:
      typeof product.default_price === 'string'
        ? product.default_price
        : product.default_price?.id,
    usageType: prices.data.find(
      (price) =>
        price.product === product.id &&
        price.recurring?.usage_type === 'metered',
    )?.recurring?.usage_type,
  }));
}

export async function resetTeamCredits(
  stripeCustomerId: string,
): Promise<void> {
  try {
    // Assuming setTeamCreditsByStripeCustomerId is now available in '@/lib/db/queries'
    const { setTeamCreditsByStripeCustomerId } = await import(
      '@/lib/db/queries'
    );
    await setTeamCreditsByStripeCustomerId(stripeCustomerId, 0);
    console.log(`Credits reset to 0 for Stripe customer ${stripeCustomerId}`);
  } catch (error) {
    console.error(
      `Error resetting credits for Stripe customer ${stripeCustomerId}:`,
      error,
    );
    // Depending on error handling strategy, you might want to throw the error
    // or handle it (e.g., by notifying an admin or setting up a retry)
  }
}

export async function checkAvailableCredits(
  stripeCustomerId: string,
  creditsToAdd: number,
): Promise<{ success: boolean; newBalance?: number; message: string }> {
  if (creditsToAdd < 0) {
    return {
      success: false,
      message: 'Credits to add must be a positive number.',
    };
  }

  try {
    const team = await getTeamByStripeCustomerId(stripeCustomerId);
    if (!team) {
      return {
        success: false,
        message: `Team not found for Stripe customer ID: ${stripeCustomerId}`,
      };
    }

    // Fetch active subscription to get product ID
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: 'active', // Consider if 'trialing' should also be included
      limit: 1,
    });

    if (!subscriptions.data || subscriptions.data.length === 0) {
      return {
        success: false,
        message: `No active subscription found for Stripe customer ID: ${stripeCustomerId}`,
      };
    }
    const subscription = subscriptions.data[0];
    const productId = subscription.items.data[0]?.plan?.product as string;

    if (!productId) {
      return {
        success: false,
        message: 'Could not determine product ID from active subscription.',
      };
    }

    // Fetch product details to get credit allowance from metadata
    const product = await stripe.products.retrieve(productId);
    const creditAllowanceStr = product.metadata?.credits_allowance;

    if (typeof creditAllowanceStr !== 'string') {
      return {
        success: false,
        message: `Credit allowance not defined or invalid in metadata for product ID: ${productId}`,
      };
    }

    const creditAllowance = parseInt(creditAllowanceStr, 10);
    if (isNaN(creditAllowance)) {
      return {
        success: false,
        message: `Credit allowance '${creditAllowanceStr}' is not a valid number for product ID: ${productId}`,
      };
    }

    const currentCredits = team.credits || 0; // Treat null/undefined credits as 0
    const potentialNewTotalCredits = currentCredits + creditsToAdd;
    if (potentialNewTotalCredits > creditAllowance) {
      return {
        success: false,
        message: `Cannot perform action. Credits allowance of ${creditAllowance} exceeded. Current credits: ${currentCredits}.`,
      };
    }

    return {
      success: true,
      newBalance: potentialNewTotalCredits,
      message: `Sufficient credits available.`,
    };
  } catch (error) {
    console.error(
      `Error adding credits for Stripe customer ${stripeCustomerId}:`,
      error,
    );
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return {
      success: false,
      message: `Failed to add credits: ${errorMessage}`,
    };
  }
}

export async function addCreditsToTeam(
  stripeCustomerId: string,
  creditsToAdd: number,
): Promise<{ success: boolean; newBalance?: number; message: string }> {
  if (creditsToAdd <= 0) {
    return {
      success: false,
      message: 'Credits to add must be a positive number.',
    };
  }

  try {
    const team = await getTeamByStripeCustomerId(stripeCustomerId);
    if (!team) {
      return {
        success: false,
        message: `Team not found for Stripe customer ID: ${stripeCustomerId}`,
      };
    }

    // Fetch active subscription to get product ID
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: 'active', // Consider if 'trialing' should also be included
      limit: 1,
    });

    if (!subscriptions.data || subscriptions.data.length === 0) {
      return {
        success: false,
        message: `No active subscription found for Stripe customer ID: ${stripeCustomerId}`,
      };
    }
    const subscription = subscriptions.data[0];
    const productId = subscription.items.data[0]?.plan?.product as string;

    if (!productId) {
      return {
        success: false,
        message: 'Could not determine product ID from active subscription.',
      };
    }

    // Fetch product details to get credit allowance from metadata
    const product = await stripe.products.retrieve(productId);
    const creditAllowanceStr = product.metadata?.credits_allowance;

    if (typeof creditAllowanceStr !== 'string') {
      return {
        success: false,
        message: `Credit allowance not defined or invalid in metadata for product ID: ${productId}`,
      };
    }

    const creditAllowance = parseInt(creditAllowanceStr, 10);
    if (isNaN(creditAllowance)) {
      return {
        success: false,
        message: `Credit allowance '${creditAllowanceStr}' is not a valid number for product ID: ${productId}`,
      };
    }

    const currentCredits = team.credits || 0; // Treat null/undefined credits as 0
    const potentialNewTotalCredits = currentCredits + creditsToAdd;

    if (potentialNewTotalCredits > creditAllowance) {
      return {
        success: false,
        message: `Cannot add ${creditsToAdd} credits. New total ${potentialNewTotalCredits} would exceed allowance of ${creditAllowance}. Current credits: ${currentCredits}.`,
      };
    }

    // If all checks pass, update the credits
    await setTeamCreditsByStripeCustomerId(
      stripeCustomerId,
      potentialNewTotalCredits,
    );

    return {
      success: true,
      newBalance: potentialNewTotalCredits,
      message: `Successfully added ${creditsToAdd} credits. New balance: ${potentialNewTotalCredits}`,
    };
  } catch (error) {
    console.error(
      `Error adding credits for Stripe customer ${stripeCustomerId}:`,
      error,
    );
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return {
      success: false,
      message: `Failed to add credits: ${errorMessage}`,
    };
  }
}

export async function deductCreditsFromTeam(
  stripeCustomerId: string,
  creditsToDeduct: number,
): Promise<{ success: boolean; newBalance?: number; message: string }> {
  if (creditsToDeduct <= 0) {
    return {
      success: false,
      message: 'Credits to deduct must be a positive number.',
    };
  }

  try {
    const { getTeamByStripeCustomerId, setTeamCreditsByStripeCustomerId } =
      await import('@/lib/db/queries'); // Using dynamic import as per existing pattern

    const team = await getTeamByStripeCustomerId(stripeCustomerId);
    if (!team) {
      return {
        success: false,
        message: `Team not found for Stripe customer ID: ${stripeCustomerId}`,
      };
    }

    const currentCredits = team.credits || 0; // Treat null/undefined credits as 0

    if (currentCredits < creditsToDeduct) {
      return {
        success: false,
        message: `Insufficient credits. Current: ${currentCredits}, Required: ${creditsToDeduct}.`,
      };
    }

    const newBalance = currentCredits - creditsToDeduct;
    await setTeamCreditsByStripeCustomerId(stripeCustomerId, newBalance);

    return {
      success: true,
      newBalance: newBalance,
      message: `Successfully deducted ${creditsToDeduct} credits. New balance: ${newBalance}`,
    };
  } catch (error) {
    console.error(
      `Error deducting credits for Stripe customer ${stripeCustomerId}:`,
      error,
    );
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return {
      success: false,
      message: `Failed to deduct credits: ${errorMessage}`,
    };
  }
}
