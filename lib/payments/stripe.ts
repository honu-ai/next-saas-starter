import Stripe from 'stripe';
import { redirect } from 'next/navigation';
import { User } from '@/lib/db/schema';
import {
  getUserByStripeCustomerId,
  getUser,
  updateUserSubscription,
  setUserCreditsByStripeCustomerId,
} from '@/lib/db/queries';
import content from '@/content.json';

export const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
  apiVersion: '2025-09-30.clover',
});

export async function createCheckoutSession({
  user,
  priceId,
  usageType,
  trialPeriodDays,
}: {
  user: User | null;
  priceId: string;
  usageType?: string;
  trialPeriodDays?: number;
}) {
  const currentUser = await getUser();

  if (!user || !currentUser) {
    redirect(`/sign-up?redirect=checkout&priceId=${priceId}`);
  }
  if (user.stripeCustomerId) {
    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripeCustomerId || undefined,
      status: 'all',
      limit: 1,
    });

    const relevantSubscription = subscriptions.data.find((sub) =>
      ['active', 'trialing'].includes(sub.status),
    );

    if (relevantSubscription) {
      const portalSession = await createCustomerPortalSession(user);
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
    customer: user.stripeCustomerId || undefined,
    client_reference_id: currentUser.id.toString(),
    allow_promotion_codes: true,
    ...(trialPeriodDays
      ? {
          subscription_data: {
            trial_period_days: trialPeriodDays,
          },
        }
      : {}),
  });

  redirect(session.url!);
}

export async function createCustomerPortalSession(user: User) {
  if (!user.stripeCustomerId || !user.stripeProductId) {
    redirect('/pricing');
  }

  let configuration: Stripe.BillingPortal.Configuration;
  const configurations = await stripe.billingPortal.configurations.list();

  if (configurations.data.length > 0) {
    configuration = configurations.data[0];
  } else {
    const product = await stripe.products.retrieve(user.stripeProductId);
    if (!product.active) {
      throw new Error("User's product is not active in Stripe");
    }

    const prices = await stripe.prices.list({
      product: product.id,
      active: true,
    });
    if (prices.data.length === 0) {
      throw new Error("No active prices found for the user's product");
    }

    configuration = await stripe.billingPortal.configurations.create({
      business_profile: {
        headline: 'Manage your subscription',
      },
      features: {
        payment_method_update: {
          enabled: true,
        },
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
    customer: user.stripeCustomerId,
    return_url: `${process.env.BASE_URL}/dashboard`,
    configuration: configuration.id,
  });
}

export interface SerializedSubscription {
  id: string;
  status: string;
  billing_cycle_anchor: number;
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
    billing_cycle_anchor: subscription.billing_cycle_anchor,
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
  const user = await getUserByStripeCustomerId(customerId);

  if (!user) {
    console.error('User not found for Stripe customer:', customerId);
    return;
  }

  if (status === 'active' || status === 'trialing') {
    const plan = subscription.items.data[0]?.plan;
    await updateUserSubscription(user.id, {
      stripeSubscriptionId: subscriptionId,
      stripeProductId: plan?.product as string,
      planName: (plan?.product as Stripe.Product).name,
      subscriptionStatus: status,
    });
  } else if (status === 'canceled' || status === 'unpaid') {
    await updateUserSubscription(user.id, {
      stripeSubscriptionId: null,
      stripeProductId: null,
      planName: null,
      subscriptionStatus: status,
      credits: null,
    });
  }
}

export async function getStripePrices() {
  const products = await stripe.products.search({
    query: `metadata["business_id"]:"${content.metadata.brandName}" AND active:"true"`,
    expand: ['data.default_price'],
  });

  if (products.data.length === 0) {
    return [];
  }

  const productIds = products.data.map((p) => p.id);
  const allPrices: Stripe.Price[] = [];

  for (const productId of productIds) {
    const prices = await stripe.prices.list({
      product: productId,
      active: true,
      type: 'recurring',
      expand: ['data.product'],
    });
    allPrices.push(...prices.data);
  }

  return allPrices.map((price) => ({
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
  const products = await stripe.products.search({
    query: `metadata["business_id"]:"${content.metadata.brandName}" AND active:"true"`,
    expand: ['data.default_price'],
  });
  const prices = await stripe.prices.list();

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

export async function resetUserCredits(
  stripeCustomerId: string,
): Promise<void> {
  try {
    await setUserCreditsByStripeCustomerId(stripeCustomerId, 0);
    console.log(`Credits reset to 0 for Stripe customer ${stripeCustomerId}`);
  } catch (error) {
    console.error(
      `Error resetting credits for Stripe customer ${stripeCustomerId}:`,
      error,
    );
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
    const user = await getUserByStripeCustomerId(stripeCustomerId);
    if (!user) {
      return {
        success: false,
        message: `User not found for Stripe customer ID: ${stripeCustomerId}`,
      };
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: 'active',
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

    const currentCredits = user.credits || 0;
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

export async function addCreditsToUser(
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
    const user = await getUserByStripeCustomerId(stripeCustomerId);
    if (!user) {
      return {
        success: false,
        message: `User not found for Stripe customer ID: ${stripeCustomerId}`,
      };
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: 'active',
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

    const currentCredits = user.credits || 0;
    const potentialNewTotalCredits = currentCredits + creditsToAdd;

    if (potentialNewTotalCredits > creditAllowance) {
      return {
        success: false,
        message: `Cannot add ${creditsToAdd} credits. New total ${potentialNewTotalCredits} would exceed allowance of ${creditAllowance}. Current credits: ${currentCredits}.`,
      };
    }

    await setUserCreditsByStripeCustomerId(
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

export async function deductCreditsFromUser(
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
    const user = await getUserByStripeCustomerId(stripeCustomerId);
    if (!user) {
      return {
        success: false,
        message: `User not found for Stripe customer ID: ${stripeCustomerId}`,
      };
    }

    const currentCredits = user.credits || 0;

    if (currentCredits < creditsToDeduct) {
      return {
        success: false,
        message: `Insufficient credits. Current: ${currentCredits}, Required: ${creditsToDeduct}.`,
      };
    }

    const newBalance = currentCredits - creditsToDeduct;
    await setUserCreditsByStripeCustomerId(stripeCustomerId, newBalance);

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

export async function updateSubscriptionAndResetCredits(
  stripeCustomerId: string,
  subscriptionId: string,
): Promise<void> {
  try {
    console.log(
      `Updating subscription details and resetting credits for customer ${stripeCustomerId}`,
    );

    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['items.data.price.product'],
    });

    await handleSubscriptionChange(subscription);

    const plan = subscription.items.data[0]?.price;
    if (plan) {
      const product =
        typeof plan.product === 'string'
          ? await stripe.products.retrieve(plan.product)
          : (plan.product as Stripe.Product);

      const creditsAllowance = parseInt(
        product.metadata?.credits_allowance || '0',
        10,
      );

      console.log(
        `Setting credits for subscription renewal: ${creditsAllowance} credits for product ${product.id}`,
      );

      await setUserCreditsByStripeCustomerId(
        stripeCustomerId,
        creditsAllowance,
      );
    } else {
      console.warn(
        `No plan found for subscription ${subscriptionId}, setting credits to 0`,
      );
      await setUserCreditsByStripeCustomerId(stripeCustomerId, 0);
    }

    console.log(
      `Successfully updated subscription and credits for customer ${stripeCustomerId}`,
    );
  } catch (error) {
    console.error(
      `Error updating subscription and resetting credits for customer ${stripeCustomerId}:`,
      error,
    );
    throw error;
  }
}
