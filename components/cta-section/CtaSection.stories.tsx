import React from 'react';
import { Meta, StoryObj } from '@storybook/nextjs';
import CtaSection, { CtaSectionProps } from './CtaSection';
import content from '../../content.json';

const meta: Meta<typeof CtaSection> = {
  title: 'Landing Page/Sections/CtaSection',
  component: CtaSection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CtaSection>;

export const Default: Story = {
  args: {
    title: content.cta.title,
    description: content.cta.description,
    primaryButtonText: content.cta.primaryButtonText,
    secondaryButtonText: content.cta.secondaryButtonText,
    product: content.metadata.product,
  },
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
