import { getStripePrices, getStripeProducts } from '@/lib/payments/stripe';

import PricingHeader from '@/components/pricing-header';
import PriceCard from '@/components/pricing-card';

import { checkoutAction } from '@/lib/payments/actions';

const colorVariants = [
  {
    gradientFrom: 'from-orange-400',
    gradientTo: 'to-orange-500',
    hoverBorderColor: 'border-orange-300',
    hoverShadowColor: 'shadow-orange-100',
    hoverFrom: 'from-orange-300',
    hoverTo: 'to-orange-400',
  },
  {
    gradientFrom: 'from-blue-400',
    gradientTo: 'to-blue-500',
    hoverBorderColor: 'border-blue-300',
    hoverShadowColor: 'shadow-blue-100',
    hoverFrom: 'from-blue-300',
    hoverTo: 'to-blue-400',
  },
  {
    gradientFrom: 'from-green-400',
    gradientTo: 'to-green-500',
    hoverBorderColor: 'border-green-300',
    hoverShadowColor: 'shadow-green-100',
    hoverFrom: 'from-green-300',
    hoverTo: 'to-green-400',
  },
  {
    gradientFrom: 'from-purple-400',
    gradientTo: 'to-purple-500',
    hoverBorderColor: 'border-purple-300',
    hoverShadowColor: 'shadow-purple-100',
    hoverFrom: 'from-purple-300',
    hoverTo: 'to-purple-400',
  },
];

// Prices are fresh for one hour max
export const revalidate = 3600;

export default async function PricingPage() {
  const [prices, products] = await Promise.all([
    getStripePrices(),
    getStripeProducts(),
  ]);

  // Sort products by price amount
  const sortedProducts = products.sort((a, b) => {
    const priceA =
      prices.find((price) => price.productId === a.id)?.unitAmount || 0;
    const priceB =
      prices.find((price) => price.productId === b.id)?.unitAmount || 0;
    return priceA - priceB;
  });

  return (
    <main className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
      <PricingHeader
        title='Pricing'
        subtitle="Select a plan that's right for you"
      />
      <div className='mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
        {sortedProducts.map((product, index) => {
          const price = prices.find((price) => price.productId === product?.id);
          const colors = colorVariants[index % colorVariants.length];

          return (
            <PriceCard
              checkoutAction={checkoutAction}
              key={product.id}
              name={product?.name || 'Base'}
              price={price?.unitAmount || 0}
              interval={price?.interval || ''}
              trialPeriodDays={product?.metadata?.trial_period_days}
              usageType={product?.usageType}
              features={product?.metadata?.features?.split(',') || []}
              {...colors}
              featured={true}
              priceId={price?.id}
            />
          );
        })}
      </div>
    </main>
  );
}
