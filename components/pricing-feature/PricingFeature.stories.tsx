import React from 'react';
import { Meta, StoryObj } from '@storybook/nextjs';
import { Star, Zap, Crown, Heart, Flame } from 'lucide-react';
import PricingFeature, { PricingFeatureProps } from './PricingFeature';

const meta: Meta<typeof PricingFeature> = {
  title: 'Landing Page/Components/PricingFeature',
  component: PricingFeature,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PricingFeature>;

export const Default: Story = {
  args: {
    feature: 'Unlimited projects',
    index: 0,
    gradientFrom: 'from-blue-400',
    gradientTo: 'to-blue-500',
    highlight: false,
    delay: 0,
  },
};

export const WithDefaultHighlight: Story = {
  args: {
    feature: 'Advanced analytics',
    index: 1,
    gradientFrom: 'from-green-400',
    gradientTo: 'to-green-500',
    highlight: true,
    delay: 0.1,
  },
};

export const WithCustomHighlight: Story = {
  args: {
    feature: 'Priority support',
    index: 2,
    gradientFrom: 'from-purple-400',
    gradientTo: 'to-purple-500',
    highlight: true,
    highlightIcon: Zap,
    highlightText: 'Fast',
    delay: 0.2,
  },
};

export const WithPremiumHighlight: Story = {
  args: {
    feature: 'Premium templates',
    index: 3,
    gradientFrom: 'from-orange-400',
    gradientTo: 'to-orange-500',
    highlight: true,
    highlightIcon: Crown,
    highlightText: 'Premium',
    delay: 0.3,
  },
};

export const WithPopularHighlight: Story = {
  args: {
    feature: 'Team collaboration',
    index: 4,
    gradientFrom: 'from-pink-400',
    gradientTo: 'to-pink-500',
    highlight: true,
    highlightIcon: Heart,
    highlightText: 'Popular',
    delay: 0.4,
  },
};

export const WithHotHighlight: Story = {
  args: {
    feature: 'AI-powered suggestions',
    index: 5,
    gradientFrom: 'from-red-400',
    gradientTo: 'to-red-500',
    highlight: true,
    highlightIcon: Flame,
    highlightText: 'Hot',
    delay: 0.5,
  },
};

export const MultipleFeatures: Story = {
  render: () => (
    <ul className='space-y-4'>
      <PricingFeature
        feature='Unlimited projects'
        index={0}
        gradientFrom='from-blue-400'
        gradientTo='to-blue-500'
        highlight={false}
        delay={0}
      />
      <PricingFeature
        feature='Advanced analytics'
        index={1}
        gradientFrom='from-green-400'
        gradientTo='to-green-500'
        highlight={true}
        delay={0.1}
      />
      <PricingFeature
        feature='Priority support'
        index={2}
        gradientFrom='from-purple-400'
        gradientTo='to-purple-500'
        highlight={true}
        highlightIcon={Zap}
        highlightText='Fast'
        delay={0.2}
      />
      <PricingFeature
        feature='Premium templates'
        index={3}
        gradientFrom='from-orange-400'
        gradientTo='to-orange-500'
        highlight={true}
        highlightIcon={Crown}
        highlightText='Premium'
        delay={0.3}
      />
    </ul>
  ),
};
