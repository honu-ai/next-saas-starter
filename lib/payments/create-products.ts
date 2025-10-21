import { stripe } from './stripe';
import Stripe from 'stripe';
import content from '@/content.json';

// Define default products
const defaultProducts = [
  {
    name: 'Basic Plan',
    description: 'Access to basic features',
    unit_amount: 999, // $9.99
    currency: 'usd',
    recurring: {
      interval: 'month',
      trial_period_days: 14,
    },
    metadata: {
      business_id: content.metadata.brandName,
      credits_allowance: '10', // 10 blog posts per month
    },
  },
  {
    name: 'Pro Plan',
    description: 'Access to all features',
    unit_amount: 1999, // $19.99
    currency: 'usd',
    recurring: {
      interval: 'month',
      trial_period_days: 7,
    },
    metadata: {
      business_id: content.metadata.brandName,
      credits_allowance: '25', // 25 blog posts per month
    },
  },
  {
    name: 'Enterprise Plan',
    description: 'Custom solutions for larger teams',
    unit_amount: 4999, // $49.99
    currency: 'usd',
    recurring: {
      interval: 'month',
      trial_period_days: 7,
    },
    metadata: {
      business_id: content.metadata.brandName,
      credits_allowance: '100', // 100 blog posts per month
    },
  },
];

const createStripeProducts = async () => {
  console.log('Creating Stripe products and prices...');

  // Fetch existing products from Stripe
  const existingProducts = await stripe.products.list();
  const existingProductNames = new Set(
    existingProducts.data.map((p) => p.name),
  );

  for (const product of defaultProducts) {
    // Check if the product already exists
    if (existingProductNames.has(product.name)) {
      console.log(
        `Product '${product.name}' already exists. Skipping creation.`,
      );
      continue;
    }

    const stripeProduct = await stripe.products.create({
      name: product.name,
      description: product.description,
      metadata: product.metadata,
    });

    await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: product.unit_amount,
      currency: product.currency,
      recurring: {
        interval: product.recurring
          .interval as Stripe.PriceCreateParams.Recurring.Interval,
        trial_period_days: product.recurring.trial_period_days,
      },
    });
  }
};

createStripeProducts()
  .catch((error) => {
    console.error('Products creation failed:', error);
    process.exit(1);
  })
  .finally(() => {
    console.log('Products created successfully. Exiting...');
    process.exit(0);
  });
