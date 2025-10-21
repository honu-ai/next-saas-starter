import React from 'react';
import { Meta, StoryFn } from '@storybook/nextjs';
import PricingCard, { PricingCardProps } from './PricingCard';

export default {
  title: 'Landing Page/Components/PricingCard',
  component: PricingCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} as Meta;

const Template: StoryFn<PricingCardProps> = (args) => <PricingCard {...args} />;

export const Default = Template.bind({});
Default.args = {
  name: 'Basic Plan',
  price: 2900,
  interval: 'month',
  features: [
    'Up to 5 users',
    'Basic analytics',
    'Standard support',
    '1GB storage',
  ],
  gradientFrom: 'from-blue-500',
  gradientTo: 'to-indigo-700',
  hoverFrom: 'from-blue-600',
  hoverTo: 'to-indigo-800',
  hoverBorderColor: 'border-blue-300',
  hoverShadowColor: 'shadow-blue-200',
  priceId: 'price_123',
};

export const Featured = Template.bind({});
Featured.args = {
  ...Default.args,
  name: 'Pro Plan',
  price: 4900,
  features: [
    'Unlimited users',
    'Advanced analytics',
    'Priority support',
    '10GB storage',
    'Custom integrations',
  ],
  featured: true,
  highlightFeatureIndex: 2,
  gradientFrom: 'from-purple-500',
  gradientTo: 'to-pink-700',
  hoverFrom: 'from-purple-600',
  hoverTo: 'to-pink-800',
  hoverBorderColor: 'border-purple-300',
  hoverShadowColor: 'shadow-purple-200',
};

export const MostPopular = Template.bind({});
MostPopular.args = {
  ...Featured.args,
  name: 'Premium Plan',
  price: 9900,
  mostPopular: true,
  features: [
    'Exclusive Wellness',
    'Priority Appointments',
    'Increased Discounts',
    'Specialist Consultation',
    'Enhanced Health',
    'Comprehensive Health',
  ],
  description: 'Everything you need for complete wellness management',
  gradientFrom: 'from-gradient-purple-start',
  gradientTo: 'to-gradient-purple-end',
  hoverFrom: 'from-purple-600',
  hoverTo: 'to-pink-800',
  hoverBorderColor: 'border-purple-300',
  hoverShadowColor: 'shadow-purple-200',
};
