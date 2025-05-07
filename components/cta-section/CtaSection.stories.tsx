import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import CtaSection, { CtaSectionProps } from './CtaSection';

const meta: Meta<typeof CtaSection> = {
  title: 'Components/CtaSection',
  component: CtaSection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CtaSection>;

export const Default: Story = {
  args: {},
};

export const CustomContent: Story = {
  args: {
    title: 'Ready to Transform Your Business Today',
    description:
      'Join thousands of businesses already growing with our platform. Start your journey now.',
    primaryButtonText: 'Get Started Now',
    secondaryButtonText: 'Talk to Sales',
    disclaimerText: 'Start free, no credit card needed',
    companyLogos: [
      {
        src: 'https://via.placeholder.com/120x40/ffffff/333333?text=Logo+1',
        alt: 'Customer Logo 1',
      },
      {
        src: 'https://via.placeholder.com/120x40/ffffff/333333?text=Logo+2',
        alt: 'Customer Logo 2',
      },
      {
        src: 'https://via.placeholder.com/120x40/ffffff/333333?text=Logo+3',
        alt: 'Customer Logo 3',
      },
      {
        src: 'https://via.placeholder.com/120x40/ffffff/333333?text=Logo+4',
        alt: 'Customer Logo 4',
      },
    ],
  },
};
