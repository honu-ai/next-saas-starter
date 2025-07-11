'use client';

import { motion } from 'framer-motion';
import { Check, Star, LucideIcon } from 'lucide-react';

export type PricingFeatureProps = {
  feature: string;
  index: number;
  gradientFrom: string;
  gradientTo: string;
  highlight?: boolean;
  highlightIcon?: LucideIcon;
  highlightText?: string;
  delay: number;
};

const PricingFeature: React.FC<PricingFeatureProps> = ({
  feature,
  index,
  gradientFrom,
  gradientTo,
  highlight = false,
  highlightIcon: HighlightIcon = Star,
  highlightText = 'New',
  delay,
}) => {
  return (
    <motion.li
      className='flex items-start'
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <div
        className={`flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white`}
      >
        <Check className='h-4 w-4' />
      </div>
      <span className='text-md ml-3 text-gray-700'>{feature}</span>
      {highlight && (
        <div className='ml-2 flex items-center rounded-full bg-gradient-to-r from-orange-100 to-pink-100 px-2 py-0.5 text-xs font-medium text-pink-700'>
          <HighlightIcon className='mr-1 h-3 w-3' /> {highlightText}
        </div>
      )}
    </motion.li>
  );
};

export default PricingFeature;
