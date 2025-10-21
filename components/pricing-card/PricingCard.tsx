'use client';

import { useState, useActionState } from 'react';
import { motion } from 'framer-motion';

import PricingFeature from '@/components/pricing-feature';
import PricingSubmitButton from '@/components/pricing-submit-button';
import { ActionState } from '@/lib/auth/middleware';

import clsx from 'clsx';

export type PricingCardProps = {
  name: string;
  price: number;
  interval: string;
  features: string[];
  gradientFrom: string;
  gradientTo: string;
  hoverFrom: string;
  hoverTo: string;
  hoverBorderColor: string;
  hoverShadowColor: string;
  featured?: boolean;
  mostPopular?: boolean;
  highlightFeatureIndex?: number;
  priceId?: string;
  usageType?: string;
  trialPeriodDays?: string;
  description?: string;
  checkoutAction?: any;
};

const PricingCard: React.FC<PricingCardProps> = ({
  name,
  price,
  interval,
  features,
  gradientFrom,
  gradientTo,
  hoverFrom,
  hoverTo,
  hoverBorderColor,
  hoverShadowColor,
  featured,
  mostPopular,
  highlightFeatureIndex,
  priceId,
  usageType,
  checkoutAction,
  trialPeriodDays,
  description,
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [state, formAction] = useActionState(
    checkoutAction || (async () => ({ error: 'No action provided' })),
    { error: '' },
  );

  const initialAnimation = featured
    ? { opacity: 0, x: 40 }
    : { opacity: 0, x: -40 };

  return (
    <motion.div
      initial={initialAnimation}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: featured ? 0.2 : 0.1 }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className='relative h-full'
    >
      {/* Most Popular Badge */}
      {mostPopular && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className='absolute -top-4 left-1/2 z-10 -translate-x-1/2 transform'
        >
          <div className='rounded-full border-1 border-orange-500 bg-white px-6 py-2 shadow-lg shadow-orange-400/30'>
            <span className='text-sm font-semibold text-gray-900'>
              Most Popular 🔥
            </span>
          </div>
        </motion.div>
      )}

      <div
        className={`relative flex h-full min-h-[600px] flex-col overflow-hidden rounded-3xl border-2 border-transparent bg-white p-8 shadow-lg transition-all duration-300 ${
          isHovering
            ? `${hoverBorderColor} shadow-xl ${hoverShadowColor} -translate-y-1`
            : ''
        }`}
      >
        {/* Animated background gradient */}
        <div
          className={clsx(
            'absolute inset-0 bg-gradient-to-br to-white opacity-0 transition-opacity duration-300',
            featured ? gradientFrom : 'from-white',
          )}
          style={{ opacity: isHovering ? 0.8 : 0 }}
        />

        <div className='relative grid h-full grid-rows-[auto_auto_1fr_auto] gap-6 md:grid-rows-[200px_auto_1fr_auto]'>
          {/* Header Section */}
          <div className='flex flex-col'>
            <h2 className='text-3xl font-bold text-gray-900'>{name}</h2>

            <p className='text-md mt-4 flex-1 overflow-hidden text-gray-600'>
              {description}
            </p>
          </div>

          {/* Price Section */}
          <div>
            <div className='flex items-baseline'>
              <span className='text-5xl font-bold text-gray-900'>
                ${price / 100}
              </span>
              <span className='ml-2 text-lg text-gray-600'>per {interval}</span>
            </div>
          </div>

          {/* Features Section */}
          <ul className='space-y-5'>
            {trialPeriodDays && (
              <PricingFeature
                key='trial'
                feature={`${trialPeriodDays} days free`}
                index={-1}
                gradientFrom={gradientFrom}
                gradientTo={gradientTo}
                delay={featured ? 0.2 : 0.1}
              />
            )}
            {features.map((feature, index) => (
              <PricingFeature
                key={index}
                feature={feature}
                index={index}
                gradientFrom={gradientFrom}
                gradientTo={gradientTo}
                highlight={index === highlightFeatureIndex}
                delay={featured ? 0.3 + index * 0.1 : 0.2 + index * 0.1}
              />
            ))}
          </ul>

          {/* Button Section */}
          <form action={formAction}>
            <input type='hidden' name='priceId' value={priceId} />
            <input type='hidden' name='usageType' value={usageType} />
            <input
              type='hidden'
              name='trialPeriodDays'
              value={trialPeriodDays}
            />
            {state?.error && (
              <div className='mb-4 text-sm text-red-600'>{state.error}</div>
            )}
            <PricingSubmitButton
              label='Get Started'
              gradientFrom={gradientFrom}
              gradientTo={gradientTo}
              hoverFrom={hoverFrom}
              hoverTo={hoverTo}
            />
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default PricingCard;
